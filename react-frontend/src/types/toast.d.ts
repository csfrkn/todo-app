declare type ToastType = 'success' | 'error' | 'warning' | 'info';

declare interface ToastContextValue {
    addToast: (message: string, type?: ToastType, duration?: number) => void;
    removeToast: (id: number) => void;
}

declare interface Toast {
    id: number;
    message: string;
    type: ToastType;
}

declare interface ToastProviderProps {
    children: React.ReactNode;
} 