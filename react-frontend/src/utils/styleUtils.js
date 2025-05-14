export const getStatusColor = (status, isDark) => {
  const colors = {
    pending: isDark 
      ? 'bg-yellow-800 text-yellow-50 border-yellow-600'
      : 'bg-yellow-50 text-yellow-900 border-yellow-400',
    in_progress: isDark
      ? 'bg-blue-800 text-blue-50 border-blue-600'
      : 'bg-blue-50 text-blue-900 border-blue-400',
    completed: isDark
      ? 'bg-green-800 text-green-50 border-green-600'
      : 'bg-green-50 text-green-900 border-green-400'
  };
  return colors[status] || colors.pending;
};

export const getPriorityColor = (priority, isDark) => {
  const colors = {
    low: isDark
      ? 'bg-green-800 text-green-50 border-green-600'
      : 'bg-green-50 text-green-900 border-green-400',
    medium: isDark
      ? 'bg-orange-800 text-orange-50 border-orange-600'
      : 'bg-orange-50 text-orange-900 border-orange-400',
    high: isDark
      ? 'bg-red-800 text-red-50 border-red-600'
      : 'bg-red-50 text-red-900 border-red-400'
  };
  return colors[priority] || colors.low;
};

export const getCommonDarkStyles = (isDark) => ({
  bg: isDark ? 'bg-gray-900' : 'bg-white',
  text: isDark ? 'text-gray-50' : 'text-gray-900',
  border: isDark ? 'border-gray-700' : 'border-gray-300',
  borderHover: isDark ? 'hover:border-gray-600' : 'hover:border-gray-400'
});

export const getButtonStyles = (isDark) => ({
  base: `
    px-4 py-2 rounded-lg
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
  `,
  primary: isDark
    ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500'
    : 'bg-indigo-700 text-white hover:bg-indigo-800 focus:ring-indigo-600',
  secondary: isDark
    ? 'bg-gray-700 text-gray-50 hover:bg-gray-600 focus:ring-gray-500'
    : 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-400',
  danger: isDark
    ? 'bg-red-700 text-white hover:bg-red-800 focus:ring-red-600'
    : 'bg-red-700 text-white hover:bg-red-800 focus:ring-red-600'
}); 