import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../contexts/ThemeContext';
import { useToast } from '../../../contexts/ToastContext';
import { getThemeColors } from '../../../theme/colors';
import { ITEMS_PER_PAGE } from '../../../constants/todoConstants';
import todoService from '../../../api/todoService';
import TodoListView from './TodoListView';
import ConfirmationModal from './ConfirmationModal';
import TodoFormModal from './TodoFormModal';
import TodoCalendar from './TodoCalendar';

// Debounce hook
const useDebounce = (value, delay) => {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(handler);
        };
    }, [value, delay]);

    return debouncedValue;
};

const ViewModeButton = ({ isActive, onClick, icon, text, isDark }) => (
    <motion.button
        whileHover={{ scale: 1.03, y: -2 }}
        whileTap={{ scale: 0.97 }}
        onClick={onClick}
        className={`
            relative flex items-center gap-3 px-5 py-3 rounded-xl
            transition-all duration-300 ease-out
            ${isActive
                ? `
                    bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                    text-white font-medium shadow-lg
                    shadow-indigo-500/20 dark:shadow-indigo-900/30
                    border border-indigo-400/20
                `
                : isDark
                    ? `
                        bg-gray-800/80 text-gray-300
                        hover:bg-gray-750 hover:text-white
                        shadow-md shadow-gray-900/20
                        border border-gray-700/50
                    `
                    : `
                        bg-white text-gray-700
                        hover:bg-gray-50 hover:text-gray-900
                        shadow-md shadow-gray-200/50
                        border border-gray-200/80
                    `
            }
            backdrop-blur-sm
        `}
    >
        {/* Arka plan efekti */}
        {isActive && (
            <motion.div
                layoutId="activeIndicator"
                className="absolute inset-0 rounded-xl overflow-hidden"
                initial={false}
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            >
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(120,119,198,0.3),transparent)]" />
            </motion.div>
        )}

        {/* İkon */}
        <span className={`
            text-xl transition-transform duration-300
            ${isActive ? 'scale-110' : 'scale-100'}
            group-hover:scale-110
        `}>
            {icon}
        </span>

        {/* Metin */}
        <span className={`
            text-sm font-medium tracking-wide
            transition-all duration-300
            ${isActive ? 'translate-x-0.5' : ''}
        `}>
            {text}
        </span>

        {/* Parıltı efekti */}
        {isActive && (
            <div className="absolute inset-0 rounded-xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent shine-effect" />
            </div>
        )}
    </motion.button>
);

