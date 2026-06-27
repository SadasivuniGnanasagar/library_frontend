import axios from "axios";

const api = axios.create({
  baseURL: "https://library-backend-wx6z.onrender.com/api",
});

export default api;