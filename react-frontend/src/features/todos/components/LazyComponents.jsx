import React, { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';

// Skeleton components for lazy loading
const CardSkeleton = () => (
    <div className="animate-pulse space-y-4">
        <div className="h-24 bg-gray-700 rounded"></div>
        <div className="space-y-3">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
        </div>
    </div>
);

const CalendarSkeleton = () => (
    <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-700 rounded w-full"></div>
        <div className="grid grid-cols-7 gap-2">
            {[...Array(35)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-700 rounded"></div>
            ))}
        </div>
    </div>
);

// Lazy loaded components
const TodoCard = lazy(() => import('./TodoCard'));
const TodoForm = lazy(() => import('./forms/BaseTodoForm'));
const TodoCalendar = lazy(() => import('./TodoCalendar'));

// Error boundary component
class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            errorCount: 0,
            lastErrorTime: null
        };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Hata sayısını ve zamanını güncelle
        this.setState(prevState => ({
            error,
            errorInfo,
            errorCount: prevState.errorCount + 1,
            lastErrorTime: new Date().toISOString()
        }));

        // Hata loglaması
        console.error('Error Boundary caught an error:', {
            error,
            errorInfo,
            component: this.props.componentName || 'Unknown Component',
            timestamp: new Date().toISOString()
        });

        // Opsiyonel: Hata raporlama servisine gönder
        if (this.props.onError) {
            this.props.onError(error, errorInfo);
        }
    }

    handleRetry = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        });
    };

    handleReload = () => {
        window.location.reload();
    };

    render() {
        const { hasError, error, errorCount, lastErrorTime } = this.state;
        const { fallback, children } = this.props;

        if (hasError) {
            // Özel fallback komponenti varsa onu kullan
            if (fallback) {
                return fallback(error);
            }

            // Varsayılan hata UI'ı
            return (
                <div className="p-6 rounded-lg border bg-red-50 dark:bg-red-900/20">
                    <div className="flex items-center gap-3 mb-4">
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-6 w-6 text-red-500" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" 
                            />
                        </svg>
                        <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">
                            Bir Hata Oluştu
                        </h2>
                    </div>

                    <div className="space-y-3 mb-4 text-sm">
                        <p className="text-gray-700 dark:text-gray-300">
                            {error?.message || 'Beklenmeyen bir hata oluştu.'}
                        </p>
                        {errorCount > 1 && (
                            <p className="text-gray-600 dark:text-gray-400">
                                Bu hata son {errorCount} kez tekrarlandı.
                                {lastErrorTime && ` Son hata zamanı: ${new Date(lastErrorTime).toLocaleString()}`}
                            </p>
                        )}
                        <div className="text-gray-600 dark:text-gray-400">
                            <p>Yapabilecekleriniz:</p>
                            <ul className="list-disc list-inside mt-1 space-y-1">
                                <li>Sayfayı yenileyin</li>
                                <li>İnternet bağlantınızı kontrol edin</li>
                                <li>Daha sonra tekrar deneyin</li>
                                {this.props.supportEmail && (
                                    <li>
                                        Sorun devam ederse lütfen 
                                        <a 
                                            href={`mailto:${this.props.supportEmail}`}
                                            className="text-indigo-600 dark:text-indigo-400 hover:underline ml-1"
                                        >
                                            destek ekibimizle iletişime geçin
                                        </a>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={this.handleRetry}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
                        >
                            Tekrar Dene
                        </button>
                        <button
                            onClick={this.handleReload}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            Sayfayı Yenile
                        </button>
                    </div>
                </div>
            );
        }

        return children;
    }
}

export {
    TodoCard,
    TodoForm,
    TodoCalendar,
    CardSkeleton,
    CalendarSkeleton,
    ErrorBoundary
}; 