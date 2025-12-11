
import { useState } from "react";
import api from "../api";

export default function UnitsSoldThreshold() {
  const [season, setSeason] = useState("");
  const [minUnitsSold, setMinUnitsSold] = useState("");
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setRecords([]);

    const s = season.trim();
    const min = Number(minUnitsSold);

    if (!s || Number.isNaN(min)) {
      setStatus({ type: "error", message: "Enter Season and a numeric minimum Units Sold." });
      return;
    }

    try {
      const res = await api.get("/top-products", { params: { season: s, minUnitsSold: min } });
      setRecords(Array.isArray(res.data) ? res.data : []);
      if ((res.data || []).length === 0) setStatus({ type: "error", message: "No products found." });
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.error || err.message });
    }
  };

  return (
    <div className="card">
      <h2>First 10 Products where Units Sold &gt; threshold</h2>
      <form onSubmit={onSubmit} className="form-row">
        <label>
          Season
          <input value={season} onChange={(e) => setSeason(e.target.value)} required />
        </label>
        <label>
          Min Units Sold
          <input type="number" value={minUnitsSold} onChange={(e) => setMinUnitsSold(e.target.value)} required />
        </label>
        <button type="submit">Fetch</button>
      </form>

      {status && <p className={status.type === "error" ? "error" : "success"}>{status.message}</p>}

      {records.length > 0 && (
        <table className="table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Category</th>
              <th>Season</th>
              <th>Units Sold</th>
              <th>Revenue</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {records.map((p, idx) => (
              <tr key={idx}>
                <td>{p.productName}</td>
                <td>{p.productCategory}</td>
                <td>{p.season}</td>
                <td>{p.unitsSold}</td>
                <td>{p.revenue}</td>
                <td>{p.customerRating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
