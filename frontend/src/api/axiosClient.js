import axios from "axios";

const base = import.meta.env.VITE_BACKEND_URL || "http://https://skillforge-hc0a.onrender.com";

const client = axios.create({
  baseURL: base,
  withCredentials: false
});

export default client;
