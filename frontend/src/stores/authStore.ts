import {create} from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  email: string;
  name: string;
  setEmailAndName: (email: string, name: string) => void;
}

interface ChildAuthState{
  childname: string;
  relation: string;
  height: number;
  weight: number;
  birthdate: string;
  gender: string;
  setChildInfo: (child: string, relation: string, height: number, weight: number, birthdate: string, gender: string) => void;
}


//가입자(부모님) 이메일, 이름
export const useAuthStore = create<AuthState>((set) => ({
  email: '',
  name: '',
  setEmailAndName: (email, name) => set({ email, name }),
}));


//아이 이름, 부모와의 관계, 키, 몸무게, 생년월일, 성별 초기
export const useChildAuthStore = create<ChildAuthState>()(
  persist(
    (set) => ({
      childname: '',
      relation: '',
      height: 0,
      weight: 0,
      birthdate: '',
      gender: '',
      setChildInfo: (childname, relation, height, weight, birthdate, gender) => 
        set({ childname, relation, height, weight, birthdate, gender }),
    }),
    {
      name: 'child-auth-storage',
    }
  )
);
