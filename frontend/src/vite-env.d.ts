/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Backend API origin, no trailing slash (e.g. https://localhost:5000 or your Azure URL). */
  readonly VITE_API_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
