// Tema renk paletleri
export const colorPalettes = {
    indigo: {
        light: {
            bg: 'bg-indigo-100',
            text: 'text-indigo-900',
            border: 'border-indigo-300',
            hover: 'hover:bg-indigo-200'
        },
        dark: {
            bg: 'bg-indigo-800',
            text: 'text-indigo-50',
            border: 'border-indigo-600',
            hover: 'hover:bg-indigo-700'
        }
    },
    red: {
        light: {
            bg: 'bg-red-100',
            text: 'text-red-900',
            border: 'border-red-300',
            hover: 'hover:bg-red-200'
        },
        dark: {
            bg: 'bg-red-800',
            text: 'text-red-50',
            border: 'border-red-600',
            hover: 'hover:bg-red-700'
        }
    }
};

// Animasyon tanımlamaları
export const animations = {
    // Temel animasyonlar
    fadeIn: {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.2 }
    },
    slideUp: {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
        transition: { duration: 0.2 }
    },
    scale: {
        initial: { scale: 0.95, opacity: 0 },
        animate: { scale: 1, opacity: 1 },
        exit: { scale: 0.95, opacity: 0 },
        transition: { duration: 0.2 }
    },
    
    // Özel animasyonlar
    glow: {
        keyframes: {
            '0%': { boxShadow: '0 0 15px rgba(99,102,241,0.3)' },
            '50%': { boxShadow: '0 0 25px rgba(99,102,241,0.5)' },
            '100%': { boxShadow: '0 0 15px rgba(99,102,241,0.3)' }
        },
        duration: '2s',
        timing: 'ease-in-out',
        iteration: 'infinite'
    },
    shine: {
        keyframes: {
            '0%': { transform: 'translateX(-100%)' },
            '100%': { transform: 'translateX(100%)' }
        },
        duration: '2s',
        timing: 'linear',
        iteration: 'infinite',
        styles: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '200% 100%'
        }
    },
    float: {
        keyframes: {
            '0%, 100%': { transform: 'translateY(0)' },
            '50%': { transform: 'translateY(-5px)' }
        },
        duration: '3s',
        timing: 'ease-in-out',
        iteration: 'infinite'
    }
};

// Ortak stil tanımlamaları
export const commonStyles = {
    // Buton stilleri
    button: {
        base: `relative group px-4 py-2 rounded-xl transition-all duration-200`,
        primary: (isDark) => `
            bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
            text-white 
            hover:shadow-lg ${isDark ? 'hover:shadow-indigo-500/20' : 'hover:shadow-indigo-500/30'}
            active:scale-95
        `,
        secondary: (isDark) => `
            ${isDark ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-700'} 
            border ${isDark ? 'border-gray-700' : 'border-gray-200'}
            hover:bg-opacity-90
        `,
        danger: (isDark) => `
            bg-gradient-to-r from-red-500 to-pink-500 
            text-white 
            hover:shadow-lg ${isDark ? 'hover:shadow-red-500/20' : 'hover:shadow-red-500/30'}
            active:scale-95
        `
    },

    // Input stilleri
    input: {
        base: (isDark) => `
            w-full px-4 py-2.5 rounded-xl 
            transition-all duration-200
            focus:outline-none focus:ring-2
            ${isDark 
                ? 'bg-gray-800/50 text-gray-200 border-gray-700 focus:ring-indigo-500/30' 
                : 'bg-white text-gray-900 border-gray-200 focus:ring-indigo-500/50'}
        `
    },

    // Card stilleri
    card: {
        base: (isDark) => `
            rounded-xl border backdrop-blur-sm shadow-lg
            transition-all duration-200
            ${isDark 
                ? 'bg-gray-800/90 border-gray-700/50 hover:shadow-indigo-500/10' 
                : 'bg-white/90 border-gray-200/50 hover:shadow-indigo-500/20'}
        `,
        hover: (isDark) => `
            hover:shadow-lg
            ${isDark 
                ? 'hover:bg-gray-800/70 hover:border-gray-600/50' 
                : 'hover:bg-white hover:border-gray-300/50'}
        `
    },

    // Glow efektleri
    gradients: {
        primary: 'bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500',
        secondary: 'bg-gradient-to-r from-indigo-500 to-purple-500',
        danger: 'bg-gradient-to-r from-red-500 to-pink-500'
    },

    glow: {
        sm: `shadow-[0_0_15px_rgba(99,102,241,0.3)]`,
        md: `shadow-[0_0_25px_rgba(99,102,241,0.4)]`,
        lg: `shadow-[0_0_35px_rgba(99,102,241,0.5)]`
    },

    // Todo kartı stilleri
    todoCard: {
        status: (status, isDark) => ({
            pending: isDark 
                ? 'bg-yellow-800 text-yellow-50 border-yellow-600'
                : 'bg-yellow-50 text-yellow-900 border-yellow-400',
            in_progress: isDark
                ? 'bg-blue-800 text-blue-50 border-blue-600'
                : 'bg-blue-50 text-blue-900 border-blue-400',
            completed: isDark
                ? 'bg-green-800 text-green-50 border-green-600'
                : 'bg-green-50 text-green-900 border-green-400'
        })[status],

        priority: (priority, isDark) => ({
            low: isDark
                ? 'bg-green-800 text-green-50 border-green-600'
                : 'bg-green-50 text-green-900 border-green-400',
            medium: isDark
                ? 'bg-orange-800 text-orange-50 border-orange-600'
                : 'bg-orange-50 text-orange-900 border-orange-400',
            high: isDark
                ? 'bg-red-800 text-red-50 border-red-600'
                : 'bg-red-50 text-red-900 border-red-400'
        })[priority],

        category: (isDark) => `
            inline-flex items-center gap-1.5 
            px-3 py-1.5
            rounded-full 
            text-xs font-semibold
            transition-colors duration-200
            relative overflow-hidden
            ${isDark 
                ? 'bg-indigo-800 text-white border border-indigo-600'
                : 'bg-indigo-100 text-indigo-900 border border-indigo-300'}
        `,

        markdown: {
            p: (isDark) => `text-sm ${isDark ? 'text-gray-100' : 'text-gray-900'}`,
            a: (isDark) => `${isDark ? 'text-indigo-300 hover:text-indigo-200' : 'text-indigo-700 hover:text-indigo-800'} transition-colors`,
            heading: (isDark) => `${isDark ? 'text-gray-50' : 'text-gray-900'}`,
            code: (isDark) => `px-1.5 py-0.5 rounded-md text-sm ${isDark ? 'bg-gray-800 text-gray-100' : 'bg-gray-100 text-gray-900'}`,
            blockquote: (isDark) => `border-l-4 pl-4 my-3 ${isDark ? 'border-gray-600 text-gray-300' : 'border-gray-300 text-gray-700'}`
        }
    }
}; 