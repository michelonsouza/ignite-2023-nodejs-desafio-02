type BooleanType = 'true' | 'false';
type NodeEnv = 'development' | 'test' | 'production';

export declare global {
  namespace NodeJS {
    interface ProcessEnv {
      PORT: string;
      NODE_ENV: NodeEnv;
      LOGGER?: BooleanType;
      DATABASE_URL: string;
      DATABASE_CLIENT?: 'sqlite' | 'pg';
    }
  }
}
