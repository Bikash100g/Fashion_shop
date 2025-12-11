
import { useState } from "react";
import api from "../api";

export default function UpdateProduct() {
  const [name, setName] = useState("");
  const [updates, setUpdates] = useState({
    productCategory: "",
    productName: "",
    unitsSold: "",
    returns: "",
    revenue: "",
    customerRating: "",
    stockLevel: "",
    season: "",
    trendScore: "",
  });
  const [status, setStatus] = useState(null);

  const onChange = (e) => setUpdates((u) => ({ ...u, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    if (!name.trim()) {
      setStatus({ type: "error", message: "Enter Product Name to update." });
      return;
    }

    // build body with only provided fields, converting numbers
    const body = {};
    for (const [k, v] of Object.entries(updates)) {
      if (v !== "") {
        body[k] = ["unitsSold", "returns", "revenue", "customerRating", "stockLevel", "trendScore"].includes(k)
          ? Number(v)
          : v.trim();
      }
    }
    if (Object.keys(body).length === 0) {
      setStatus({ type: "error", message: "Provide at least one field to update." });
      return;
    }

    try {
      const res = await api.post(`/update-product/${encodeURIComponent(name.trim())}`, body);
      setStatus({ type: "success", message: res.data?.message || "Updated successfully." });
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.error || err.message });
    }
  };

  const fields = [
    { label: "Product Category", name: "productCategory" },
    { label: "New Product Name", name: "productName" },
    { label: "Units Sold", name: "unitsSold", type: "number" },
    { label: "Returns", name: "returns", type: "number" },
    { label: "Revenue", name: "revenue", type: "number", step: "0.01" },
    { label: "Customer Rating", name: "customerRating", type: "number", step: "0.1" },
    { label: "Stock Level", name: "stockLevel", type: "number" },
    { label: "Season", name: "season" },
    { label: "Trend Score", name: "trendScore", type: "number" },
  ];

  return (
    <div className="card">
      <h2>Update Product by Name</h2>
      <form onSubmit={onSubmit} className="form-grid">
        <label style={{ gridColumn: "1 / -1" }}>
          Current Product Name
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>

        {fields.map((f) => (
          <label key={f.name}>
            {f.label}
            <input
              type={f.type || "text"}
              name={f.name}
              value={updates[f.name]}
              onChange={onChange}
              step={f.step || "any"}
              placeholder="(leave blank to skip)"
            />
          </label>
        ))}
        <button type="submit">Update</button>
      </form>
      {status && <p className={status.type === "error" ? "error" : "success"}>{status.message}</p>}
    </div>
  );
}
