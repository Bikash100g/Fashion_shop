
import { useState } from "react";
import api from "../api";

export default function AvgRatingSeason() {
  const [season, setSeason] = useState("");
  const [minRating, setMinRating] = useState("4");
  const [group, setGroup] = useState(null);
  const [status, setStatus] = useState(null);

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    setGroup(null);

    const s = season.trim();
    const r = Number(minRating);

    if (!s || Number.isNaN(r)) {
      setStatus({ type: "error", message: "Provide Season and numeric minRating." });
      return;
    }

    try {
      const res = await api.get("/products-by-rating", { params: { season: s, minRating: r } });
      const arr = Array.isArray(res.data) ? res.data : [];
      const first = arr[0] || null;

      if (!first) {
        setStatus({ type: "error", message: "Season average is below threshold or no data." });
        return;
      }
      setGroup(first);
    } catch (err) {
      setStatus({ type: "error", message: err.response?.data?.error || err.message });
    }
  };

  return (
    <div className="card">
      <h2>Products by Average Customer Rating (Season)</h2>
      <form onSubmit={onSubmit} className="form-row">
        <label>
          Season
          <input value={season} onChange={(e) => setSeason(e.target.value)} required />
        </label>
        <label>
          Minimum Average Rating
          <input type="number" step="0.1" min="0" max="5" value={minRating} onChange={(e) => setMinRating(e.target.value)} required />
        </label>
        <button type="submit">Check</button>
      </form>

      {status && <p className={status.type === "error" ? "error" : "success"}>{status.message}</p>}

      {group && (
        <>
          <p><strong>Season:</strong> {group._id}</p>
          <p><strong>Average Rating:</strong> {group.avgRating?.toFixed(2)}</p>

          <h3>Products in {group._id}</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Category</th>
                <th>Units Sold</th>
                <th>Returns</th>
                <th>Revenue</th>
                <th>Rating</th>
                <th>Stock</th>
                <th>Trend Score</th>
              </tr>
            </thead>
            <tbody>
              {group.products?.map((p, idx) => (
                <tr key={idx}>
                  <td>{p.productName}</td>
                  <td>{p.productCategory}</td>
                  <td>{p.unitsSold}</td>
                  <td>{p.returns}</td>
                  <td>{p.revenue}</td>
                  <td>{p.customerRating}</td>
                  <td>{p.stockLevel}</td>
                  <td>{p.trendScore}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}
