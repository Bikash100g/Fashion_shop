
import { useState } from "react";
import api from "../api";

export default function AddProduct() {
  const [form, setForm] = useState({
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

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    // Convert numeric fields
    const payload = {
      ...form,
      unitsSold: Number(form.unitsSold),
      returns: Number(form.returns),
      revenue: Number(form.revenue),
      customerRating: Number(form.customerRating),
      stockLevel: Number(form.stockLevel),
      trendScore: Number(form.trendScore),
    };

    try {
      const res = await api.post("/add-product", payload);
      setStatus({ type: "success", message: res.data?.message || "Product added." });
      // reset form
      setForm({
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
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.error || err.message });
    }
  };

  const fields = [
    { label: "Product Category", name: "productCategory" },
    { label: "Product Name", name: "productName" },
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
      <h2>Add Product</h2>
      <form onSubmit={onSubmit} className="form-grid">
        {fields.map((f) => (
          <label key={f.name}>
            {f.label}
            <input
              type={f.type || "text"}
              name={f.name}
              value={form[f.name]}
              onChange={onChange}
              step={f.step || "any"}
              required={["productCategory", "productName", "season"].includes(f.name)}
            />
          </label>
        ))}
        <button type="submit">Add</button>
      </form>
      {status && <p className={status.type === "error" ? "error" : "success"}>{status.message}</p>}
    </div>
  );
}
