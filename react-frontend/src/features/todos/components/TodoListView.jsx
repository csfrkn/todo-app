import React, { memo, Suspense } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { getThemeColors } from '../../../theme/colors';
import { commonStyles, animations, colorPalettes } from '../../../theme/styles';
import { AnimatePresence, motion } from 'framer-motion';
import {
    TodoCard,
    TodoCalendar,
    CardSkeleton,
    CalendarSkeleton,
    ErrorBoundary
} from './LazyComponents';

const TodoListView = memo(({
    todos,
    isLoading,
    error,
    viewMode,
    isDark,
    isModalOpen,
    editingTodo,
    searchQuery,
    statusFilter,
    priorityFilter,
    currentPage,
    totalPages,
    pageNumbers,
    onEdit,
    onDelete,
    onStatusChange,
    onSubmit,
    onCloseModal,
    onOpenModal,
    onPageChange,
    onSearchChange,
    onStatusFilterChange,
    onPriorityFilterChange,
    onViewModeChange
}) => {
    const themeColors = getThemeColors(isDark);

    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center py-12"
            >
                <motion.div 
                    animate={{ 
                        rotate: 360,
                        transition: {
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear"
                        }
                    }}
                    className={`
                        w-12 h-12 mb-4
                        rounded-full
                        border-2 border-transparent
                        ${commonStyles.gradients.secondary}
                        relative
                        ${commonStyles.glow.sm}
                    `}
                >
                    <div className="absolute inset-1 rounded-full bg-gray-900"></div>
                </motion.div>
                <motion.p 
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className={`text-lg font-medium ${themeColors.text.primary}`}
                >
                    Yükleniyor...
                </motion.p>
            </motion.div>
        );
    }

    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-8 text-center ${commonStyles.card.base(isDark)} ${commonStyles.glow.sm}`}
            >
                <motion.div
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring" }}
                    className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-500/10"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </motion.div>
                <motion.p
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.1 }}
                    className="text-red-500 text-lg font-medium mb-4"
                >
                    {error}
                </motion.p>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => window.location.reload()}
                    className={`${commonStyles.button.base} ${commonStyles.button.primary(isDark)}`}
                >
                    Tekrar Dene
                </motion.button>
            </motion.div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filtreler */}
            <div 
                className={`${commonStyles.card.base(isDark)} p-6`}
            >
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Arama Kutusu */}
                    <div className="flex-1 relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" 
                                className={`w-5 h-5 transition-colors duration-200 ${isDark ? 'text-gray-400 group-focus-within:text-indigo-400' : 'text-gray-500 group-focus-within:text-indigo-500'}`}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </div>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Görev ara..."
                            className={`${commonStyles.input.base(isDark)} pl-12`}
                        />
                    </div>

                    {/* Filtreler */}
                    <div className="flex flex-col sm:flex-row gap-4 md:w-auto">
                        {/* Durum Filtresi */}
                        <select
                            value={statusFilter}
                            onChange={(e) => onStatusFilterChange(e.target.value)}
                            className={`${commonStyles.input.base(isDark)} appearance-none cursor-pointer min-w-[180px]`}
                        >
                            <option value="all">🔍 Tüm Durumlar</option>
                            <option value="pending">⏳ Bekliyor</option>
                            <option value="in_progress">🔄 Devam Ediyor</option>
                            <option value="completed">✅ Tamamlandı</option>
                        </select>

                        {/* Öncelik Filtresi */}
                        <select
                            value={priorityFilter}
                            onChange={(e) => onPriorityFilterChange(e.target.value)}
                            className={`${commonStyles.input.base(isDark)} appearance-none cursor-pointer min-w-[180px]`}
                        >
                            <option value="all">🔍 Tüm Öncelikler</option>
                            <option value="low">🟢 Düşük</option>
                            <option value="medium">🟡 Orta</option>
                            <option value="high">🔴 Yüksek</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Todo Listesi */}
            {todos.length === 0 ? (
                <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="text-center py-12"
                >
                    <motion.h3
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        className={`text-2xl font-bold ${themeColors.text.primary} mb-2`}
                    >
                        Henüz görev yok
                    </motion.h3>
                    <motion.p
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", delay: 0.2 }}
                        className={`${themeColors.text.secondary} mb-4`}
                    >
                        Yeni bir görev ekleyerek başlayın
                    </motion.p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onOpenModal}
                        className={`${commonStyles.button.base} ${commonStyles.button.primary(isDark)}`}
                    >
                        Görev Ekle
                    </motion.button>
                </motion.div>
            ) : (
                <>
                    {/* Add Todo Button */}
                    <div className="mb-6">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onOpenModal}
                            className={`
                                w-full p-4 rounded-xl
                                bg-gradient-to-r from-indigo-500 to-purple-500
                                hover:from-indigo-600 hover:to-purple-600
                                text-white font-medium
                                shadow-lg shadow-indigo-500/25
                                hover:shadow-indigo-500/50
                                transition-all duration-300
                                relative overflow-hidden
                                flex items-center justify-center gap-3
                                group
                            `}
                        >
                            {/* Shine Effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                            
                            {/* Plus Icon with Animation */}
                            <div className="relative">
                                <motion.div
                                    initial={false}
                                    animate={{ rotate: 180 }}
                                    transition={{
                                        duration: 0.4,
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        ease: "easeInOut"
                                    }}
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </motion.div>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6 group-hover:opacity-0 transition-opacity duration-300">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </div>

                            {/* Button Text */}
                            <span className="text-lg tracking-wide relative">
                                Yeni Görev Ekle
                            </span>

                            {/* Pulse Effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur opacity-30 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                        </motion.button>
                    </div>

                    {/* Todo Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
                        <AnimatePresence mode="popLayout">
                            {todos.map(todo => (
                                <motion.div
                                    key={todo.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{
                                        layout: { duration: 0.3, ease: "easeOut" },
                                        opacity: { duration: 0.2 },
                                        scale: { duration: 0.2 }
                                    }}
                                >
                                    <ErrorBoundary fallback={(error) => (
                                        <div className={`p-4 rounded-lg ${isDark ? 'bg-red-900/20 text-red-200' : 'bg-red-100 text-red-700'}`}>
                                            Görev yüklenirken bir hata oluştu.
                                        </div>
                                    )}>
                                        <Suspense fallback={<CardSkeleton />}>
                                            <TodoCard
                                                todo={todo}
                                                onEdit={onEdit}
                                                onDelete={onDelete}
                                                onStatusChange={onStatusChange}
                                            />
                                        </Suspense>
                                    </ErrorBoundary>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </>
            )}

            {/* Sayfalama */}
            {todos.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center items-center gap-2 mt-8"
                >
                    <button
                        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className={`${commonStyles.button.base} ${commonStyles.button.secondary(isDark)} disabled:opacity-50`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                    </button>

                    <div className="flex items-center gap-2">
                        {pageNumbers.map((number, index) => (
                            typeof number === 'string' ? (
                                <span
                                    key={`dots-${index}`}
                                    className={`w-8 text-center ${colorPalettes[isDark ? 'dark' : 'light'].text.secondary}`}
                                >
                                    ...
                                </span>
                            ) : (
                                <button
                                    key={number}
                                    onClick={() => onPageChange(number)}
                                    className={`
                                        ${commonStyles.button.base}
                                        min-w-[2.5rem]
                                        ${currentPage === number 
                                            ? commonStyles.button.primary(isDark)
                                            : commonStyles.button.secondary(isDark)
                                        }
                                    `}
                                >
                                    {number}
                                </button>
                            )
                        ))}
                    </div>

                    <button
                        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className={`${commonStyles.button.base} ${commonStyles.button.secondary(isDark)} disabled:opacity-50`}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </motion.div>
            )}
        </div>
    );
});

export default TodoListView; 