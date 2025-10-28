import express from "express";
import multer from "multer";
import sharp from "sharp";
import path from "path";
import fs from "fs";

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.get("/", (req, res) => {
  res.send(`
    <h1>🚀 Express Upload API (Vercel)</h1>
    <form method="POST" action="/upload" enctype="multipart/form-data">
      <input type="file" name="image" accept="image/*" required />
      <button type="submit">Upload</button>
    </form>
  `);
});

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const processed = await sharp(file.buffer)
      .jpeg({ quality: 85 })
      .resize(1600, 1600, { fit: "inside" })
      .toBuffer();

    const filename = `img_${Date.now()}.jpg`;
    const filePath = path.join("/tmp", filename);
    fs.writeFileSync(filePath, processed);

    res.json({
      success: true,
      message: "✅ Image uploaded & processed!",
      filename,
      size: (processed.length / 1024).toFixed(1) + " KB",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ✅ Vercel serverless adapter
export default app;
