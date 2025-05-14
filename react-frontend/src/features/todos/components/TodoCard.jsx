import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../../contexts/ThemeContext';
import { commonStyles, animations } from '../../../theme/styles';
import {
    PRIORITY_LABELS,
    STATUS_LABELS,
    PRIORITY_ICONS,
    STATUS_ICONS
} from '../../../constants/todoConstants';

const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Bugün ise
    if (date.toDateString() === now.toDateString()) {
        return 'Bugün';
    }
    // Yarın ise
    if (date.toDateString() === tomorrow.toDateString()) {
        return 'Yarın';
    }
    
    // Diğer durumlar için
    return date.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
};

const TodoCard = ({ todo, onEdit, onDelete, onStatusChange }) => {
    const { isDark } = useTheme();
    const [isHovered, setIsHovered] = useState(false);

    const handleStatusChange = () => {
        const statusOrder = ['pending', 'in_progress', 'completed'];
        const currentIndex = statusOrder.indexOf(todo.status);
        const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length];
        onStatusChange({ ...todo, status: nextStatus });
    };

    // Markdown bileşenleri için ortak stiller
    const markdownComponents = useMemo(() => ({
        p: ({ node, ...props }) => <p className={commonStyles.todoCard.markdown.p(isDark)} {...props} />,
        a: ({ node, ...props }) => <a className={commonStyles.todoCard.markdown.a(isDark)} {...props} />,
        h1: ({ node, ...props }) => <h1 className={`text-xl font-bold ${commonStyles.todoCard.markdown.heading(isDark)} mt-4 mb-2`} {...props} />,
        h2: ({ node, ...props }) => <h2 className={`text-lg font-semibold ${commonStyles.todoCard.markdown.heading(isDark)} mt-3 mb-2`} {...props} />,
        h3: ({ node, ...props }) => <h3 className={`text-base font-medium ${commonStyles.todoCard.markdown.heading(isDark)} mt-2 mb-1`} {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc list-inside space-y-1 mt-2" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal list-inside space-y-1 mt-2" {...props} />,
        li: ({ node, ...props }) => <li className={commonStyles.todoCard.markdown.p(isDark)} {...props} />,
        code: ({ node, inline, ...props }) =>
            inline ? (
                <code className={commonStyles.todoCard.markdown.code(isDark)} {...props} />
            ) : (
                <pre className={`p-4 rounded-lg my-3 overflow-x-auto ${commonStyles.todoCard.markdown.code(isDark)}`}>
                    <code {...props} />
                </pre>
            ),
        blockquote: ({ node, ...props }) => (
            <blockquote className={commonStyles.todoCard.markdown.blockquote(isDark)} {...props} />
        ),
    }), [isDark]);

    return (
        <motion.div
            layout={false}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
            className={`
                ${commonStyles.card.base(isDark)}
                ${commonStyles.card.hover(isDark)}
                relative p-4
                ${todo.status === 'completed' ? 'opacity-85' : ''}
                transform-gpu
                h-full min-h-[280px] flex flex-col
            `}
        >
            {/* Status Indicator */}
            <motion.div
                initial={false}
                animate={{
                    scale: isHovered ? 1.1 : 1,
                    x: isHovered ? -5 : 0,
                    y: isHovered ? -5 : 0
                }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="absolute -top-2 -left-2 z-10"
            >
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStatusChange}
                    className={`
                        w-8 h-8 rounded-lg flex items-center justify-center
                        ${commonStyles.todoCard.status(todo.status, isDark)}
                        shadow-lg ${isDark ? 'shadow-black/20' : 'shadow-gray-200/50'}
                        transition-all duration-200
                    `}
                    title={`Durum: ${STATUS_LABELS[todo.status]}`}
                >
                    {STATUS_ICONS[todo.status]}
                </motion.button>
            </motion.div>

            {/* Priority Indicator */}
            <motion.div
                initial={false}
                animate={{
                    scale: isHovered ? 1.1 : 1,
                    x: isHovered ? 5 : 0,
                    y: isHovered ? -5 : 0
                }}
                className="absolute -top-2 -right-2 z-10"
            >
                <motion.div
                    whileHover={{ scale: 1.1 }}
                    className={`
                        w-8 h-8 rounded-lg flex items-center justify-center
                        ${commonStyles.todoCard.priority(todo.priority, isDark)}
                        shadow-lg ${isDark ? 'shadow-black/20' : 'shadow-gray-200/50'}
                        transition-all duration-200
                    `}
                    title={`Öncelik: ${PRIORITY_LABELS[todo.priority]}`}
                >
                    {PRIORITY_ICONS[todo.priority]}
                </motion.div>
            </motion.div>

            {/* Main Content */}
            <div className="flex-1 mt-3 mb-2">
                <h3 className={`text-lg font-semibold mb-2 line-clamp-2 ${commonStyles.todoCard.markdown.heading(isDark)} group-hover:text-indigo-600 transition-colors duration-200`}>
                    {todo.title}
                </h3>

                {/* Due Date */}
                {todo.due_date && (
                    <div className="flex items-center gap-1.5 mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" 
                            className={`w-4 h-4 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                            {formatDate(todo.due_date)}
                        </span>
                    </div>
                )}

                <div className={`
                    prose prose-sm max-w-none
                    ${isDark ? 'prose-invert' : ''}
                    ${todo.status === 'completed' ? 'opacity-85' : ''}
                    line-clamp-4
                `}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                        {todo.description}
                    </ReactMarkdown>
                </div>
            </div>

            {/* Categories */}
            {Array.isArray(todo.categories) && todo.categories.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                    {todo.categories.map(category => (
                        <motion.span
                            key={category.id}
                            whileHover={{ scale: 1.05 }}
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            className={commonStyles.todoCard.category(isDark)}
                        >
                            <div className={`w-2.5 h-2.5 rounded-full ${isDark ? 'bg-indigo-200' : 'bg-indigo-700'}`} />
                            <span className="relative z-10">{category.name}</span>
                            <div style={animations.shine.styles} />
                        </motion.span>
                    ))}
                </div>
            )}

            {/* Action Buttons */}
            <motion.div
                layout
                initial={false}
                animate={{ opacity: isHovered ? 1 : 0.85 }}
                className="flex justify-end gap-2 mt-4"
            >
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onEdit(todo)}
                    className={`
                        p-2 rounded-lg transition-all duration-200
                        ${isDark
                            ? 'bg-gray-800 text-gray-50 hover:bg-indigo-700 hover:text-white'
                            : 'bg-gray-100 text-gray-900 hover:bg-indigo-100 hover:text-indigo-900'
                        }
                    `}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                    </svg>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onDelete(todo)}
                    className={`
                        p-2 rounded-lg transition-all duration-200
                        ${isDark
                            ? 'bg-gray-800 text-gray-50 hover:bg-red-800 hover:text-white'
                            : 'bg-gray-100 text-gray-900 hover:bg-red-100 hover:text-red-900'
                        }
                    `}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                    </svg>
                </motion.button>
            </motion.div>
        </motion.div>
    );
};

export default React.memo(TodoCard); 