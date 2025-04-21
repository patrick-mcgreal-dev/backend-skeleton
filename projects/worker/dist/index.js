"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bullmq_1 = require("bullmq");
const ioredis_1 = __importDefault(require("ioredis"));
const redis = new ioredis_1.default({
  host: "redis",
  port: 6379,
  maxRetriesPerRequest: null,
});
const worker = new bullmq_1.Worker("file-upload-queue", async (job) => {
  console.log(`Processing job ${job.id}: ${job.name}`);
  try {
    // Simulating AI processing (e.g., a transcription or file processing task)
    await new Promise((resolve) => setTimeout(resolve, 2000));
    // Once processing is done, return the result
    const result = `Processed file: ${job.data.filename}`;
    console.log(result);
    // Here we could also process the file with Whisper/OpenAI or another service
    // Example: const result = await processFileWithWhisper(job.data.filepath);
    return result;
  }
  catch (error) {
    if (error instanceof Error) {
      console.error(`Job ${job.id} failed with error: ${error.message}`);
      throw error;
    }
    else {
      console.error(`Job ${job.id} failed with an unknown error`);
      throw new Error("Unknown error occurred");
    }
  }
}, {
  connection: redis,
});
// Handle job completion
worker.on("completed", (job, result) => {
  console.log(`Job ${job.id} completed with result: ${result}`);
});
// Handle job failure
worker.on("failed", (job, err) => {
  if (job) {
    console.error(`Job ${job.id} failed with error: ${err.message}`);
  }
  else {
    console.error(`Job failed with error: ${err.message}`);
  }
});
// Graceful shutdown (in case of SIGINT or SIGTERM)
process.on("SIGINT", () => {
  console.log("Shutting down worker...");
  worker.close().then(() => {
    redis.disconnect();
    process.exit(0);
  });
});
