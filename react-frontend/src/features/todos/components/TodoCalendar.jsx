import React, { useState } from 'react';
import { useTheme } from '../../../contexts/ThemeContext';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { tr } from 'date-fns/locale';

const TodoCalendar = ({ todos, onEdit, onStatusChange }) => {
    const { isDark } = useTheme();
    const [currentDate, setCurrentDate] = useState(new Date());

    // Ayın günlerini hesapla
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // Her gün için o güne ait görevleri bul
    const getTodosForDay = (day) => {
        return todos.filter(todo => {
            if (!todo.due_date) return false;
            const dueDate = new Date(todo.due_date);
            return isSameDay(dueDate, day);
        });
    };

    // Önceki ve sonraki ay geçişleri
    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
    };

    // Görev önceliğine göre renk belirleme
    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high':
                return isDark ? 'bg-red-900/30 text-red-200' : 'bg-red-100 text-red-700';
            case 'medium':
                return isDark ? 'bg-yellow-900/30 text-yellow-200' : 'bg-yellow-100 text-yellow-700';
            default:
                return isDark ? 'bg-blue-900/30 text-blue-200' : 'bg-blue-100 text-blue-700';
        }
    };

    return (
        <div className="space-y-6">
            {/* Ay Navigasyonu */}
            <div className="flex items-center justify-between">
                <button
                    onClick={prevMonth}
                    className={`p-2 rounded-lg transition-colors ${
                        isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                    }`}
                >
                    ◀ Önceki Ay
                </button>
                <h2 className={`text-2xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {format(currentDate, 'MMMM yyyy', { locale: tr })}
                </h2>
                <button
                    onClick={nextMonth}
                    className={`p-2 rounded-lg transition-colors ${
                        isDark ? 'hover:bg-gray-700 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                    }`}
                >
                    Sonraki Ay ▶
                </button>
            </div>

            {/* Takvim */}
            <div className={`rounded-xl border ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
                {/* Takvim Başlıkları */}
                <div className="grid grid-cols-7 border-b border-gray-200 dark:border-gray-700">
                    {['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'].map(day => (
                        <div
                            key={day}
                            className={`text-center py-3 font-semibold ${
                                isDark ? 'text-gray-300' : 'text-gray-600'
                            }`}
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Takvim Günleri */}
                <div className="grid grid-cols-7">
                    {/* Ayın ilk gününün boşluklarını ekle */}
                    {Array.from({ length: monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1 }).map((_, index) => (
                        <div
                            key={`empty-${index}`}
                            className={`min-h-[120px] p-2 border-b border-r ${
                                isDark ? 'border-gray-700 bg-gray-800/30' : 'border-gray-200 bg-gray-50/30'
                            }`}
                        />
                    ))}

                    {/* Günleri göster */}
                    {days.map((day, index) => {
                        const dayTodos = getTodosForDay(day);
                        const isToday = isSameDay(day, new Date());
                        const isLastRow = index >= days.length - 7;

                        return (
                            <div
                                key={day.toISOString()}
                                className={`min-h-[120px] p-2 border-r ${!isLastRow ? 'border-b' : ''} ${
                                    isDark ? 'border-gray-700' : 'border-gray-200'
                                } ${
                                    isToday
                                        ? isDark
                                            ? 'bg-indigo-900/20 ring-1 ring-inset ring-indigo-500'
                                            : 'bg-indigo-50 ring-1 ring-inset ring-indigo-500'
                                        : isDark
                                        ? 'hover:bg-gray-800/50'
                                        : 'hover:bg-gray-50'
                                }`}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span
                                        className={`inline-flex items-center justify-center w-7 h-7 rounded-full ${
                                            isToday
                                                ? 'bg-indigo-500 text-white font-semibold'
                                                : isDark
                                                ? 'text-gray-300'
                                                : 'text-gray-600'
                                        }`}
                                    >
                                        {format(day, 'd')}
                                    </span>
                                    {dayTodos.length > 0 && (
                                        <span className={`text-xs px-2 py-1 rounded-full ${
                                            isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                                        }`}>
                                            {dayTodos.length}
                                        </span>
                                    )}
                                </div>
                                <div className="space-y-1 max-h-[80px] overflow-y-auto">
                                    {dayTodos.map(todo => (
                                        <div
                                            key={todo.id}
                                            onClick={() => onEdit(todo)}
                                            className={`px-2 py-1 text-xs rounded cursor-pointer ${
                                                getPriorityColor(todo.priority)
                                            } ${
                                                todo.status === 'completed'
                                                    ? 'line-through opacity-50'
                                                    : ''
                                            }`}
                                            title={todo.title}
                                        >
                                            <div className="flex items-center gap-1">
                                                <span className="w-2 h-2 rounded-full bg-current" />
                                                <span className="truncate">{todo.title}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default TodoCalendar; 