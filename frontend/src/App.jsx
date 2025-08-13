import { useState } from "react";

export default function App() {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleAdd = async () => {
    setError("");
    setResult(null);

    const n1 = parseFloat(num1);
    const n2 = parseFloat(num2);
    if (isNaN(n1) || isNaN(n2)) {
      setError("Please enter valid numbers");
      return;
    }

    try {
      const res = await fetch("/api/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ num1: n1, num2: n2 }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Error");
      } else {
        setResult(data.result);
      }
    } catch {
      setError("Network error");
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "50px auto", textAlign: "center" }}>
      <h1>Add Two Numbers</h1>
      <input
        type="number"
        placeholder="Number 1"
        value={num1}
        onChange={(e) => setNum1(e.target.value)}
        style={{ width: "100%", padding: 8, margin: 5 }}
      />
      <input
        type="number"
        placeholder="Number 2"
        value={num2}
        onChange={(e) => setNum2(e.target.value)}
        style={{ width: "100%", padding: 8, margin: 5 }}
      />
      <button onClick={handleAdd} style={{ padding: 10, marginTop: 10 }}>
        Add
      </button>
      {result !== null && <h2>Result: {result}</h2>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
