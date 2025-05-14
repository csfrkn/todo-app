import React from 'react';
import { motion } from 'framer-motion';
import { commonStyles } from '../../theme/styles';

export const CardSkeleton = ({ isDark }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`${commonStyles.card.base(isDark)} p-4 mb-4`}
    >
        <div className="animate-pulse space-y-4">
            <div className="flex justify-between items-start">
                <div className="w-3/4 space-y-3">
                    <div className={`h-6 rounded-md ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                    <div className="flex gap-2">
                        <div className={`h-5 w-20 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                        <div className={`h-5 w-24 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className={`h-8 w-8 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                    <div className={`h-8 w-8 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                </div>
            </div>
            <div className="space-y-2">
                <div className={`h-4 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                <div className={`h-4 rounded w-5/6 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                <div className={`h-4 rounded w-4/6 ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
            </div>
            <div className="flex gap-2 pt-2">
                <div className={`h-6 w-24 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                <div className={`h-6 w-20 rounded-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
            </div>
        </div>
    </motion.div>
);

export const CalendarSkeleton = ({ isDark }) => (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={`${commonStyles.card.base(isDark)} p-6`}
    >
        <div className="animate-pulse space-y-6">
            <div className="flex justify-between items-center mb-4">
                <div className={`h-8 w-32 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                <div className="flex gap-2">
                    <div className={`h-8 w-8 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                    <div className={`h-8 w-8 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`} />
                </div>
            </div>
            <div className="grid grid-cols-7 gap-2 mb-4">
                {Array(7).fill(null).map((_, i) => (
                    <div
                        key={`header-${i}`}
                        className={`h-6 rounded ${isDark ? 'bg-gray-700' : 'bg-gray-200'}`}
                    />
                ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
                {Array(35).fill(null).map((_, i) => (
                    <div
                        key={`day-${i}`}
                        className={`
                            h-24 rounded-lg
                            ${isDark ? 'bg-gray-700' : 'bg-gray-200'}
                        `}
                    />
                ))}
            </div>
        </div>
    </motion.div>
);

export const ListSkeleton = ({ count = 3, isDark }) => (
    <div className="space-y-4">
        {Array(count).fill(null).map((_, i) => (
            <CardSkeleton key={i} isDark={isDark} />
        ))}
    </div>
); 