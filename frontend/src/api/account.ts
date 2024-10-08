import api from './index'; 

export const ChildAccountInfo = async () => {
    try{
        const response = await api.get('/api/v1/account/balance', {
            params: {
            isParent: false,
            },
        });
        return {
            account: response.data.account,
            accountBalance: response.data.accountBalance,
            bankName: response.data.bankName,
            } 
    }catch (error) {
        console.error('계좌 조회 중 오류가 발생했습니다.', error);
        throw error;
      }
};
