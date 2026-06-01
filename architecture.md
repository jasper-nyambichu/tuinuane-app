# Project Architecture (Mermaid)

```mermaid
flowchart TD
  Root[tuinuane-app]
  Root --> AG[AGENTS.md]
  Root --> CLAUDE[CLAUDE.md]
  Root --> PKG[package.json]
  Root --> SRC[src]
  SRC --> APP[app]
  SRC --> COMPONENTS[components]
  SRC --> LIB[lib]
  SRC --> HOOKS[hooks]
  SRC --> CONST[constants]
  SRC --> ASSETS[assets]
  SRC --> PAGES[pages]

  subgraph APP_SUB[app]
    APP --> Globals[globals.css]
    APP --> Layout[layout.tsx]
    APP --> Page[page.tsx]
    APP --> NotFound[not-found.tsx]
    APP --> Admin[admin]
    APP --> API[api]
    Admin --> Auth[(auth)]
    Auth --> AuthLayout[layout.tsx]
    Auth --> Login[login/page.tsx]
    Admin --> Protected[(protected)]
    Protected --> PLayout[layout.tsx]
    Protected --> Dashboard[dashboard/page.tsx]
    Protected --> Chats[chats/page.tsx]
    Protected --> Leads[leads/page.tsx]
    Protected --> Proposals[proposals/page.tsx]
    Protected --> Settings[settings/page.tsx]
    API --> Chat[chat/route.ts]
    API --> Leads[leads/route.ts]
    API --> Quotes[quotes/route.ts]
  end

  subgraph COMPONENTS_SUB[components]
    COMPONENTS --> LayoutComp[layout/*]
    COMPONENTS --> Sections[sections/*]
    COMPONENTS --> Common[common/*]
    COMPONENTS --> AdminComp[admin/*]
    COMPONENTS --> UI[ui/*]
  end

  LIB --> AuthLib[auth.ts]
  LIB --> Gemini[gemini.ts]
  LIB --> Supabase[supabase(.ts| -server.ts)]
  HOOKS --> UseMobile[use-mobile.tsx]
  HOOKS --> UseToast[use-toast.ts]
  CONST --> ChatKnowledge[chatKnowledge.ts]
  PAGES --> Public[public/*]

  style Root fill:#f9f,stroke:#333,stroke-width:1px
