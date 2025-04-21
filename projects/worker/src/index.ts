import { Worker, Job } from "bullmq";
import Redis from "ioredis";

interface FileUploadJobData {
  filename: string;
  filepath: string;
  originalname: string;
}

// Create Redis connection for both Pub/Sub and Worker connection
const redis = new Redis({
  host: "redis",
  port: 6379,
  maxRetriesPerRequest: null,
});

// Initialize Redis Publisher for Pub/Sub
const redisPublisher = new Redis({
  host: "redis",
  port: 6379,
  maxRetriesPerRequest: null,
});

const worker = new Worker<FileUploadJobData>(
  "file-upload-queue",
  async (job: Job<FileUploadJobData>) => {
    console.log(`Processing job ${job.id}: ${job.name}`);

    try {
      // Publish status update to indicate processing has started
      await redisPublisher.publish(
        "status-updates",
        JSON.stringify({
          status: "processing",
          fileId: job.id,
          message: `Processing file: ${job.data.filename}`,
        }),
      );

      // Simulating AI processing (e.g., a transcription or file processing task)
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate processing delay

      // Once processing is done, return the result
      const result = `Processed file: ${job.data.filename}`;
      console.log(result);

      // Publish result after processing is done
      await redisPublisher.publish(
        "status-updates",
        JSON.stringify({
          status: "completed",
          fileId: job.id,
          message: result,
        }),
      );

      // Here we could also process the file with Whisper/OpenAI or another service
      // Example: const result = await processFileWithWhisper(job.data.filepath);

      return result;
    } catch (error) {
      // Error handling and publishing failure status
      if (error instanceof Error) {
        console.error(`Job ${job.id} failed with error: ${error.message}`);
        await redisPublisher.publish(
          "status-updates",
          JSON.stringify({
            status: "failed",
            fileId: job.id,
            message: `Failed to process file: ${job.data.filename}. Error: ${error.message}`,
          }),
        );
        throw error;
      } else {
        console.error(`Job ${job.id} failed with an unknown error`);
        await redisPublisher.publish(
          "status-updates",
          JSON.stringify({
            status: "failed",
            fileId: job.id,
            message: `Failed to process file: ${job.data.filename}. Unknown error occurred.`,
          }),
        );
        throw new Error("Unknown error occurred");
      }
    }
  },
  {
    connection: redis,
  },
);

// Handle job completion
worker.on("completed", (job: Job<FileUploadJobData>, result: string) => {
  console.log(`Job ${job.id} completed with result: ${result}`);

  // Publish completion status to Redis Pub/Sub
  redisPublisher.publish(
    "status-updates",
    JSON.stringify({
      status: "completed",
      fileId: job.id,
      message: `File ${job.data.filename} processed successfully.`,
    }),
  );
});

// Handle job failure
worker.on("failed", (job: Job<FileUploadJobData> | undefined, err: Error) => {
  if (job) {
    console.error(`Job ${job.id} failed with error: ${err.message}`);
    redisPublisher.publish(
      "status-updates",
      JSON.stringify({
        status: "failed",
        fileId: job.id,
        message: `File ${job.data.filename} failed. Error: ${err.message}`,
      }),
    );
  } else {
    console.error(`Job failed with error: ${err.message}`);
    redisPublisher.publish(
      "status-updates",
      JSON.stringify({
        status: "failed",
        message: `File processing failed with error: ${err.message}`,
      }),
    );
  }
});

// Graceful shutdown (in case of SIGINT or SIGTERM)
process.on("SIGINT", () => {
  console.log("Shutting down worker...");
  worker.close().then(() => {
    redis.disconnect();
    redisPublisher.disconnect();
    process.exit(0);
  });
});