const TodoList = ({ onUpdateTodos }) => {
    const { isDark } = useTheme();
    const { addToast } = useToast();
    const colors = useMemo(() => getThemeColors(isDark), [isDark]);
    
    const [todos, setTodos] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTodo, setEditingTodo] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [sortBy, setSortBy] = useState('created_at');
    const [sortDirection, setSortDirection] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('list');
    const [deletingTodo, setDeletingTodo] = useState(null);

    // Debounce search query
    const debouncedSearchQuery = useDebounce(searchQuery, 500);

    const loadTodos = useCallback(async () => {
        try {
            setError(null);
            setIsLoading(true);
            
            let response;
            
            if (debouncedSearchQuery) {
                // Use search endpoint if there's a search query
                response = await todoService.searchTodos(debouncedSearchQuery);
            } else {
                // Use regular todos endpoint for filtering and pagination
                const params = {
                    limit: ITEMS_PER_PAGE,
                    page: currentPage,
                    sort: sortBy,
                    order: sortDirection,
                    ...(statusFilter !== 'all' && { status: statusFilter }),
                    ...(priorityFilter !== 'all' && { priority: priorityFilter })
                };
                
                response = await todoService.getAllTodos(params);
            }
            
            if (response?.status === 'success') {
                setTodos(response.data);
                
                if (response.meta?.pagination) {
                    setTotalItems(response.meta.pagination.total);
                    setTotalPages(response.meta.pagination.last_page);
                    
                    if (response.meta.pagination.current_page !== currentPage) {
                        setCurrentPage(response.meta.pagination.current_page);
                    }

                    onUpdateTodos?.(response.data, response.meta.pagination.total);
                }
            }
        } catch (error) {
            console.error('Todo\'lar yüklenirken hata:', error);
            setError('Görevler yüklenirken bir hata oluştu.');
            addToast('Görevler yüklenirken bir hata oluştu.', 'error');
        } finally {
            setIsLoading(false);
        }
    }, [currentPage, sortBy, sortDirection, statusFilter, priorityFilter, debouncedSearchQuery, onUpdateTodos, addToast]);

    // Filtre değişikliklerinde sayfa 1'e dön
    useEffect(() => {
        setCurrentPage(1);
        loadTodos();
    }, [debouncedSearchQuery, statusFilter, priorityFilter, sortBy, sortDirection]);

    // Normal yükleme
    useEffect(() => {
        loadTodos();
    }, [currentPage]);

    // Reload todos event listener
    useEffect(() => {
        const handleReloadTodos = () => {
            loadTodos();
        };

        document.addEventListener('reload-todos', handleReloadTodos);
        return () => {
            document.removeEventListener('reload-todos', handleReloadTodos);
        };
    }, [loadTodos]);

    const handleSubmit = useCallback(async (todoData) => {
        try {
            if (editingTodo) {
                await todoService.updateTodo(editingTodo.id, todoData);
                addToast('Görev başarıyla güncellendi.', 'success');
            } else {
                await todoService.createTodo(todoData);
                addToast('Yeni görev başarıyla oluşturuldu.', 'success');
            }
            setIsModalOpen(false);
            setEditingTodo(null);
            loadTodos();
        } catch (error) {
            console.error('Todo kaydedilirken hata:', error);
            addToast('Görev kaydedilirken bir hata oluştu.', 'error');
        }
    }, [editingTodo, loadTodos, addToast]);

    const handleDelete = useCallback(async (todo) => {
        setDeletingTodo(todo);
    }, []);

    const confirmDelete = useCallback(async () => {
        if (!deletingTodo) return;

        try {
            await todoService.deleteTodo(deletingTodo.id);
            addToast('Görev başarıyla silindi.', 'success');
            loadTodos();
            setDeletingTodo(null);
        } catch (error) {
            console.error('Todo silinirken hata:', error);
            addToast('Görev silinirken bir hata oluştu.', 'error');
        }
    }, [deletingTodo, loadTodos, addToast]);

    const handleStatusChange = useCallback(async (todo) => {
        try {
            await todoService.updateTodoStatus(todo.id, { status: todo.status });
            addToast('Görev durumu güncellendi.', 'success');
            loadTodos();
        } catch (error) {
            console.error('Todo durumu güncellenirken hata:', error);
            addToast('Görev durumu güncellenirken bir hata oluştu.', 'error');
        }
    }, [loadTodos, addToast]);

    const handlePageChange = useCallback((page) => {
        if (page === currentPage) return;
        setCurrentPage(page);
    }, [currentPage]);

    const pageNumbers = useMemo(() => {
        const numbers = [];
        const maxVisiblePages = 5;
        
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        if (startPage > 1) {
            numbers.push(1);
            if (startPage > 2) numbers.push('...');
        }

        for (let i = startPage; i <= endPage; i++) {
            numbers.push(i);
        }

        if (endPage < totalPages) {
            if (endPage < totalPages - 1) numbers.push('...');
            numbers.push(totalPages);
        }

        return numbers;
    }, [currentPage, totalPages]);

    const commonModalProps = {
        isOpen: isModalOpen,
        onClose: () => {
            setIsModalOpen(false);
            setEditingTodo(null);
        },
        onSubmit: handleSubmit,
        editingTodo: editingTodo,
        isDark: isDark
    };

    const commonConfirmationProps = {
        isOpen: !!deletingTodo,
        onClose: () => setDeletingTodo(null),
        onConfirm: confirmDelete,
        title: "Görevi Sil",
        message: "Bu görevi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.",
        confirmText: "Evet, Sil",
        cancelText: "İptal",
        isDark: isDark
    };

    const handleEdit = useCallback((todo) => {
        setEditingTodo(todo);
        setIsModalOpen(true);
    }, []);

    return (
        <div className="space-y-4">
            <div className="flex justify-end gap-4 mb-8 p-1">
                <div className={`
                    flex gap-4 p-2 rounded-2xl
                    ${isDark 
                        ? 'bg-gray-800/30 shadow-lg shadow-gray-900/20' 
                        : 'bg-white/50 shadow-lg shadow-gray-200/50'
                    }
                    backdrop-blur-sm
                `}>
                    <ViewModeButton
                        isActive={viewMode === 'list'}
                        onClick={() => setViewMode('list')}
                        icon="📋"
                        text="Liste"
                        isDark={isDark}
                    />
                    <ViewModeButton
                        isActive={viewMode === 'calendar'}
                        onClick={() => setViewMode('calendar')}
                        icon="📅"
                        text="Takvim"
                        isDark={isDark}
                    />
                </div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`
                    rounded-2xl shadow-xl
                    ${isDark 
                        ? 'bg-gray-900/30 shadow-gray-900/30' 
                        : 'bg-gray-50/30 shadow-gray-200/30'
                    }
                    backdrop-blur-sm
                `}
            >
                {viewMode === 'list' ? (
                    <TodoListView
                        todos={todos}
                        isLoading={isLoading}
                        error={error}
                        isDark={isDark}
                        searchQuery={searchQuery}
                        statusFilter={statusFilter}
                        priorityFilter={priorityFilter}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        pageNumbers={pageNumbers}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onStatusChange={handleStatusChange}
                        onOpenModal={() => {
                            setEditingTodo(null);
                            setIsModalOpen(true);
                        }}
                        onPageChange={handlePageChange}
                        onSearchChange={setSearchQuery}
                        onStatusFilterChange={setStatusFilter}
                        onPriorityFilterChange={setPriorityFilter}
                    />
                ) : (
                    <div className={`rounded-2xl border ${
                        isDark ? 'border-gray-700/50' : 'border-gray-200/50'
                    }`}>
                        <TodoCalendar
                            todos={todos}
                            onEdit={handleEdit}
                            onStatusChange={handleStatusChange}
                        />
                    </div>
                )}
            </motion.div>

            <TodoFormModal {...commonModalProps} />
            <ConfirmationModal {...commonConfirmationProps} />

            {/* Stil tanımlamaları */}
            <style jsx="true" global="true">{`
                .shine-effect {
                    background-size: 200% 100%;
                    animation: shine 3s infinite linear;
                }

                @keyframes shine {
                    from {
                        transform: translateX(-100%);
                    }
                    to {
                        transform: translateX(100%);
                    }
                }

                /* Özel scroll bar */
                ::-webkit-scrollbar {
                    width: 8px;
                    height: 8px;
                }

                ::-webkit-scrollbar-track {
                    background: ${isDark ? '#1f2937' : '#f3f4f6'};
                    border-radius: 4px;
                }

                ::-webkit-scrollbar-thumb {
                    background: ${isDark ? '#374151' : '#d1d5db'};
                    border-radius: 4px;
                }

                ::-webkit-scrollbar-thumb:hover {
                    background: ${isDark ? '#4b5563' : '#9ca3af'};
                }
            `}</style>
        </div>
    );
};

export default TodoList; 