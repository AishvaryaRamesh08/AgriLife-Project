import React from 'react';
import {
  ArrowRight,
  AudioLines,
  BookOpen,
  CheckCircle2,
  Clock,
  Compass,
  Eye,
  FileText,
  GraduationCap,
  Languages,
  Lock,
  MessageCircleQuestion,
  Palette,
  ShieldCheck,
  Sparkles,
  Sprout,
  Tractor,
  Users,
  Volume2,
} from 'lucide-react';
import heroImg from '../assets/images/hero_texas_agriculture_1794072805147.jpg';

interface AboutPageProps {
  language: 'en' | 'es';
  lowDataMode: boolean;
  onBrowseResearch: () => void;
  onOpenChat: () => void;
}

type Lang = 'en' | 'es';
type Icon = React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>;

/* ------------------------------------------------------------------ */
/* Copy (project brief). Spanish mirrors the English section by section */
/* ------------------------------------------------------------------ */

const COPY = {
  en: {
    eyebrow: 'About the project',
    title: 'Texas A&M research, made practical.',
    lead: 'AgriLife Research-to-Field turns Texas A&M research into plain-language, county- and crop-specific guidance for Texas farmers and ranchers, in English or Spanish.',
    browse: 'Browse the research',
    ask: 'Ask AgriLife AI',
    source: 'Source',

    s1: {
      label: 'Target population',
      title: 'Who it’s for',
      body: 'Texas farmers and ranchers, and the Texas A&M AgriLife researchers and Extension agents who serve them.',
      audiences: ['Farmers & ranchers', 'AgriLife researchers', 'Extension agents'],
      stats: [
        { value: '230,662', label: 'farms in Texas' },
        { value: '402,876', label: 'producers running them' },
      ],
      evidence: 'Texas leads the nation with 230,662 farms, run by 402,876 producers.',
      source: 'USDA',
    },
    s2: {
      label: 'Problem statement',
      title: 'Research isn’t reaching the field',
      body: [
        'Texas A&M produces valuable, publicly funded research on drought, pests, soil, and irrigation, but it’s written for scientists: long, technical, and often paywalled.',
        'Farmers don’t have time to read a 30-page study or work out whether it applies to their crop and county, and Extension agents can’t rewrite every finding.',
      ],
      outcome: 'As a result, research reaches the field slowly or not at all.',
      barriers: ['Written for scientists', 'Long and technical', 'Often paywalled'],
    },
    s3: {
      label: 'Proposed solution',
      title: 'Plain-language guidance for every county and crop',
      body: 'AgriLife Research-to-Field is a mobile-first website that turns Texas A&M research into plain-language, county- and crop-specific guidance. Farmers can read it, listen to it, see it, or ask about it in English or Spanish. Every answer comes from the research itself, and a specialist reviews it before it goes out.',
      modes: [
        { name: 'Read', text: 'Plain-language summaries' },
        { name: 'Listen', text: 'Audio explainers' },
        { name: 'See', text: 'Diagrams and step illustrations' },
        { name: 'Ask', text: 'Answers from the research only' },
      ],
      badges: ['English & Spanish', 'Reviewed by a specialist'],
    },
    s4: {
      label: 'Google Labs tools',
      title: 'Built with Google Labs',
      tools: [
        {
          name: 'NotebookLM',
          text: 'Turns research papers into plain-language audio explainers farmers can listen to on the go, tied to the source.',
        },
        {
          name: 'Opal',
          text: 'Builds field guides tailored to each county and crop, such as “sorghum drought tips for Lubbock County.”',
        },
        {
          name: 'Whisk',
          text: 'Creates clear visuals, such as planting diagrams and step-by-step technique illustrations.',
        },
        {
          name: 'Google AI Studio',
          text: 'Hosts the website, with a grounded chatbot, voice input, Spanish translation, and live weather.',
        },
      ],
    },
    s5: {
      label: 'Impact',
      title: 'What changes when research is put to use',
      items: [
        {
          value: '230,662',
          headline: 'farms reached with research they can use in minutes, not hours',
          detail: 'A 30-page paper becomes a 2-minute listen.',
        },
        {
          value: '39,907',
          headline: 'Hispanic producers served in Spanish, the most of any state',
          evidence: 'Texas had more Hispanic producers than any other state.',
          source: 'USDA',
        },
        {
          value: '250',
          headline: 'Extension offices across 254 counties get a force multiplier',
          evidence: 'AgriLife Extension’s 250 county offices serve all 254 counties, and agents no longer have to rewrite every study.',
          source: 'Texas A&M',
        },
        {
          value: '59.9',
          headline: 'is the average farmer age',
          detail: 'Audio and large-text formats fit how farmers actually work.',
          evidence: 'The average age of a Texas farmer is 59.9.',
          source: 'Texas Farm Bureau',
        },
        {
          value: '$32.2B',
          headline: 'in Texas agriculture benefits when research is put to use',
          evidence: 'Texas agricultural products were valued at $32.2 billion.',
          source: 'USDA',
        },
      ],
      outcomes: [
        { who: 'Farmers', text: 'get research faster, in formats that fit their day.' },
        { who: 'Agents', text: 'save time.' },
        { who: 'Researchers', text: 'see their work used.' },
        { who: 'Texas', text: 'gets more value from its research.' },
      ],
    },
  },

  es: {
    eyebrow: 'Sobre el proyecto',
    title: 'Investigación de Texas A&M, hecha práctica.',
    lead: 'AgriLife Research-to-Field convierte la investigación de Texas A&M en orientación sencilla y específica para cada condado y cultivo, para los agricultores y ganaderos de Texas, en inglés o en español.',
    browse: 'Explorar la investigación',
    ask: 'Preguntar a AgriLife IA',
    source: 'Fuente',

    s1: {
      label: 'Población objetivo',
      title: 'Para quién es',
      body: 'Los agricultores y ganaderos de Texas, y los investigadores y agentes de Extensión de Texas A&M AgriLife que los atienden.',
      audiences: ['Agricultores y ganaderos', 'Investigadores de AgriLife', 'Agentes de Extensión'],
      stats: [
        { value: '230,662', label: 'granjas en Texas' },
        { value: '402,876', label: 'productores a cargo' },
      ],
      evidence: 'Texas encabeza el país con 230,662 granjas, a cargo de 402,876 productores.',
      source: 'USDA',
    },
    s2: {
      label: 'Planteamiento del problema',
      title: 'La investigación no llega al campo',
      body: [
        'Texas A&M produce investigación valiosa, financiada con fondos públicos, sobre sequía, plagas, suelos y riego, pero está escrita para científicos: es larga, técnica y a menudo de pago.',
        'Los agricultores no tienen tiempo de leer un estudio de 30 páginas ni de averiguar si aplica a su cultivo y condado, y los agentes de Extensión no pueden reescribir cada hallazgo.',
      ],
      outcome: 'Como resultado, la investigación llega al campo lentamente o no llega.',
      barriers: ['Escrita para científicos', 'Larga y técnica', 'A menudo de pago'],
    },
    s3: {
      label: 'Solución propuesta',
      title: 'Orientación sencilla para cada condado y cultivo',
      body: 'AgriLife Research-to-Field es un sitio web pensado primero para el celular que convierte la investigación de Texas A&M en orientación sencilla y específica para cada condado y cultivo. Los agricultores pueden leerla, escucharla, verla o hacer preguntas sobre ella en inglés o en español. Cada respuesta proviene de la propia investigación, y un especialista la revisa antes de publicarla.',
      modes: [
        { name: 'Leer', text: 'Resúmenes en lenguaje sencillo' },
        { name: 'Escuchar', text: 'Explicaciones en audio' },
        { name: 'Ver', text: 'Diagramas e ilustraciones paso a paso' },
        { name: 'Preguntar', text: 'Respuestas solo de la investigación' },
      ],
      badges: ['Inglés y español', 'Revisado por un especialista'],
    },
    s4: {
      label: 'Herramientas de Google Labs',
      title: 'Hecho con Google Labs',
      tools: [
        {
          name: 'NotebookLM',
          text: 'Convierte artículos de investigación en explicaciones en audio, en lenguaje sencillo, que los agricultores pueden escuchar donde estén, vinculadas a la fuente.',
        },
        {
          name: 'Opal',
          text: 'Crea guías de campo adaptadas a cada condado y cultivo, como “consejos de sequía para sorgo en el condado de Lubbock”.',
        },
        {
          name: 'Whisk',
          text: 'Crea elementos visuales claros, como diagramas de siembra e ilustraciones de técnicas paso a paso.',
        },
        {
          name: 'Google AI Studio',
          text: 'Aloja el sitio web, con un chatbot basado en la investigación, entrada por voz, traducción al español y clima en vivo.',
        },
      ],
    },
    s5: {
      label: 'Impacto',
      title: 'Lo que cambia cuando la investigación se pone en práctica',
      items: [
        {
          value: '230,662',
          headline: 'granjas reciben investigación que pueden usar en minutos, no en horas',
          detail: 'Un artículo de 30 páginas se convierte en 2 minutos de audio.',
        },
        {
          value: '39,907',
          headline: 'productores hispanos atendidos en español, la mayor cifra de cualquier estado',
          evidence: 'Texas tenía más productores hispanos que cualquier otro estado.',
          source: 'USDA',
        },
        {
          value: '250',
          headline: 'oficinas de Extensión en 254 condados multiplican su alcance',
          evidence: 'Las 250 oficinas de condado de AgriLife Extension atienden los 254 condados, y los agentes ya no tienen que reescribir cada estudio.',
          source: 'Texas A&M',
        },
        {
          value: '59.9',
          headline: 'años es la edad promedio del agricultor',
          detail: 'Los formatos de audio y letra grande se ajustan a cómo trabajan realmente los agricultores.',
          evidence: 'La edad promedio de un agricultor de Texas es de 59.9 años.',
          source: 'Texas Farm Bureau',
        },
        {
          value: '$32.2B',
          headline: 'de la agricultura de Texas se benefician cuando la investigación se pone en práctica',
          evidence: 'Los productos agrícolas de Texas se valoraron en $32.2 mil millones.',
          source: 'USDA',
        },
      ],
      outcomes: [
        { who: 'Los agricultores', text: 'reciben la investigación más rápido, en formatos que se ajustan a su día.' },
        { who: 'Los agentes', text: 'ahorran tiempo.' },
        { who: 'Los investigadores', text: 'ven su trabajo en uso.' },
        { who: 'Texas', text: 'obtiene más valor de su investigación.' },
      ],
    },
  },
} as const;

