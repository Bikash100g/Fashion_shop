import axios from "axios";

const api = axios.create({
  baseURL: "https://obscure-lamp-x596956x9rg5f9xvx-5000.app.github.dev/",           // matches your backend
  headers: { "Content-Type": "application/json" },
});

export default api;
