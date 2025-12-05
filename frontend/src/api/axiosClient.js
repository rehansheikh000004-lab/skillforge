import axios from "axios";

const base = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const client = axios.create({
  baseURL: base,
  withCredentials: false
});

export default client;
