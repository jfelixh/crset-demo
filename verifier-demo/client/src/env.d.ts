/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly EXTERNAL_URL: string;
  // TODO: Add more environment variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
