import path from "path";

process.env.TEST_API_TOKEN = "test-api-token";
process.env.FILE_MAX_SIZE = "104857600"; // 100MB
process.env.UPLOADS_DIR = path.resolve(__dirname, "../uploads");
