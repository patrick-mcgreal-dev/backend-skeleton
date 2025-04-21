import { Queue } from "bullmq";
import { RedisOptions } from "ioredis";

const redisConfig: RedisOptions = {
  host: "redis",
  port: 6379,
};

let uploadQueue: Queue;

export const getUploadQueue = (): Queue => {
  if (!uploadQueue) {
    uploadQueue = new Queue("file-upload-queue", {
      connection: redisConfig,
    });
  }
  return uploadQueue;
};
