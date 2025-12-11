
import { useState } from "react";
import api from "../api";

export default function SeasonTotals() {
  const [season, setSeason] = useState("");
  const [data, setData] = useState(null);
  const [status, setStatus] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setData(null);

    const s = season.trim();
    if (!s) {
      setStatus({ type: "error", message: "Enter a season." });
      return;
    }

    try {
      const res = await api.get(`/season-summary/${encodeURIComponent(s)}`);
      const arr = Array.isArray(res.data) ? res.data : [];
      const first = arr[0] || null;
      setData(first);
      if (!first) setStatus({ type: "error", message: "No data found for that season." });
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.error || err.message });
    }
  };

  return (
    <div className="card">
      <h2>Season Totals</h2>
      <form onSubmit={onSubmit}>
        <label>
          Season
          <input value={season} onChange={(e) => setSeason(e.target.value)} required />
        </label>
        <button type="submit">Get Totals</button>
      </form>

      {status && <p className={status.type === "error" ? "error" : "success"}>{status.message}</p>}

      {data && (
        <div className="result">
          <p><strong>Season:</strong> {data._id}</p>
          <p><strong>Total Units Sold:</strong> {data.totalUnitsSold}</p>
          <p><strong>Total Returns:</strong> {data.totalReturns}</p>
          <p><strong>Total Revenue:</strong> {data.totalRevenue}</p>
        </div>
      )}
    </div>
  );
}
