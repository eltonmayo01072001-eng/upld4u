import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const file = req.body.file; 

    
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const randomNum = Math.floor(Math.random() * 100000);
    const extension = req.body.filename?.split(".").pop() || "jpg";
    const filename = `${timestamp}_${randomNum}.${extension}`;

    
    const owner = "eltonmayo01072001-eng";
    const repo = "storage";
    const branch = "main";
    const path = `uploads/${filename}`;

   
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Upload ${filename}`,
          content: file,
          branch,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    const fileUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}`;
    res.status(200).json({ url: fileUrl });

  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ message: "Internal server error" });
  }
}
