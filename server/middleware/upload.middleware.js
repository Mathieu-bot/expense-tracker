import multer, { memoryStorage } from "multer";

// Create multer upload middleware
export const upload = multer({
  storage: memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});
