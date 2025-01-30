import { Redis, RedisKey, RedisOptions, RedisValue } from "ioredis";

const redisConfig: RedisOptions = {
  port: parseInt("6379", 10),
  host: "issuer-redis", // switch to "localhost" if running locally
  maxRetriesPerRequest: 3,
  showFriendlyErrorStack: true,
};

let redis: Redis;

try {
  redis = new Redis(redisConfig);

  redis.on("error", (error) => {
    if ((error as any).code !== "ECONNREFUSED") {
      console.debug(
        { type: (error as any).type, message: error.message },
        "Redis produced an error"
      );
    }
  });
} catch (error) {
  console.error(error, "Critically failed initializing Redis");
}

export const redisGet = async (key: RedisKey): Promise<string | null> => {
  // console.debug("redisGet");
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
  // console.debug("redisSet");
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
