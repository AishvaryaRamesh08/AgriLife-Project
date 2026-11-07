/**
 * One entry point for every AI feature in the UI.
 *
 * - Server mode (`npm run dev`, AI Studio): POSTs to the Express routes in
 *   server.ts, which hold GEMINI_API_KEY. Behaviour is unchanged.
 * - Static mode (`npm run build:pages`, GitHub Pages): there is no server, so
 *   the browser calls Gemini directly with a key the visitor pastes in. The key
 *   is stored only in that visitor's localStorage and is sent only to Google.
 *
 * Both modes use the same prompts (./aiPrompts.ts) and return the same JSON
 * shapes the server routes return, so the components treat them identically.
 */
import type { GoogleGenAI } from '@google/genai';
import {
  DEFAULT_TEXT_MODEL,
  PHOTO_DISCLAIMER,
  GeminiRequest,
  ChatParams,
  FieldGuideParams,
  PhotoParams,
  TechniqueParams,
  buildChatRequest,
  chatEmptyReply,
  buildFieldGuideRequest,
  fieldGuideFallback,
  buildPhotoRequest,
  buildTechniqueRequest,
} from './aiPrompts';

export const STATIC_AI = import.meta.env.MODE === 'pages';
export const GEMINI_KEY_URL = 'https://aistudio.google.com/apikey';

/* ------------------------------------------------------------------ */
/* Visitor key storage (static mode only)                              */
/* ------------------------------------------------------------------ */

const KEY_STORAGE = 'agrilife_gemini_api_key';
const keyListeners = new Set<() => void>();

export function getStoredKey(): string {
  try {
    return localStorage.getItem(KEY_STORAGE) || '';
  } catch {
    return '';
  }
}

function writeStoredKey(value: string | null) {
  try {
    if (value) localStorage.setItem(KEY_STORAGE, value);
    else localStorage.removeItem(KEY_STORAGE);
  } catch {
    /* storage blocked: key lives only for this page view */
  }
  memoryKey = value || '';
  keyListeners.forEach((fn) => fn());
}

// Fallback for browsers that block localStorage (private mode etc.).
let memoryKey = '';
const currentKey = () => getStoredKey() || memoryKey;

export const hasKey = () => Boolean(currentKey());
export const saveKey = (key: string) => writeStoredKey(key.trim());
export const removeKey = () => writeStoredKey(null);

export function subscribeKey(fn: () => void): () => void {
  keyListeners.add(fn);
  return () => keyListeners.delete(fn);
}

/* ------------------------------------------------------------------ */
/* Key dialog plumbing: <AiKeyDialog> registers itself as the handler  */
/* ------------------------------------------------------------------ */

type KeyDialogHandler = (resolve: (saved: boolean) => void) => void;
let keyDialogHandler: KeyDialogHandler | null = null;

export function registerKeyDialog(handler: KeyDialogHandler): () => void {
  keyDialogHandler = handler;
  return () => {
    if (keyDialogHandler === handler) keyDialogHandler = null;
  };
}

/** Opens the key dialog. Resolves true if the visitor saved a working key. */
export function openKeyDialog(): Promise<boolean> {
  const handler = keyDialogHandler;
  if (!handler) return Promise.resolve(false);
  return new Promise((resolve) => handler(resolve));
}

/**
 * Call before any AI request. Server mode: always ready. Static mode: ready
 * if a key is saved, otherwise asks for one (resolves false if dismissed).
 */
export async function ensureAiReady(): Promise<boolean> {
  if (!STATIC_AI || hasKey()) return true;
  return openKeyDialog();
}

/* ------------------------------------------------------------------ */
/* Gemini in the browser                                               */
/* ------------------------------------------------------------------ */

let client: GoogleGenAI | null = null;
let clientKey = '';

async function getClient(key = currentKey()): Promise<GoogleGenAI> {
  if (!key) throw new Error('NO_KEY');
  if (!client || clientKey !== key) {
    // Loaded on demand so visitors who never use AI don't download the SDK.
    const { GoogleGenAI } = await import('@google/genai');
    client = new GoogleGenAI({ apiKey: key });
    clientKey = key;
  }
  return client;
}

async function generateInBrowser(request: GeminiRequest): Promise<string> {
  const ai = await getClient();
  const response = await ai.models.generateContent({
    model: DEFAULT_TEXT_MODEL,
    contents: request.contents,
    config: {
      systemInstruction: request.systemInstruction,
      ...(request.json ? { responseMimeType: 'application/json' } : {}),
    },
  });
  return response.text || '';
}

export type KeyProblem = 'invalid' | 'quota' | 'network' | 'other';

