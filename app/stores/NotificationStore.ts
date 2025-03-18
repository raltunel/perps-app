import { create } from "zustand";

type icons = 'spinner'|'check';

interface notificationMetaIF {
    title: string;
    messages: string[],
    icon: icons;
}

const nm: { [x: string]: notificationMetaIF } = {
    leverageModeChanged: {
        title: 'Leverage Mode Changed',
        messages: [
            'Switched to Isolated Margin Mode',
        ],
        icon: 'check',
    },
    subAccountCreated: {
        title: 'Sub Account Created',
        messages: [
            'Sub Account 1 Created'
        ],
        icon: 'check',
    },
    leverageAmountChanged: {
        title: 'Leverage Amount Changed',
        messages: [
            'Switched to 100x Leverage',
        ],
        icon: 'check',
    },
    orderPending: {
        title: 'Order Pending',
        messages: [
            'Order 0.0001 ETH at $2,300',
        ],
        icon: 'spinner',
    },
    orderConfirmed: {
        title: 'Order Confirmed',
        messages: [
            'Order 0.0001 ETH at $2,300',
        ],
        icon: 'check',
    },
    depositPending: {
        title: 'Deposit Pending',
        messages: [
            'Deposit 69,000 USDC',
            'Deposit 420,000 USDC',
        ],
        icon: 'spinner',
    },
    depositConfirmed: {
        title: 'Deposit Confirmed',
        messages: [
            'Deposit 69,000 USDC',
            'Deposit 420,000 USDC',
        ],
        icon: 'check',
    },
    withdrawPending: {
        title: 'Withdraw Pending',
        messages: [
            'Withdraw 69,000 USDC',
            'Withdraw 420,000 USDC',
        ],
        icon: 'spinner',
    },
    withdrawConfirmed: {
        title: 'Withdraw Confirmed',
        messages: [
            'Withdraw 69,000 USDC',
            'Withdraw 420,000 USDC',
        ],
        icon: 'check',
    },
    sendPending: {
        title: 'Send Pending',
        messages: [
            'Send 69,000 USDC',
            'Send 420,000 USDC',
        ],
        icon: 'spinner',
    },
    sendConfirmed: {
        title: 'Send Confirmed',
        messages: [
            'Send 69,000 USDC',
            'Send 420,000 USDC',
        ],
        icon: 'check',
    },
}

type notificationSlugs = keyof typeof nm;

export interface notificationIF {
    title: string;
    message: string;
    icon: icons;
    oid: number;
}

function makeOID(digits: number): number {
    const min = 10 ** (digits - 1);
    const max = 10 ** digits - 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function makeNotificationData(slug?: notificationSlugs): notificationIF {
    function getRandomElement<T>(a: Array<T>): T {
        const randomIndex: number = Math.floor(Math.random() * a.length);
        return a[randomIndex];
    }
    const meta: notificationMetaIF = slug
        ? nm[slug]
        : getRandomElement(Object.values(nm));
    return ({
        title: meta.title,
        message: getRandomElement(meta.messages),
        icon: meta.icon,
        oid: makeOID(14),
    });
}

export interface NotificationStoreIF {
    notifications: notificationIF[];
    add: (s?: notificationSlugs) => void;
    remove: (id: number) => void;
}

export const useNotificationStore = create<NotificationStoreIF>((set, get) => ({
    notifications: [],
    add: (s?: notificationSlugs): void => {
        const current: notificationIF[] = get().notifications;
        set({ notifications: [
                ...current.slice(current.length - 2),
                makeNotificationData(s)
            ] });
    },
    remove: (id: number): void => set({
        notifications: get().notifications.filter((n: notificationIF) => n.oid !== id)
    }),
}));