const AUDIENCE_ICONS: Icon[] = [Tractor, GraduationCap, Users];
const BARRIER_ICONS: Icon[] = [FileText, Clock, Lock];
const MODE_ICONS: Icon[] = [BookOpen, Volume2, Eye, MessageCircleQuestion];
const BADGE_ICONS: Icon[] = [Languages, ShieldCheck];
const TOOL_ICONS: Icon[] = [AudioLines, Compass, Palette, Sparkles];

/* ------------------------------------------------------------------ */

const SectionHeading: React.FC<{ index: string; label: string; title: string; id: string }> = ({
  index,
  label,
  title,
  id,
}) => (
  <div className="mb-5">
    <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#500000]">
      <span className="inline-flex items-center justify-center min-w-[2rem] h-6 px-1.5 rounded-md bg-[#500000] text-white tabular-nums">
        {index}
      </span>
      {label}
    </p>
    <h2 id={id} className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 text-balance">
      {title}
    </h2>
  </div>
);

const SourceNote: React.FC<{ evidence: string; source: string; sourceLabel: string }> = ({
  evidence,
  source,
  sourceLabel,
}) => (
  <p className="text-xs text-stone-500 leading-relaxed">
    {evidence}{' '}
    <span className="whitespace-nowrap font-semibold text-stone-600">
      {sourceLabel}: {source}
    </span>
  </p>
);

