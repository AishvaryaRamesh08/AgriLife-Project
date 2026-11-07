/**
 * Gemini prompt builders shared by both runtimes:
 *  - server.ts (Express, used by `npm run dev` and AI Studio)
 *  - src/services/aiClient.ts (browser, used by the static GitHub Pages build)
 *
 * Keep every prompt here so the two runtimes can never drift apart.
 */
import type { ContentListUnion } from '@google/genai';

export const DEFAULT_TEXT_MODEL = 'gemini-3.8-flash';
export const DEFAULT_EXTENSION_URL = 'https://counties.agrilife.org/';
export const PHOTO_DISCLAIMER =
  "I can't diagnose from a photo. Here is related research, and your county Extension office can confirm.";

export interface GeminiRequest {
  systemInstruction: string;
  contents: ContentListUnion;
  json?: boolean;
}

const targetLanguage = (language?: string) =>
  language === 'es' ? 'Spanish (Español)' : 'English';

/* ------------------------------------------------------------------ */
/* 1. ARTICLE / LIBRARY CHATBOT                                        */
/* ------------------------------------------------------------------ */

export interface ChatParams {
  articleText?: string;
  articleTitle?: string;
  libraryCorpus?: string;
  extensionOfficeUrl?: string;
  userMessage: string;
  conversationHistory?: { role: string; content: string }[];
  language?: 'en' | 'es';
}

export function chatEmptyReply(extensionOfficeUrl?: string): string {
  return (
    "This research doesn't cover that. I don't want to guess. Your county AgriLife Extension office can help: " +
    (extensionOfficeUrl || DEFAULT_EXTENSION_URL)
  );
}

/**
 * Strict grounding: answers ONLY from the provided article text (article
 * mode) or the provided library corpus (library mode).
 */
export function buildChatRequest(p: ChatParams): GeminiRequest {
  const targetLang = targetLanguage(p.language);
  const officeUrl = p.extensionOfficeUrl || DEFAULT_EXTENSION_URL;

  let systemInstruction = '';
  if (p.articleText) {
    systemInstruction = `You are the AgriLife Research-to-Field assistant for Texas farmers and ranchers.
Your audience is hardworking agricultural producers: talk in plain, warm, friendly Texas everyday language. Minimal jargon, no academic stiffness.
Strict rules:
1. You may ONLY answer using the provided article text below. NEVER use outside knowledge, general agricultural training, or web search.
2. Never invent numbers, chemical application rates, dates, dosage rates, or findings.
3. Keep answers concise: 2 to 5 sentences maximum.
4. Reply in ${targetLang} (or match the language the user wrote in).
5. At the very end of every valid answer, you MUST append on a new line:
   "From this article: [name the exact section, paragraph, or finding it came from]"
6. If the provided article text does not contain the answer, you MUST reply verbatim or with this exact phrasing:
   "This research doesn't cover that. I don't want to guess. Your county AgriLife Extension office can help: ${officeUrl}"
7. Remind users that results can vary with local weather and soil conditions, and to check with their county Extension agent before making major equipment, planting, or chemical decisions.

ARTICLE TITLE: ${p.articleTitle || 'Texas A&M Research Publication'}
ARTICLE TEXT:
"""
${p.articleText}
"""`;
  } else {
    systemInstruction = `You are the AgriLife Research-to-Field assistant for Texas farmers and ranchers.
Your audience is hardworking agricultural producers across Texas: talk in plain, warm, friendly Texas everyday language. Minimal jargon, no academic stiffness.
Strict rules:
1. Answer questions based on the provided Texas A&M AgriLife research publications and agricultural library below.
2. Synthesize findings across relevant articles to address the farmer's questions regarding Texas crops, soil health, water/irrigation, pests, or livestock.
3. Keep answers practical, actionable, and concise: 3 to 5 sentences maximum.
4. Reply in ${targetLang} (or match the language the user wrote in).
5. At the end of your answer, cite which Texas A&M research article(s) support your advice by writing on a new line:
   "Related Research: [Title of matching study from library]"
6. If the library does not cover the topic, state:
   "Our current research library doesn't have a verified study on that topic yet. For specific local guidance, contact your county AgriLife Extension office: ${officeUrl}"
7. Always advise farmers to verify with their local county Extension agent before making significant chemical, planting, or irrigation investments.

TEXAS A&M AGRILIFE RESEARCH LIBRARY:
"""
${p.libraryCorpus}
"""`;
  }

  const contents = [
    ...(p.conversationHistory || []).map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    })),
    {
      role: 'user',
      parts: [{ text: p.userMessage }],
    },
  ];

  return { systemInstruction, contents };
}

/* ------------------------------------------------------------------ */
/* 2. WHAT THIS MEANS FOR MY FARM (localized field guide)              */
/* ------------------------------------------------------------------ */

export interface FieldGuideParams {
  articleText: string;
  articleTitle: string;
  county: string;
  crop: string;
  language?: 'en' | 'es';
}

