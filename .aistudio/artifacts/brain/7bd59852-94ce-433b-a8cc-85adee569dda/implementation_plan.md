# Floating AgriLife Research Chatbot & Global Knowledge Assistant

Transform the static inline "Ask This Article" section into a persistent bottom-right floating launcher with an interactive pop-up chat card accessible across both the main feed and article detail views, automatically switching context between general Texas A&M research guidance and deep single-article Q&A.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following user preferences were confirmed during interactive clarification and govern the implementation:
> - **Main Page Scope**: When opened from the main feed, the assistant answers queries using the entire Texas A&M research article library, county extension recommendations, and crop management principles.
> - **Context Transition**: When navigating into an article detail view, the chat automatically adapts its context to that specific publication while retaining access to general library questions.
> - **Presentation Style**: A floating launcher button anchored in the bottom-right corner with a badge, expanding into an elegant, non-intrusive floating chat card with minimize, maximize, voice input, and field photo scanning.

---

## 1. Overview & Core Concept

- **What It Does**: Replaces the large inline article-bottom chat card with an omnipresent floating circular launcher button in the bottom-right corner. Clicking the button opens a modern, floating pop-up card where Texas agricultural producers can ask questions via text, voice, or field photos at any moment—whether exploring the library on the main page or reading a detailed research study.
- **Target Audience / Persona**: Texas farmers, ranchers, agronomy consultants, and county extension agents who need quick, trusted answers while browsing research or field advisories without having to scroll to the bottom of an article.
- **Key Value**: Immediate, zero-friction access to grounded Texas A&M agricultural insights from anywhere in the application, removing visual clutter from the article reading flow and empowering producers with a site-wide research copilot.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Main Page Exploration**:
   - The user visits the home feed with county weather and articles.
   - A floating launcher button sits in the bottom-right corner with a Texas A&M maroon circle, chat icon, and gentle pulse indicator or pill label (`"Ask AgriLife AI"`).
   - Clicking opens the floating card with a friendly greeting: *"Howdy! Ask me anything about Texas crops, livestock, drought strategies, or research in our library."*
   - Includes 3 quick prompt chips (e.g., *"Best cotton irrigation timing in drought"*, *"Sorghum nitrogen rates"*, *"Upcoming pecan pest alerts"*).
   - Responses cite relevant library publications and link directly to full articles or county extension offices.

2. **Article Deep-Dive Interaction**:
   - When the user clicks an article card, the detail view opens cleanly without the bulky inline chat block interrupting reading flow.
   - The bottom-right floating launcher displays an active indicator badge indicating article context (e.g., *"Ask This Article"*).
   - Opening the chat switches the active context header to the article title, offering article-specific suggested questions, grounded answers with section citations, voice read-aloud, and photo scanning.

3. **Window Management & Responsive Behavior**:
   - Producers can minimize the chat back to the floating icon without losing active conversation state.
   - On mobile devices, the pop-up smoothly slides up from the bottom as a sheet with safe area margins (`max-h-[85vh]`), while maintaining touch-friendly 44px hit targets.

### Visual Identity & Theme

- **Color Palette**:
  - Primary Brand: Texas A&M Aggie Maroon (`#500000`, hover `#680000`)
  - Accent Gold: Subtle warm amber (`#F59E0B` / `#FEF3C7`) for research badges and highlighted citations
  - Neutral Canvas: Crisp white (`#FFFFFF`) card surface, warm stone backgrounds (`#FBF9F5` / `#F5F5F4`), hairline dividers (`#E7E5E4`)
  - High-Contrast Mode Support: Full black/white borders and bold contrast when accessibility mode is enabled
- **Typography & Layout**:
  - Headings: Bold Plus Jakarta Sans with crisp title casing
  - Body & Messages: 14px–15px legible prose with balanced line heights
  - Citations: Clean unboxed metadata with bullet separators (`Article Name · Section 3`) adhering strictly to zero-pill rules

### Interactive Feedback & Motion

- Launcher button: Subtle elevation shadow (`shadow-lg`), smooth hover micro-scale (`scale-105`), and clear open/close state transitions.
- Pop-up card: Mounts with a swift spring fade-in from the bottom-right corner (`transform-origin: bottom right`).
- Live voice transcription indicator with glowing microphone and real-time audio playback stop button.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Root-Level Floating Widget (`GlobalFloatingChatbot.tsx`)**
  - *Chosen Approach*: Mount the floating chatbot component at the top-level `App.tsx` layout rather than inside individual pages.
  - *Why*: Ensures state persistence when users navigate between the feed and article views, prevents redundant unmounting/remounting, and maintains consistent screen position.
  - *Alternatives Considered*: Rendering separate chatbot instances in `App.tsx` and `ArticleDetail.tsx`. Rejected because it would cause jumpy UI transitions and wipe out ongoing user conversations when switching views.

