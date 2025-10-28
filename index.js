import fs from "fs";
import path from "path";
import sharp from "sharp";

export const config = {
  api: {
    bodyParser: false, // supaya bisa terima file binary
  },
};

export default async function handler(req, res) {
  const { method, url } = req;

  // ====== Root - simple HTML ======
  if (method === "GET" && url === "/") {
    res.setHeader("Content-Type", "text/html");
    return res.end(`
      <h1>🚀 Simple Upload API</h1>
      <p>POST ke <code>/api/upload</code> dengan file image</p>
      <form method="POST" action="/api/upload" enctype="multipart/form-data">
        <input type="file" name="image" accept="image/*"/>
        <button type="submit">Upload</button>
      </form>
    `);
  }

  // ====== Upload endpoint ======
  if (method === "POST" && url === "/api/upload") {
    try {
      const chunks = [];
      for await (const chunk of req) chunks.push(chunk);
      const buffer = Buffer.concat(chunks);

      // Proses gambar dengan sharp
      const output = await sharp(buffer)
        .jpeg({ quality: 85 })
        .resize(1600, 1600, { fit: "inside", withoutEnlargement: true })
        .toBuffer();

      const filename = `img_${Date.now()}.jpg`;
      const filePath = path.join("/tmp", filename);
      fs.writeFileSync(filePath, output);

      res.setHeader("Content-Type", "application/json");
      res.end(
        JSON.stringify({
          success: true,
          filename,
          size: (output.length / 1024).toFixed(2) + " KB",
          message: "✅ Image uploaded & processed!",
        })
      );
    } catch (err) {
      res.statusCode = 500;
      res.end(JSON.stringify({ success: false, error: err.message }));
    }
    return;
  }

  // ====== Get image from /tmp ======
  if (method === "GET" && url.startsWith("/api/tmp/")) {
    const filename = url.split("/api/tmp/")[1];
    const filePath = path.join("/tmp", filename);

    if (!fs.existsSync(filePath)) {
      res.statusCode = 404;
      return res.end("File not found");
    }

    res.setHeader("Content-Type", "image/jpeg");
    fs.createReadStream(filePath).pipe(res);
    return;
  }

  // ====== Not found ======
  res.statusCode = 404;
  res.end("Not found");
}
