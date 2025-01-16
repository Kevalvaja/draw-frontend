import axios from "axios";

export const API_URL = "https://draw-backend.vercel.app"
const api = axios.create({
    baseURL: API_URL,
    timeout: 20000
})

export default api