- **Decision 2: Dual Mode Context Architecture (Library Q&A vs. Grounded Article Q&A)**
  - *Chosen Approach*: The chatbot automatically detects whether `selectedArticle` is active. If on an article, it grounds answers specifically in that text; if on the feed, it searches across all loaded articles and county metadata.
  - *Why*: Directly aligns with user requirement while preventing hallucinations by providing the relevant corpus in the prompt context.
  - *Alternatives Considered*: Rigid modal that only allows asking about the whole library or requires manual mode toggling. Rejected to keep the UI clean and effortless.

- **Decision 3: Backend Multi-Article Grounding Support**
  - *Chosen Approach*: Update `/api/gemini/chat` in `server.ts` to accept either a specific `articleText` or an optional `articlesCorpus` containing indexed summaries and findings from the library.
  - *Why*: Preserves the strict anti-hallucination mandate of the application while giving accurate multi-article synthesis when asked from the home page.

---

## 4. Technical Architecture & Data Strategy

### Architecture & Component Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                               App.tsx                                  │
│  State: selectedArticle, activeCounty, farmSettings, language, chatOpen│
├───────────────────────────────────┬────────────────────────────────────┤
│           Main Content            │        Persistent Overlay          │
│  ┌─────────────────────────────┐  │  ┌───────────────────────────────┐ │
│  │ currentView === 'feed'      │  │  │   GlobalFloatingChatbot       │ │
│  │  - WeatherCard              │  │  │   - Floating Launcher Button  │ │
│  │  - Farm Strip               │  │  │   - Pop-up Chat Card          │ │
│  │  - Article Cards Grid       │  │  │     * Context Banner          │ │
│  │                             │  │  │     * Suggested Chips         │ │
│  │ currentView === 'article'   │  │  │     * Message Thread          │ │
│  │  - ArticleDetail (clean     │  │  │     * Photo Attachment Bar    │ │
│  │    editorial reading flow)  │  │  │     * Voice & Text Input Form │ │
│  └─────────────────────────────┘  │  └───────────────────────────────┘ │
└───────────────────────────────────┴────────────────────────────────────┘
                                   │
                                   ▼
             ┌───────────────────────────────────────────┐
             │         Express Backend (server.ts)       │
             │  POST /api/gemini/chat                    │
             │  - Mode A: Single-article grounded Q&A    │
             │  - Mode B: Library-wide grounded Q&A      │
             │  POST /api/gemini/photo-analyze           │
             └───────────────────────────────────────────┘
```

### State Management & Lifecycle

- `isChatOpen`: Boolean controlling pop-up visibility.
- `chatMode`: Automatically computed as `'article'` when `selectedArticle !== null`, or `'library'` when on feed/dashboard.
- `articleMessages` vs `libraryMessages`: Separate or unified message history preserving prior conversations when the user navigates back and forth.
- `activeAudioSpeechId`: Controls active text-to-speech utterance with cancel functionality.

---

## 5. Phased Implementation Roadmap (Pending Approval)

- **Step 1: Backend Enhancement (`server.ts`)**:
  - Enhance `/api/gemini/chat` to handle library-wide queries when no single article is selected, grounding responses in library article abstracts and county crop guides while adhering to strict citation and extension referral rules.
- **Step 2: Component Refactor (`GlobalFloatingChatbot.tsx`)**:
  - Create the floating bottom-right launcher button and expandable modal pop-up card.
  - Support mode switching (Article-specific vs General Library), quick suggested questions, voice speech-to-text, photo scanning, and text-to-speech audio playback.
- **Step 3: App Layout Integration & ArticleDetail Cleanup**:
  - Remove the inline card from `ArticleDetail.tsx` to give users a distraction-free editorial layout.
  - Mount `GlobalFloatingChatbot` in `App.tsx` passing current article, all articles, active county, and farm preferences.
- **Step 4: Quality & Verification**:
  - Verify responsive behavior on both desktop and mobile viewports, high-contrast mode, and run compilation and linting tests.
