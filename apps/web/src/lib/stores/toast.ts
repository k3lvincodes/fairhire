import { writable } from 'svelte/store';

export type ToastType = 'info' | 'success' | 'warning' | 'error' | 'transaction';

export interface Toast {
    id: string;
    type: ToastType;
    title: string;
    message?: string;
    txSignature?: string;
    status?: 'sent' | 'confirmed' | 'finalized' | 'failed';
    duration?: number;
}

function createToastStore() {
    const { subscribe, update } = writable<Toast[]>([]);

    function add(toast: Omit<Toast, 'id'>) {
        const id = crypto.randomUUID();
        const newToast = { ...toast, id };

        update(toasts => [...toasts, newToast]);

        // Auto-remove after duration (default 5s)
        if (toast.type !== 'transaction') {
            setTimeout(() => remove(id), toast.duration || 5000);
        }

        return id;
    }

    function remove(id: string) {
        update(toasts => toasts.filter(t => t.id !== id));
    }

    function updateTransaction(id: string, status: Toast['status']) {
        update(toasts => toasts.map(t =>
            t.id === id ? { ...t, status } : t
        ));

        if (status === 'finalized' || status === 'failed') {
            setTimeout(() => remove(id), 3000);
        }
    }

    return {
        subscribe,
        add,
        remove,
        updateTransaction,
        success: (title: string, message?: string) => add({ type: 'success', title, message }),
        error: (title: string, message?: string) => add({ type: 'error', title, message }),
        info: (title: string, message?: string) => add({ type: 'info', title, message }),
        warning: (title: string, message?: string) => add({ type: 'warning', title, message }),
        transaction: (title: string, txSignature: string) => {
            const id = add({ type: 'transaction', title, txSignature, status: 'sent' });
            return {
                confirm: () => updateTransaction(id, 'confirmed'),
                finalize: () => updateTransaction(id, 'finalized'),
                fail: () => updateTransaction(id, 'failed')
            };
        }
    };
}

export const toasts = createToastStore();
