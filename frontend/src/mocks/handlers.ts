import { http, HttpResponse } from 'msw'
 
export const handlers = [
  http.post('/api/v1/auth/signup', (req) => {
    return HttpResponse.json({
      message: '회원가입이 완료되었습니다.'
    });
  }),
]