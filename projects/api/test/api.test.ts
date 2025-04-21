const mockAdd = jest.fn();

jest.mock("@src/queue", () => ({
  getUploadQueue: jest.fn(() => ({
    add: mockAdd,
  })),
}));

import path from "path";
import request from "supertest";
import app from "@src/index";
import clearUploadsFolder from "./utils";
import { getUploadQueue } from "@src/queue";

const API_TOKEN = process.env.TEST_API_TOKEN;
if (!API_TOKEN) {
  throw new Error("Environment is missing TEST_API_TOKEN");
}

afterAll(async () => {
  await clearUploadsFolder();
});

describe("Upload API", () => {
  it("should reject file upload without a token", async () => {
    const res = await request(app).post("/upload");

    expect(res.status).toBe(401);
    expect(res.body.errorCode).toBe("NO_BEARER_TOKEN");
  });

  it("should reject file upload with invalid token", async () => {
    const res = await request(app)
      .post("/upload")
      .set("Authorization", "Bearer invalidtoken");

    expect(res.status).toBe(401);
    expect(res.body.errorCode).toBe("INVALID_TOKEN");
  });

  it("should return 400 if no file is attached", async () => {
    const res = await request(app)
      .post("/upload")
      .set("Authorization", `Bearer ${API_TOKEN}`);

    expect(res.status).toBe(400);
    expect(res.body.errorCode).toBe("FILE_NOT_UPLOADED");
    expect(mockAdd).not.toHaveBeenCalled();
  });

  it("should upload a file successfully with valid token", async () => {
    const res = await request(app)
      .post("/upload")
      .set("Authorization", `Bearer ${API_TOKEN}`)
      .attach("file", path.resolve(__dirname, "test.mp4"));

    expect(res.status).toBe(200);
    expect(res.body.message).toBe("File uploaded successfully");
  });

  it("should reject file upload with invalid file type", async () => {
    const res = await request(app)
      .post("/upload")
      .set("Authorization", `Bearer ${API_TOKEN}`)
      .attach("file", path.resolve(__dirname, "test-invalid.txt"));

    expect(res.status).toBe(400);
    expect(res.body.errorCode).toBe("INVALID_FILE_TYPE");
  });

  it("should add a job to the upload queue", async () => {
    const res = await request(app)
      .post("/upload")
      .set("Authorization", `Bearer ${API_TOKEN}`)
      .attach("file", path.resolve(__dirname, "test.mp4"));

    expect(res.status).toBe(200);

    const uploadQueue = getUploadQueue();
    expect(uploadQueue.add).toHaveBeenCalledWith(
      "process-file",
      expect.objectContaining({ originalname: "test.mp4" }),
    );
  });
});
