import { EventSourcePolyfill } from 'event-source-polyfill';
import { useNotificationStore } from '../stores/notificationStore';


export const connect = (setNotifications: React.Dispatch<React.SetStateAction<any[]>>) => {
    console.log('Connect function started');
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
        console.error('Access token is missing');
        return null;
    }

    console.log('API URL:', process.env.REACT_APP_API_URL);

    try {
        console.log('Before creating EventSource');
        const eventSource = new EventSourcePolyfill(
            `${process.env.REACT_APP_API_URL}/api/v1/alarm/subscribe`,
            {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                },
                heartbeatTimeout: 60000,
            }
        );
        console.log('EventSource created:', eventSource);

        const { setHasNewNotification } = useNotificationStore.getState();
        
        eventSource.onopen = (event: Event) => {
            console.log('SSE connection opened', event);
        };

        eventSource.onmessage = (event: MessageEvent) => {
            console.log('onmessage handler triggered');
            console.log('Raw event in onmessage:', event);
            
            const eventType = event.type;
            const data = event.data;
            
            console.log('Event type:', eventType);
            console.log('Event data:', data);

            if (eventType === 'connect') {
                console.log('Connected:', data);
            } else if (eventType === 'notification') {
                try {
                    const parsedData = JSON.parse(data);
                    console.log('Parsed notification:', parsedData);
                    if (parsedData.isAlarm === "true") {
                        console.log("New alarm received");
                        setHasNewNotification(true);
                    }
                    if (parsedData.alarms && Array.isArray(parsedData.alarms)) {
                        setNotifications((prev) => {
                            console.log('Previous notifications:', prev);
                            const updated = [...prev, ...parsedData.alarms];
                            console.log('Updated notifications:', updated);
                            return updated;
                        });
                    }
                } catch (error) {
                    console.error('Error parsing notification data:', error);
                }
            } else if (eventType === 'heartbeat') {
                console.log('Heartbeat received');
            }
        };

        eventSource.onerror = (error: Event) => {
            console.error('SSE Error:', error);
            eventSource.close();

            setTimeout(() => {
                console.log('Attempting to reconnect...');
                connect(setNotifications);
            }, 3000);
        };

        // Additional event listeners with type assertion
        (eventSource as any).addEventListener('connect', (event: Event) => {
            console.log('Connect event:', event);
        });

        (eventSource as any).addEventListener('notification', (event: MessageEvent) => {

            console.log('Notification event:', event);
            // Additional notification handling logic can be added here
            setHasNewNotification(true);
            console.log("true로 바꿔라");
        });

        (eventSource as any).addEventListener('heartbeat', (event: MessageEvent) => {
            console.log('Heartbeat event:', event);
        });

        return eventSource;
    } catch (error) {
        console.error('Error creating EventSource:', error);
        return null;
    }
};