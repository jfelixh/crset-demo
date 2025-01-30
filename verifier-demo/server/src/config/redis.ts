import { Redis, RedisKey, RedisOptions, RedisValue } from "ioredis";
import { config } from "./base";

const { REDIS_PORT, REDIS_HOST } = config;

const redisConfig: RedisOptions = {
  maxRetriesPerRequest: 3,
  showFriendlyErrorStack: true,
};

let redis: Redis;

try {
  redis = new Redis("redis://" + REDIS_HOST + ":" + REDIS_PORT, redisConfig);

  redis.on("connect", () => {
    console.debug("Redis connected");
  });

  redis.on("error", (error) => {
    if ((error as any).code !== "ECONNREFUSED") {
      console.debug(
        { type: (error as any).type, message: error.message },
        "Redis produced an error"
      );
    }
    console.log("Redis error: ", error);
  });
} catch (error) {
  console.error(error, "Critically failed initializing Redis");
}

export const redisGet = async (key: RedisKey): Promise<string | null> => {
  console.debug("redisGet");
  let res = null;
  res = await redis.get(key, (error) => {
    if (error) {
      console.error(
        { type: (error as any).type, message: error.message },
        "Redis GET error"
      );
    }
  });
  return res;
};

export const redisSet = (
  key: RedisKey,
  value: RedisValue,
  seconds: string | number
) => {
  console.debug("redisSet");
  redis.set(key, value, "EX", seconds, (error) => {
    if (error) {
      console.error(
        { type: (error as any).type, message: error.message },
        "Redis SET error"
      );
    }
  });
};

export { redis as redisClient };
