import axios from './axiosInstance';

const todoService = {
    // Tüm todo'ları getir
    getAllTodos: async (params = {}) => {
        try {
            // Varsayılan değerleri ayarla
            const defaultParams = {
                page: 1,
                limit: 12,
                sort: 'created_at',
                order: 'desc'
            };

            // Parametreleri birleştir
            const finalParams = { ...defaultParams, ...params };
            
            // Convert params to query string
            const queryParams = new URLSearchParams();
            
            // Add all params to query string
            Object.entries(finalParams).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    queryParams.append(key, value);
                }
            });
            
            const queryString = queryParams.toString();
            const url = `/api/todos${queryString ? `?${queryString}` : ''}`;
            
            console.log('Making API request to:', url);
            const response = await axios.get(url);
            
            // Response yapısını detaylı logla
            const responseData = response.data;
            console.log('API Response:', {
                status: responseData.status,
                dataLength: Array.isArray(responseData.data) ? responseData.data.length : 'not array',
                pagination: responseData.meta?.pagination,
                firstItem: Array.isArray(responseData.data) ? responseData.data[0] : null
            });
            
            return responseData;
        } catch (error) {
            console.error('API Error:', error.response || error);
            throw error;
        }
    },

    // Belirli bir todo'yu getir
    getTodo: async (id) => {
        try {
            const response = await axios.get(`/api/todos/${id}`);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Yeni todo oluştur
    createTodo: async (todoData) => {
        try {
            const response = await axios.post('/api/todos', todoData);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Todo güncelle
    updateTodo: async (id, todoData) => {
        try {
            const response = await axios.put(`/api/todos/${id}`, todoData);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Todo sil
    deleteTodo: async (id) => {
        try {
            const response = await axios.delete(`/api/todos/${id}`);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Todo durumunu güncelle
    updateTodoStatus: async (id, statusData) => {
        try {
            const response = await axios.patch(`/api/todos/${id}/status`, statusData);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Todo'ları ara
    searchTodos: async (query) => {
        try {
            const response = await axios.get(`/api/todos/search?q=${query}`);
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    // Todo istatistiklerini getir
    getTodoStats: async () => {
        try {
            const response = await axios.get('/api/todos/stats');
            return response.data;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
};

export default todoService; 