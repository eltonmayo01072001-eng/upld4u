import { useState } from "react";
import axios from "axios";
import bgImage from "./assets/1.jpg";

export default function App() {
  const [fileUrl, setFileUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setCopied(false);
    setFileUrl("");
    setLoading(true);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = String(reader.result).split(",")[1];
      try {
        const res = await axios.post("/api/upload", {
          file: base64,
          filename: file.name,
        });
        setFileUrl(res.data.url || "");
      } catch {
        setError("Upload failed. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const copyLink = async () => {
    if (!fileUrl) return;
    try {
      await navigator.clipboard.writeText(fileUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {}
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4 bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="w-full max-w-lg">
        <div className="bg-white/90 backdrop-blur-sm shadow-xl rounded-2xl p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center">
            Upload Image to Internet
          </h1>
          <p className="text-slate-500 text-center mt-2">
            Select a file and we’ll give you the link to it
          </p>

          <div className="mt-6">
            <label className="block">
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="block w-full text-sm text-slate-600
                  file:mr-4 file:py-2.5 file:px-4
                  file:rounded-lg file:border-0
                  file:font-semibold
                  file:bg-blue-600 file:text-white
                  hover:file:bg-blue-700
                  cursor-pointer"
              />
            </label>
          </div>

          {loading && (
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700">
              Uploading… please wait.
            </div>
          )}

          {error && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
              {error}
            </div>
          )}

          {fileUrl && (
            <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4">
              <p className="text-emerald-800 font-medium">Uploaded successfully!</p>
              <a
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 block break-all text-blue-700 underline"
              >
                {fileUrl}
              </a>
              <div className="mt-3 flex gap-2">
                <button
                  onClick={copyLink}
                  className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 transition"
                >
                  {copied ? "Copied!" : "Copy Link"}
                </button>
                <a
                  href={fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 transition"
                >
                  Open
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
