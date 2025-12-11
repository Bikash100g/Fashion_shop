
import { useState } from "react";
import api from "../api";

export default function DeleteProduct() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    const n = name.trim();
    if (!n) {
      setStatus({ type: "error", message: "Enter Product Name to delete." });
      return;
    }

    try {
      const res = await api.post(`/delete-product/${encodeURIComponent(n)}`);
      setStatus({ type: "success", message: res.data?.message || "Deleted." });
      setName("");
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.error || err.message });
    }
  };

  return (
    <div className="card">
      <h2>Delete Product by Name</h2>
      <form onSubmit={onSubmit}>
        <label>
          Product Name
          <input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <button type="submit" className="danger">Delete</button>
      </form>
      {status && <p className={status.type === "error" ? "error" : "success"}>{status.message}</p>}
    </div>
  );
}
