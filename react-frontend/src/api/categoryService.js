import axios from './axiosInstance';

const categoryService = {
    // Tüm kategorileri getir
    getAllCategories: async () => {
        const response = await axios.get('/api/categories');
        return response.data;
    },

    // Belirli bir kategoriyi getir
    getCategory: async (id) => {
        const response = await axios.get(`/api/categories/${id}`);
        return response.data;
    },

    // Yeni kategori oluştur
    createCategory: async (categoryData) => {
        const response = await axios.post('/api/categories', categoryData);
        return response.data;
    },

    // Kategori güncelle
    updateCategory: async (id, categoryData) => {
        const response = await axios.put(`/api/categories/${id}`, categoryData);
        return response.data;
    },

    // Kategori sil
    deleteCategory: async (id) => {
        const response = await axios.delete(`/api/categories/${id}`);
        return response.data;
    },

    // Kategoriye ait todo'ları getir
    getCategoryTodos: async (id) => {
        const response = await axios.get(`/api/categories/${id}/todos`);
        return response.data;
    },

    // Todo'nun kategorilerini güncelle
    updateTodoCategories: async (todoId, categoryIds) => {
        const response = await axios.post(`/api/todos/${todoId}/categories`, {
            categories: categoryIds
        });
        return response.data;
    }
};

export default categoryService; 