export function buildFieldGuideRequest(p: FieldGuideParams): GeminiRequest {
  const targetLang = targetLanguage(p.language);
  const systemInstruction = `You are an expert Texas A&M AgriLife Extension specialist creating a practical 1-page "What this means for my farm" field advisory for a farmer in ${p.county || 'Texas'} growing ${p.crop || 'their crop'}.
STRICT GROUNDING:
- Base your advice ONLY on the research text provided below.
- If the research does NOT cover this county or crop, clearly state: "This research was evaluated in [regions/crops studied in the article] and did not test ${p.county} County or ${p.crop}. Local soils and climate differ."
- Language: Plain farmer language (8th-grade level, large concepts, clear direct instructions). Write in ${targetLang}.
Format your response as JSON with the following keys:
{
  "applies_to_farm": "yes" | "partially" | "no",
  "applicability_explanation": "1-2 clear sentences explaining why this research does or does not apply to this county and crop",
  "practical_steps": ["Step 1...", "Step 2...", "Step 3..."],
  "timing_window": "Best calendar or seasonal timing for this action",
  "cautions": "Key risks, weather limits, or things to avoid",
  "extension_recommendation": "Encouraging closing note pointing to the county AgriLife Extension agent"
}`;

  return {
    systemInstruction,
    contents: `ARTICLE TITLE: ${p.articleTitle}\nARTICLE TEXT:\n${p.articleText}\n\nGenerate the field guide JSON for County: ${p.county}, Crop: ${p.crop}.`,
    json: true,
  };
}

/** Used when the model returns text that isn't valid JSON. */
export function fieldGuideFallback(county: string, crop: string) {
  return {
    applies_to_farm: 'partially',
    applicability_explanation: `This research offers valuable principles for ${crop} in ${county} County, but check local soil types with your Extension agent.`,
    practical_steps: [
      'Check soil moisture and growth stage before applying.',
      'Follow calibrated application equipment guidelines from the study.',
      'Keep records of rainfall and crop response.',
    ],
    timing_window: 'Consult local AgriLife Extension crop calendar.',
    cautions: 'Always adhere to labeled rates and monitor changing weather conditions.',
    extension_recommendation: `Call your ${county} County AgriLife Extension office for local test plot results.`,
  };
}

/* ------------------------------------------------------------------ */
/* 3. ASK WITH A PHOTO (describe only, never diagnose)                 */
/* ------------------------------------------------------------------ */

export interface PhotoParams {
  imageBase64: string;
  mimeType?: string;
  availableArticles?: { id: string; title: string; crops: string[]; topics: string[] }[];
  language?: 'en' | 'es';
}

export function buildPhotoRequest(p: PhotoParams): GeminiRequest {
  const targetLang = targetLanguage(p.language);
  const systemInstruction = `You are the AgriLife Research visual scanner.
CRITICAL SAFETY & GROUNDING MANDATE:
- You must NOT diagnose plant diseases, insect pests, nutrient deficiencies, or soil disorders from a photograph. Photos alone are insufficient for definitive diagnosis in Texas agriculture.
- You must describe what is physically visible in the image (e.g., foliage color patterns, wilting, leaf spots, insect shape, soil crusting, root structure).
- Suggest 1 to 3 relevant topics or matching articles from the provided library titles below.
- You MUST ALWAYS conclude with:
  "${PHOTO_DISCLAIMER}"
- Respond in ${targetLang}.`;

  const articlesList = (p.availableArticles || [])
    .map(
      (a) =>
        `- ID: ${a.id} | Title: "${a.title}" | Crops: ${a.crops.join(', ')} | Topics: ${a.topics.join(', ')}`
    )
    .join('\n');

  return {
    systemInstruction,
    contents: {
      parts: [
        {
          inlineData: {
            mimeType: p.mimeType || 'image/jpeg',
            data: p.imageBase64.replace(/^data:image\/\w+;base64,/, ''),
          },
        },
        {
          text: `Analyze this agricultural photo. Describe what features are visible and identify matching research articles from this list:\n${articlesList}`,
        },
      ],
    },
  };
}

/* ------------------------------------------------------------------ */
/* 4. TECHNIQUE EXTRACTION ("Show me how")                             */
/* ------------------------------------------------------------------ */

export interface TechniqueParams {
  articleText: string;
  articleTitle: string;
  language?: 'en' | 'es';
}

export function buildTechniqueRequest(p: TechniqueParams): GeminiRequest {
  const targetLang = targetLanguage(p.language);
  const systemInstruction = `You are a practical farm equipment and field technique specialist.
Analyze the article text and extract a clear, step-by-step "Show Me How" guide for farmers.
STRICT RULES:
- Extract 3 to 6 numbered steps using ONLY the article text.
- If the article lacks enough detail for clear practical steps, set "sufficient_detail": false and explain what details are missing instead of guessing!
- Write in ${targetLang} using clear, plain, active instructions.
Return JSON with the following structure:
{
  "sufficient_detail": true,
  "summary": "Brief 1-sentence overview of the technique",
  "steps": [
    {
      "step_number": 1,
      "title": "Short title",
      "description": "Clear practical instruction",
      "caution": "Specific safety or timing caution if in article"
    }
  ]
}`;

  return {
    systemInstruction,
    contents: `ARTICLE: ${p.articleTitle}\n\n${p.articleText}`,
    json: true,
  };
}
