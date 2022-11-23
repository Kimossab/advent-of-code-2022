export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SESSION_ID: string;
      YEAR: number;
    }
  }
}
