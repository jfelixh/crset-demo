declare module 'connect-redis' {
    import { Store, SessionData } from 'express-session';
    
    interface RedisStoreOptions {
        client: any;
        prefix?: string;
        [key: string]: any;
    }

    export class RedisStore extends Store {
        constructor(options: RedisStoreOptions);
        get(sid: string, callback: (err: any, session?: SessionData | null) => void): void;
        set(sid: string, session: SessionData, callback?: (err?: any) => void): void;
        destroy(sid: string, callback?: (err?: any) => void): void;
    }
} 