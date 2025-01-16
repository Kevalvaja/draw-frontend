import axios from "axios";

export const API_URL = "http://localhost:2000"

const api = axios.create({
    baseURL: API_URL,
    timeout: 20000
})

export default api