export function classifyError(error: unknown): KeyProblem {
  const status = (error as { status?: number })?.status;
  const message = String((error as { message?: string })?.message || error);
  if (message === 'NO_KEY' || /API key not valid|API_KEY_INVALID|PERMISSION_DENIED|unregistered callers/i.test(message)) {
    return 'invalid';
  }
  if (status === 401 || status === 403) return 'invalid';
  if (status === 429 || /RESOURCE_EXHAUSTED|quota/i.test(message)) return 'quota';
  if (error instanceof TypeError || /Failed to fetch|NetworkError/i.test(message)) return 'network';
  return 'other';
}

export function describeKeyProblem(problem: KeyProblem, language: 'en' | 'es' = 'en'): string {
  const es = language === 'es';
  switch (problem) {
    case 'invalid':
      return es
        ? 'Google rechazó su clave de Gemini. Ábrala en Ajustes → Clave de IA para cambiarla.'
        : 'Google rejected your Gemini API key. Open Settings → AI key to update it.';
    case 'quota':
      return es
        ? 'Su clave de Gemini alcanzó su límite de uso. Espere un minuto e intente de nuevo.'
        : 'Your Gemini key hit its usage limit. Wait a minute and try again.';
    case 'network':
      return es
        ? 'No se pudo conectar con Gemini. Revise su conexión e intente de nuevo.'
        : "Couldn't reach Gemini. Check your connection and try again.";
    default:
      return es
        ? 'El asistente de IA no está disponible ahora. Consulte el resumen escrito o su oficina de Extensión.'
        : 'The AI assistant is unavailable right now. Use the written summary or contact your county Extension office.';
  }
}

/**
 * Checks a key before saving it. models.get costs no tokens and also confirms
 * the key can reach the model this app uses.
 */
export async function verifyKey(key: string): Promise<KeyProblem | null> {
  try {
    const ai = await getClient(key.trim());
    await ai.models.get({ model: DEFAULT_TEXT_MODEL });
    return null;
  } catch (error) {
    client = null; // don't keep a client built on a rejected key
    return classifyError(error);
  }
}

/* ------------------------------------------------------------------ */
/* The four AI features                                                */
/* ------------------------------------------------------------------ */

async function postJson(path: string, body: unknown): Promise<any> {
  const res = await fetch(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

/** Returns { reply } or { error, fallback }. */
export async function askChat(params: ChatParams): Promise<{ reply?: string; error?: string; fallback?: string }> {
  if (!STATIC_AI) return postJson('/api/gemini/chat', params);
  try {
    const reply = await generateInBrowser(buildChatRequest(params));
    return { reply: reply || chatEmptyReply(params.extensionOfficeUrl) };
  } catch (error) {
    console.error('Chat error:', error);
    return { error: String(error), fallback: describeKeyProblem(classifyError(error), params.language) };
  }
}

/** Returns { fieldGuide } or { error }. */
export async function generateFieldGuide(params: FieldGuideParams): Promise<{ fieldGuide?: any; error?: string }> {
  if (!STATIC_AI) return postJson('/api/gemini/field-guide', params);
  try {
    const raw = (await generateInBrowser(buildFieldGuideRequest(params))) || '{}';
    try {
      return { fieldGuide: JSON.parse(raw) };
    } catch {
      return { fieldGuide: fieldGuideFallback(params.county, params.crop) };
    }
  } catch (error) {
    console.error('Field guide error:', error);
    return { error: describeKeyProblem(classifyError(error), params.language) };
  }
}

/** Returns { description, disclaimer } or { error, fallback }. */
export async function analyzePhoto(
  params: PhotoParams
): Promise<{ description?: string; disclaimer?: string; error?: string; fallback?: string }> {
  if (!STATIC_AI) return postJson('/api/gemini/photo-analyze', params);
  try {
    const description = await generateInBrowser(buildPhotoRequest(params));
    return { description, disclaimer: PHOTO_DISCLAIMER };
  } catch (error) {
    console.error('Photo analysis error:', error);
    return { error: String(error), fallback: describeKeyProblem(classifyError(error), params.language) };
  }
}

/** Returns the technique JSON ({ sufficient_detail, summary, steps }) or { error }. */
export async function extractTechniqueSteps(params: TechniqueParams): Promise<any> {
  if (!STATIC_AI) return postJson('/api/gemini/technique-steps', params);
  try {
    return JSON.parse((await generateInBrowser(buildTechniqueRequest(params))) || '{}');
  } catch (error) {
    console.error('Technique extraction error:', error);
    return { error: describeKeyProblem(classifyError(error), params.language) };
  }
}