export const AboutPage: React.FC<AboutPageProps> = ({ language, lowDataMode, onBrowseResearch, onOpenChat }) => {
  const t = COPY[language as Lang];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Hero */}
      <section
        aria-labelledby="about-title"
        className="relative overflow-hidden rounded-2xl bg-[#500000] text-white shadow-sm"
      >
        {!lowDataMode && (
          <>
            <img
              src={heroImg}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
              loading="eager"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#3b0000] via-[#500000]/85 to-[#500000]/30" />
          </>
        )}
        <div className="relative px-5 py-10 sm:px-10 sm:py-14 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-300">{t.eyebrow}</p>
          <h1 id="about-title" className="mt-2 text-3xl sm:text-5xl font-black tracking-tight leading-[1.05] text-balance">
            {t.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-stone-100 leading-relaxed text-pretty">{t.lead}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onBrowseResearch}
              className="min-h-[48px] px-5 rounded-xl bg-white text-[#500000] font-bold text-sm inline-flex items-center gap-2 hover:bg-stone-100 transition-colors shadow-sm"
            >
              <BookOpen className="w-4 h-4" aria-hidden="true" />
              {t.browse}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={onOpenChat}
              className="min-h-[48px] px-5 rounded-xl bg-white/10 border border-white/30 text-white font-bold text-sm inline-flex items-center gap-2 hover:bg-white/20 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-300" aria-hidden="true" />
              {t.ask}
            </button>
          </div>
        </div>
      </section>

      {/* 01 + 02 side by side on desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 01 · Target population */}
        <section
          aria-labelledby="about-s1"
          className="card-surface bg-white border border-stone-200 rounded-2xl p-5 sm:p-7 shadow-xs flex flex-col"
        >
          <SectionHeading index="01" label={t.s1.label} title={t.s1.title} id="about-s1" />
          <p className="text-stone-700 leading-relaxed">{t.s1.body}</p>

          <ul className="mt-4 flex flex-wrap gap-2">
            {t.s1.audiences.map((a, i) => {
              const Icon = AUDIENCE_ICONS[i];
              return (
                <li
                  key={a}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-stone-100 px-3 py-2 text-sm font-semibold text-stone-800"
                >
                  <Icon className="w-4 h-4 text-[#500000]" aria-hidden="true" />
                  {a}
                </li>
              );
            })}
          </ul>

          <div className="mt-auto pt-6">
            <dl className="grid grid-cols-2 gap-3">
              {t.s1.stats.map((s) => (
                <div key={s.label} className="rounded-xl bg-[#500000]/[0.06] border border-[#500000]/10 p-4">
                  <dd className="text-2xl sm:text-3xl font-black tracking-tight text-[#500000] tabular-nums">
                    {s.value}
                  </dd>
                  <dt className="text-sm font-semibold text-stone-700">{s.label}</dt>
                </div>
              ))}
            </dl>
            <div className="mt-3">
              <SourceNote evidence={t.s1.evidence} source={t.s1.source} sourceLabel={t.source} />
            </div>
          </div>
        </section>

        {/* 02 · Problem statement */}
        <section
          aria-labelledby="about-s2"
          className="card-surface bg-white border border-stone-200 rounded-2xl p-5 sm:p-7 shadow-xs flex flex-col"
        >
          <SectionHeading index="02" label={t.s2.label} title={t.s2.title} id="about-s2" />
          <div className="space-y-3 text-stone-700 leading-relaxed">
            {t.s2.body.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>

          <ul className="mt-5 flex flex-wrap gap-2">
            {t.s2.barriers.map((b, i) => {
              const Icon = BARRIER_ICONS[i];
              return (
                <li
                  key={b}
                  className="inline-flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm font-semibold text-stone-800"
                >
                  <Icon className="w-4 h-4 shrink-0 text-amber-600" aria-hidden="true" />
                  {b}
                </li>
              );
            })}
          </ul>

          <p className="mt-auto pt-5">
            <span className="block rounded-xl border-l-4 border-amber-500 bg-amber-50 px-4 py-3 text-base font-bold text-stone-900">
              {t.s2.outcome}
            </span>
          </p>
        </section>
      </div>

      {/* 03 · Proposed solution */}
      <section
        aria-labelledby="about-s3"
        className="card-surface bg-white border border-stone-200 rounded-2xl p-5 sm:p-7 shadow-xs"
      >
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-10">
          <div className="lg:col-span-2">
            <SectionHeading index="03" label={t.s3.label} title={t.s3.title} id="about-s3" />
            <p className="text-stone-700 leading-relaxed">{t.s3.body}</p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {t.s3.badges.map((b, i) => {
                const Icon = BADGE_ICONS[i];
                return (
                  <li
                    key={b}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-1.5 text-sm font-semibold text-emerald-900"
                  >
                    <Icon className="w-4 h-4 text-emerald-700" aria-hidden="true" />
                    {b}
                  </li>
                );
              })}
            </ul>
          </div>

          <ul className="lg:col-span-3 grid grid-cols-2 gap-3 content-start">
            {t.s3.modes.map((m, i) => {
              const Icon = MODE_ICONS[i];
              return (
                <li key={m.name} className="rounded-xl border border-stone-200 bg-stone-50 p-4 sm:p-5">
                  <div className="w-11 h-11 rounded-xl bg-[#500000] text-white flex items-center justify-center">
                    <Icon className="w-5 h-5 text-amber-300" aria-hidden="true" />
                  </div>
                  <p className="mt-3 text-lg font-extrabold text-stone-900">{m.name}</p>
                  <p className="text-sm text-stone-600 leading-snug">{m.text}</p>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 04 · Google Labs tools */}
      <section
        aria-labelledby="about-s4"
        className="card-surface bg-white border border-stone-200 rounded-2xl p-5 sm:p-7 shadow-xs"
      >
        <SectionHeading index="04" label={t.s4.label} title={t.s4.title} id="about-s4" />
        <ul className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
          {t.s4.tools.map((tool, i) => {
            const Icon = TOOL_ICONS[i];
            return (
              <li key={tool.name} className="rounded-xl border border-stone-200 p-5 flex flex-col gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-lg bg-[#500000]/10 text-[#500000] flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-base font-extrabold text-stone-900">{tool.name}</h3>
                </div>
                <p className="text-sm text-stone-700 leading-relaxed">{tool.text}</p>
              </li>
            );
          })}
        </ul>
      </section>

      {/* 05 · Impact */}
      <section
        aria-labelledby="about-s5"
        className="card-surface bg-white border border-stone-200 rounded-2xl p-5 sm:p-7 shadow-xs"
      >
        <SectionHeading index="05" label={t.s5.label} title={t.s5.title} id="about-s5" />
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {t.s5.items.map((item) => (
            <li key={item.value} className="rounded-xl border border-stone-200 bg-stone-50 p-5 flex flex-col gap-2">
              <p className="text-4xl font-black tracking-tight text-[#500000] tabular-nums leading-none">
                {item.value}
              </p>
              <p className="text-base font-bold text-stone-900 leading-snug">{item.headline}</p>
              {'detail' in item && item.detail && (
                <p className="text-sm text-stone-700 leading-relaxed">{item.detail}</p>
              )}
              {'evidence' in item && item.evidence && (
                <div className="mt-auto pt-2 border-t border-stone-200">
                  <SourceNote evidence={item.evidence} source={item.source} sourceLabel={t.source} />
                </div>
              )}
            </li>
          ))}

          {/* Outcomes fill the last grid cell */}
          <li className="rounded-xl bg-[#500000] text-white p-5 flex flex-col justify-center gap-2.5">
            {t.s5.outcomes.map((o) => (
              <p key={o.who} className="flex items-start gap-2 text-sm leading-snug">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0 text-amber-300" aria-hidden="true" />
                <span>
                  <strong className="font-extrabold">{o.who}</strong> {o.text}
                </span>
              </p>
            ))}
          </li>
        </ul>
      </section>

      {/* Closing call to action */}
      <section className="card-surface rounded-2xl border border-stone-200 bg-[#F5F5F5] p-5 sm:p-7 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-[#500000] text-white flex items-center justify-center shrink-0">
            <Sprout className="w-5 h-5 text-amber-300" aria-hidden="true" />
          </div>
          <p className="text-lg font-extrabold text-stone-900 text-balance">{t.title}</p>
        </div>
        <button
          type="button"
          onClick={onBrowseResearch}
          className="min-h-[48px] px-5 rounded-xl bg-[#500000] hover:bg-[#680000] text-white font-bold text-sm inline-flex items-center gap-2 transition-colors shadow-sm"
        >
          {t.browse}
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </section>
    </div>
  );
};
