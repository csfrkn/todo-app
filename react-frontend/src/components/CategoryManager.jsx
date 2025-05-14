import React, { useState, useEffect } from 'react';
import categoryService from '../api/categoryService';
import { useTheme } from '../contexts/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { commonStyles, colorPalettes } from '../theme/styles';

const CategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState({
        name: '',
        color: '#3B82F6',
        description: ''
    });
    const [editingCategory, setEditingCategory] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryTodos, setCategoryTodos] = useState([]);
    const [isTodosModalOpen, setIsTodosModalOpen] = useState(false);
    const { isDark } = useTheme();

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await categoryService.getAllCategories();
            console.log('Categories loaded:', response);
            if (response?.status === 'success' && Array.isArray(response.data)) {
                setCategories(response.data);
            } else {
                console.error('Invalid response format:', response);
                setError('Kategori verisi beklenmeyen formatta.');
            }
        } catch (error) {
            console.error('Kategoriler yüklenirken hata:', error.response || error);
            setError(error.response?.data?.message || 'Kategoriler yüklenirken bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setError(null);
            if (editingCategory) {
                const response = await categoryService.updateCategory(editingCategory.id, newCategory);
                console.log('Category updated:', response);
            } else {
                const response = await categoryService.createCategory(newCategory);
                console.log('Category created:', response);
            }
            setNewCategory({ name: '', color: '#3B82F6', description: '' });
            setEditingCategory(null);
            setIsModalOpen(false);
            await loadCategories();
        } catch (error) {
            console.error('Kategori kaydedilirken hata:', error.response || error);
            setError(error.response?.data?.message || 'Kategori kaydedilirken bir hata oluştu.');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
            try {
                setError(null);
                const response = await categoryService.deleteCategory(id);
                console.log('Category deleted:', response);
                await loadCategories();
            } catch (error) {
                console.error('Kategori silinirken hata:', error.response || error);
                setError(error.response?.data?.message || 'Kategori silinirken bir hata oluştu.');
            }
        }
    };

    const startEditing = (category) => {
        setEditingCategory(category);
        setNewCategory({
            name: category.name,
            color: category.color,
            description: category.description
        });
        setIsModalOpen(true);
    };

    const handleCategoryClick = async (category, e) => {
        if (e.target.closest('button')) {
            return;
        }
        
        try {
            setIsLoading(true);
            const response = await categoryService.getCategoryTodos(category.id);
            if (response?.status === 'success') {
                setSelectedCategory(category);
                setCategoryTodos(response.data);
                setIsTodosModalOpen(true);
            }
        } catch (error) {
            console.error('Kategori todoları yüklenirken hata:', error);
            setError('Kategori todoları yüklenirken bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-4 text-center">
                <p className="text-red-400 mb-4">{error}</p>
                <button
                    onClick={loadCategories}
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                >
                    Tekrar Dene
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                        Kategoriler
                        <span className={`ml-2 text-sm font-normal ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            ({categories.length} kategori)
                        </span>
                    </h2>
                    <p className={`mt-1 text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        Görevlerinizi organize etmek için kategoriler oluşturun ve yönetin
                    </p>
                </div>
                
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setIsModalOpen(true)}
                    className={`
                        relative group
                        px-4 py-2.5 rounded-xl
                        bg-gradient-to-r from-indigo-500 to-purple-500
                        hover:from-indigo-600 hover:to-purple-600
                        text-white font-medium
                        transition-all duration-200
                        flex items-center gap-2
                        shadow-lg shadow-indigo-500/25
                        hover:shadow-indigo-500/50
                    `}
                >
                    <span className="relative flex h-6 w-6 shrink-0 items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-20"></span>
                        <span className="relative text-lg">+</span>
                    </span>
                    <span>Yeni Kategori</span>
                </motion.button>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                    {categories.map(category => (
                        <motion.div
                            key={category.id}
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            whileHover={{ scale: 1.02 }}
                            onClick={(e) => handleCategoryClick(category, e)}
                            className={`
                                group cursor-pointer
                                ${isDark ? 'bg-gray-800/50' : 'bg-white'}
                                backdrop-blur-sm rounded-xl
                                border-2 ${isDark ? 'border-gray-700/50' : 'border-gray-100'}
                                hover:border-indigo-500/30
                                shadow-lg ${isDark ? 'shadow-black/20' : 'shadow-gray-200/50'}
                                hover:shadow-xl hover:shadow-indigo-500/10
                                transition-all duration-300
                                overflow-hidden
                                relative
                            `}
                            style={{
                                borderLeftColor: category.color,
                                borderLeftWidth: '4px'
                            }}
                        >
                            {/* Category Color Indicator */}
                            <div
                                className="absolute inset-y-0 left-0 w-1"
                                style={{ backgroundColor: category.color }}
                            />

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-2">
                                        <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'} group-hover:text-indigo-500 transition-colors duration-200`}>
                                            {category.name}
                                        </h3>
                                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                            {category.description || 'Açıklama yok'}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                startEditing(category);
                                            }}
                                            className={`
                                                p-2 rounded-lg
                                                ${isDark 
                                                    ? 'hover:bg-gray-700/50 text-gray-400 hover:text-indigo-400'
                                                    : 'hover:bg-gray-100 text-gray-500 hover:text-indigo-600'
                                                }
                                                transition-all duration-200
                                            `}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                            </svg>
                                        </motion.button>
                                        <motion.button
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleDelete(category.id);
                                            }}
                                            className={`
                                                p-2 rounded-lg
                                                ${isDark 
                                                    ? 'hover:bg-red-900/30 text-red-400 hover:text-red-300'
                                                    : 'hover:bg-red-50 text-red-500 hover:text-red-600'
                                                }
                                                transition-all duration-200
                                            `}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                            </svg>
                                        </motion.button>
                                    </div>
                                </div>

                                {/* Category Meta */}
                                <div className="mt-4 flex items-center gap-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: category.color }}
                                    />
                                    <span className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        {category.todos_count || 0} görev
                                    </span>
                                </div>
                            </div>

                            {/* Hover Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-indigo-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            {/* Category Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`
                            ${isDark ? 'bg-gray-800' : 'bg-white'}
                            rounded-xl shadow-xl
                            max-w-md w-full mx-4 p-6
                            ${!isDark && 'shadow-indigo-500/10'}
                        `}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h3 className={`text-xl font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                                {editingCategory ? 'Kategori Düzenle' : 'Yeni Kategori'}
                            </h3>
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setEditingCategory(null);
                                    setNewCategory({ name: '', color: '#3B82F6', description: '' });
                                }}
                                className={`
                                    p-2 rounded-lg
                                    ${isDark
                                        ? 'hover:bg-gray-700/50 text-gray-400 hover:text-gray-200'
                                        : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                                    }
                                    transition-all duration-200
                                `}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                                    Kategori Adı
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={newCategory.name}
                                    onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                                    className={`
                                        w-full px-4 py-2.5 rounded-lg
                                        ${isDark
                                            ? 'bg-gray-700/50 text-gray-200 border-gray-600'
                                            : 'bg-gray-50/50 text-gray-900 border-gray-200'
                                        }
                                        focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                                        transition-all duration-200
                                        ${!isDark && 'hover:bg-gray-50'}
                                    `}
                                    required
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                                    Açıklama
                                </label>
                                <textarea
                                    name="description"
                                    value={newCategory.description}
                                    onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                                    className={`
                                        w-full px-4 py-2.5 rounded-lg
                                        ${isDark
                                            ? 'bg-gray-700/50 text-gray-200 border-gray-600'
                                            : 'bg-gray-50/50 text-gray-900 border-gray-200'
                                        }
                                        focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                                        transition-all duration-200
                                        ${!isDark && 'hover:bg-gray-50'}
                                    `}
                                    rows="3"
                                />
                            </div>

                            <div>
                                <label className={`block text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-1`}>
                                    Renk
                                </label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="color"
                                        name="color"
                                        value={newCategory.color}
                                        onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                                        className="w-12 h-12 rounded-lg cursor-pointer"
                                    />
                                    <div className="flex-1 h-12 rounded-lg" style={{ backgroundColor: newCategory.color }} />
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <motion.button
                                    type="button"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setEditingCategory(null);
                                        setNewCategory({ name: '', color: '#3B82F6', description: '' });
                                    }}
                                    className={`
                                        px-4 py-2 rounded-lg
                                        ${isDark
                                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }
                                        transition-all duration-200
                                    `}
                                >
                                    İptal
                                </motion.button>
                                <motion.button
                                    type="submit"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="
                                        px-4 py-2 rounded-lg
                                        bg-gradient-to-r from-indigo-500 to-purple-500
                                        text-white
                                        hover:from-indigo-600 hover:to-purple-600
                                        transition-all duration-200
                                        hover:shadow-lg hover:shadow-indigo-500/20
                                    "
                                >
                                    {editingCategory ? 'Güncelle' : 'Oluştur'}
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}

            {/* Category Todos Modal */}
            {isTodosModalOpen && selectedCategory && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`
                            ${isDark ? 'bg-gray-800' : 'bg-white'}
                            rounded-xl shadow-xl
                            max-w-4xl w-full mx-4 p-6
                            max-h-[80vh] overflow-y-auto
                            ${!isDark && 'shadow-indigo-500/10'}
                        `}
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: selectedCategory.color }}
                                />
                                <div>
                                    <h3 className={`text-xl font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>
                                        {selectedCategory.name}
                                    </h3>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Bu kategoriye ait görevler
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsTodosModalOpen(false)}
                                className={`
                                    p-2 rounded-lg
                                    ${isDark
                                        ? 'hover:bg-gray-700/50 text-gray-400 hover:text-gray-200'
                                        : 'hover:bg-gray-100 text-gray-500 hover:text-gray-700'
                                    }
                                    transition-all duration-200
                                `}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {categoryTodos.length > 0 ? (
                                categoryTodos.map(todo => (
                                    <motion.div
                                        key={todo.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            type: "spring",
                                            stiffness: 260,
                                            damping: 20
                                        }}
                                        className={`
                                            ${isDark ? 'bg-gray-700/50' : 'bg-gray-50'}
                                            rounded-lg p-4
                                            border ${isDark ? 'border-gray-600' : 'border-gray-200'}
                                            relative
                                            hover:shadow-lg transition-shadow duration-200
                                            ${isDark ? 'hover:shadow-black/20' : 'hover:shadow-gray-200/50'}
                                        `}
                                    >
                                        {/* Status Badge */}
                                        <div className={`
                                            absolute top-2 right-2
                                            px-2 py-1 rounded-full text-xs font-medium
                                            ${todo.status === 'completed'
                                                ? 'bg-green-500/10 text-green-500'
                                                : todo.status === 'in_progress'
                                                    ? 'bg-yellow-500/10 text-yellow-500'
                                                    : 'bg-gray-500/10 text-gray-500'
                                            }
                                        `}>
                                            {todo.status === 'completed' ? '✓ Tamamlandı'
                                                : todo.status === 'in_progress' ? (
                                                    <span className="inline-flex items-center">
                                                        <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none">
                                                            <path d="M12 4V8M12 16V20M8 12H4M20 12H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                                        </svg>
                                                        Devam Ediyor
                                                    </span>
                                                )
                                                : '○ Bekliyor'}
                                        </div>

                                        <h4 className={`text-lg font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'} mb-2`}>
                                            {todo.title}
                                        </h4>
                                        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} mb-4`}>
                                            {todo.description}
                                        </p>

                                        {/* Priority Badge */}
                                        <div className={`
                                            inline-flex items-center
                                            px-2 py-1 rounded-full text-xs font-medium
                                            ${todo.priority === 'high'
                                                ? 'bg-red-500/10 text-red-500'
                                                : todo.priority === 'medium'
                                                    ? 'bg-yellow-500/10 text-yellow-500'
                                                    : 'bg-blue-500/10 text-blue-500'
                                            }
                                        `}>
                                            {todo.priority === 'high' ? '🔴 Yüksek'
                                                : todo.priority === 'medium' ? '🟡 Orta'
                                                    : '🔵 Düşük'}
                                        </div>
                                    </motion.div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-16 h-16 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <h4 className={`text-lg font-medium ${isDark ? 'text-gray-300' : 'text-gray-600'} mb-2`}>
                                        Bu kategoride henüz görev bulunmuyor
                                    </h4>
                                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Yeni bir görev ekleyerek başlayabilirsiniz
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>
            )}
        </div>
    );
};

export default CategoryManager; 