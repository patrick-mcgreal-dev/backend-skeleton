import fs from "fs";
import path from "path";

const clearUploadsFolder = async () => {
  const uploadsDir = process.env.UPLOADS_DIR || "./app/uploads";

  try {
    const files = await fs.promises.readdir(uploadsDir);
    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      await fs.promises.unlink(filePath);
    }
    console.log("Uploads folder cleared");
  } catch (err) {
    console.error("Error clearing uploads folder", err);
  }
};

export default clearUploadsFolder;
