import axios from "axios";

const api = axios.create({
  baseURL: "https://crispy-train-5g464g6544qqh7w5j-5000.app.github.dev",           // matches your backend
  headers: { "Content-Type": "application/json" },
});

export default api;
