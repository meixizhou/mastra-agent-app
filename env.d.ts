///<reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_OTHER_KEY?: string
  // 👆 add all your custom env variables here (must start with VITE_)
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
