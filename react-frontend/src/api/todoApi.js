import axios from './axiosInstance';

export const getTodos = async (params) => {
  const response = await axios.get('/api/todos', { params });
  return response.data;
};

export const getTodoById = (id) => axios.get(`/api/todos/${id}`);

export const createTodo = async (todoData) => {
  const response = await axios.post('/api/todos', todoData);
  return response.data;
};

export const updateTodo = async (id, todoData) => {
  const response = await axios.put(`/api/todos/${id}`, todoData);
  return response.data;
};

export const deleteTodo = async (id) => {
  const response = await axios.delete(`/api/todos/${id}`);
  return response.data;
};

export const updateTodoStatus = (id, status) => axios.patch(`/api/todos/${id}/status`, { status });

export const searchTodos = (q) => axios.get('/api/todos/search', { params: { q } });

export const getTodoStats = async () => {
  try {
    const response = await axios.get('/api/todos/stats');
    console.log('Stats API Response:', response);
    
    // Veri yapısını kontrol et
    if (response?.data?.status === 'success' && response.data.data) {
      return {
        status: 'success',
        data: {
          statusCounts: response.data.data.statusCounts || {
            pending: 0,
            in_progress: 0,
            completed: 0
          },
          priorityCounts: response.data.data.priorityCounts || {
            high: 0,
            medium: 0,
            low: 0
          }
        }
      };
    }
    
    throw new Error('Invalid response format from stats API');
  } catch (error) {
    console.error('Stats API Error:', error);
    throw error;
  }
};
