export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { num1, num2 } = req.body;
    if (typeof num1 !== "number" || typeof num2 !== "number") {
      return res.status(400).json({ error: "Invalid numbers" });
    }
    const result = num1 + num2;
    return res.status(200).json({ result });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}
