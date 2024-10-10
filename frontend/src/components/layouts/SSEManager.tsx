// SSEManager.tsx
import React, { useEffect } from 'react';
import { connect } from '../../api/sse';
import { useAuthStore } from '../../stores/authStore';

const SSEManager: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    let sseConnection: any = null;

    if (isAuthenticated) {
      sseConnection = connect((notifications) => {
        // 여기서 알림을 처리합니다.
        console.log('Received notifications:', notifications);
        // 필요하다면 별도의 알림 상태 관리 로직을 추가할 수 있습니다.
      });
    }

    return () => {
      if (sseConnection && sseConnection.close) {
        sseConnection.close();
      }
    };
  }, [isAuthenticated]);

  return null; // 이 컴포넌트는 UI를 렌더링하지 않습니다.
};

export default SSEManager;