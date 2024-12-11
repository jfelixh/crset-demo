import {RedisStore} from "connect-redis";
import {redisClient} from "@/app/config/redis";


export const sessionOptions = {
    store: new RedisStore({ client: redisClient, prefix: "login_id:" }),
    secret: process.env.SESSION_SECRET || "Fear is the mind-killer.", // Secure this in production!
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24, // 1 day
        sameSite: "strict",
    },
};

