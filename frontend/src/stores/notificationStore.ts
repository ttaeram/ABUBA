import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NotificationState {
    hasNewNotification: boolean;
    setHasNewNotification: (value: boolean) => void;
}

// 전역 상태를 생성
export const useNotificationStore = create<NotificationState>()(
    persist(
        (set) => ({
            hasNewNotification: false,
            setHasNewNotification: (value) => set({ hasNewNotification: value }),
        }),
        {
            name: 'notification-storage', // 스토리지에 저장되는 이름
        }
    )
);
