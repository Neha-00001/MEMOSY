import axios from "axios";

// The backend runs on port 5001 (see server/server.js).
// In production you'd swap this for an environment variable.
const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

export default api;
