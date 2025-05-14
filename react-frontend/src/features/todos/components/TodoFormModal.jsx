import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../contexts/ThemeContext';
import { commonStyles } from '../../../theme/styles';
import { getThemeColors } from '../../../theme/colors';
import BaseTodoForm from './forms/BaseTodoForm';

const TodoFormModal = ({ isOpen, onClose, onSubmit, editingTodo = null }) => {
    const { isDark } = useTheme();
    const colors = getThemeColors(isDark);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const handleSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            await onSubmit(data);
            setShowSuccessMessage(true);
            setTimeout(() => {
                setShowSuccessMessage(false);
                onClose();
            }, 1500);
        } catch (error) {
            console.error('Form gönderilirken hata:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50"
                style={{ backdropFilter: 'blur(8px)' }}
            >
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-black/50"
                    onClick={onClose}
                />

                {/* Modal Content */}
                <motion.div
                    initial={{ opacity: 0, y: -100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -100 }}
                    transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
                    className={`
                        ${commonStyles.card.base(isDark)}
                        fixed top-20 left-0 right-0
                        max-w-2xl w-full mx-auto
                        ${commonStyles.glow.sm}
                        relative overflow-hidden
                        backdrop-blur-xl
                        border ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'}
                        shadow-2xl ${isDark ? 'shadow-black/20' : 'shadow-gray-200/50'}
                        rounded-none rounded-b-xl
                    `}
                >
                    {/* Success Message */}
                    <AnimatePresence>
                        {showSuccessMessage && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className={`
                                    absolute top-0 left-0 right-0
                                    p-4 bg-green-500/20 backdrop-blur-md
                                    border-b ${isDark ? 'border-green-500/30' : 'border-green-500/20'}
                                    flex items-center justify-center gap-2
                                    text-green-500
                                `}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <span className="font-medium">
                                    {editingTodo ? 'Görev başarıyla güncellendi!' : 'Görev başarıyla oluşturuldu!'}
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="p-6 relative">
                        <div className="flex justify-between items-center mb-6">
                            <div>
                                <motion.h2
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className={`text-2xl font-bold ${colors.text.primary}`}
                                >
                                    {editingTodo ? 'Görevi Düzenle' : 'Yeni Görev Ekle'}
                                </motion.h2>
                                <motion.p
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                    className={`text-sm ${colors.text.secondary} mt-1`}
                                >
                                    {editingTodo ? 'Görev detaylarını güncelleyin' : 'Yeni bir görev oluşturun'}
                                </motion.p>
                            </div>

                            <motion.button
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                whileHover={{ scale: 1.1, rotate: 90 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={onClose}
                                className={`
                                    p-2 rounded-full
                                    transition-colors duration-200
                                    ${isDark
                                        ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700/50'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100/50'
                                    }
                                    relative overflow-hidden group
                                `}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </motion.button>
                        </div>

                        <BaseTodoForm
                            onSubmit={handleSubmit}
                            initialData={editingTodo}
                            isSubmitting={isSubmitting}
                            showSuccessMessage={showSuccessMessage}
                            isAdding={!editingTodo}
                        />
                    </div>

                    {/* Background Decoration */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500 rounded-full opacity-5 blur-3xl"></div>
                        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500 rounded-full opacity-5 blur-3xl"></div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default TodoFormModal; 