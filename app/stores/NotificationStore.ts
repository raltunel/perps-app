import { create } from "zustand";

type notificationType = 'spinner'|'check';

interface notificationMetaIF {
    title: string;
    messages: string[],
    icon: notificationType;
}

const notificationMeta: notificationMetaIF[] = [
    {
        title: 'Leverage Mode Changed',
        messages: [
            'Switched to Isolated Margin Mode',
        ],
        icon: 'check',
    },
    {
        title: 'Sub Account Created',
        messages: [
            'Sub Account 1 Created'
        ],
        icon: 'check',
    },
    {
        title: 'Leverage Amount Changed',
        messages: [
            'Switched to 100x Leverage',
        ],
        icon: 'check',
    },
    {
        title: 'Order Pending',
        messages: [
            'Order 0.0001 ETH at $2,300',
        ],
        icon: 'spinner',
    },
    {
        title: 'Order Confirmed',
        messages: [
            'Order 0.0001 ETH at $2,300',
        ],
        icon: 'check',
    },
    {
        title: 'Deposit Pending',
        messages: [
            'Deposit 69,000 USDC',
            'Deposit 420,000 USDC',
        ],
        icon: 'spinner',
    },
    {
        title: 'Deposit Confirmed',
        messages: [
            'Deposit 69,000 USDC',
            'Deposit 420,000 USDC',
        ],
        icon: 'check',
    },
    {
        title: 'Withdraw Pending',
        messages: [
            'Withdraw 69,000 USDC',
            'Withdraw 420,000 USDC',
        ],
        icon: 'spinner',
    },
    {
        title: 'Withdraw Confirmed',
        messages: [
            'Withdraw 69,000 USDC',
            'Withdraw 420,000 USDC',
        ],
        icon: 'check',
    },
    {
        title: 'Send Pending',
        messages: [
            'Send 69,000 USDC',
            'Send 420,000 USDC',
        ],
        icon: 'spinner',
    },
    {
        title: 'Send Confirmed',
        messages: [
            'Send 69,000 USDC',
            'Send 420,000 USDC',
        ],
        icon: 'check',
    },
];

export interface notificationIF {
    title: string;
    message: string;
    icon: notificationType;
    oid: number;
}

function makeOID(digits: number): number {
    const min = 10 ** (digits - 1);
    const max = 10 ** digits - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeNotificationData(): notificationIF {
    function getRandomElement<T>(a: Array<T>): T {
        const randomIndex = Math.floor(Math.random() * a.length);
        return a[randomIndex];
    }
    const meta = getRandomElement(notificationMeta);
    return ({
        title: meta.title,
        message: getRandomElement(meta.messages),
        icon: meta.icon,
        oid: makeOID(14),
    });
}

export interface NotificationStoreIF {
    notifications: notificationIF[];
    add: () => void;
    remove: (id: number) => void;
}

export const useNotificationStore = create<NotificationStoreIF>((set, get) => ({
    notifications: [],
    add: (): void => {
        const current: notificationIF[] = get().notifications;
        set({ notifications: [
                ...current.slice(current.length - 2),
                makeNotificationData()
            ] });
    },
    remove: (id: number): void => set({
        notifications: get().notifications.filter((n: notificationIF) => n.oid !== id)
    }),
}));