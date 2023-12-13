declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      MONGODB_URI: string;
      SECRET: string;
      PORT: number;
    }
  }
}

declare module "express" {
  interface Request {
    cookies: Object & {
      userId: string;
    };
  }
}

declare module "express-session" {
  interface SessionData {
    userId: string;
  }
}

export {};
