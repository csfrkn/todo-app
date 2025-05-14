export const getThemeColors = (isDark) => ({
    priority: {
        low: isDark ? 'text-green-400 bg-green-500/10' : 'text-green-600 bg-green-100',
        medium: isDark ? 'text-yellow-400 bg-yellow-500/10' : 'text-yellow-600 bg-yellow-100',
        high: isDark ? 'text-red-400 bg-red-500/10' : 'text-red-600 bg-red-100'
    },
    status: {
        pending: isDark ? 'text-yellow-400 bg-yellow-500/10' : 'text-yellow-600 bg-yellow-100',
        in_progress: isDark ? 'text-blue-400 bg-blue-500/10' : 'text-blue-600 bg-blue-100',
        completed: isDark ? 'text-green-400 bg-green-500/10' : 'text-green-600 bg-green-100'
    },
    text: {
        primary: isDark ? 'text-gray-200' : 'text-gray-900',
        secondary: isDark ? 'text-gray-400' : 'text-gray-600',
        muted: isDark ? 'text-gray-500' : 'text-gray-400'
    },
    background: {
        primary: isDark ? 'bg-gray-800/50' : 'bg-white/50',
        secondary: isDark ? 'bg-gray-900/50' : 'bg-gray-50',
        hover: isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'
    },
    border: {
        primary: isDark ? 'border-gray-700/50' : 'border-gray-200/50',
        hover: isDark ? 'hover:border-gray-600/50' : 'hover:border-gray-300'
    },
    shadow: {
        primary: isDark ? 'shadow-black/20' : 'shadow-gray-200/50',
        hover: isDark ? 'hover:shadow-black/20' : 'hover:shadow-gray-200/50'
    }
}); 