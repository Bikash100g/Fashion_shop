
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import AddProduct from "./Components/AddProduct";
import UpdateProduct from "./Components/UpdateProduct";
import DeleteProduct from "./Components/DeleteProduct";
import SeasonTotals from "./Components/SeasonTotals";
import UnitsSoldThreshold from "./Components/UnitsSoldThreshold";
import AvgRatingSeason from "./Components/AvgRatingSeason";

function App() {
  return (
    <>
      <Navbar />
      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddProduct />} />
          <Route path="/update" element={<UpdateProduct />} />
          <Route path="/delete" element={<DeleteProduct />} />
          <Route path="/season-totals" element={<SeasonTotals />} />
          <Route path="/units-sold" element={<UnitsSoldThreshold />} />
          <Route path="/avg-rating" element={<AvgRatingSeason />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </>
  );
}
export default App;

function Home() {
  return (
    <div className="card">
      <h2>Fashion Shop Dashboard</h2>
      <p>Use the navbar to navigate to each task (Add, Update, Totals, Delete, etc.).</p>
    </div>
  );
}
function NotFound() {
  return (
    <div className="card">
      <h2>404</h2>
      <p>Page not found.</p>
    </div>
  );
}

