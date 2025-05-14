import axios from "axios";

const api = axios.create({
    baseURL:"http://localhost:8000/api/todos",
});

export const getTodos = (params = {}) => api.get("/", { params });
export const getTodo = (id) => api.get(`/${id}`);
export const addTodo = (data) => api.post("/", data);
export const updateTodo = (id, data) => api.put(`/${id}`, data);
export const deleteTodo = (id) => api.delete(`/${id}`);
export const updateStatus = (id, status) => api.patch(`/${id}/status`, { status });