import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from '../../styles/styledComponents';
import { postBabyInfo } from '../../api/user';

interface Props {
  onNext: () => void;
};

const ChildInfoForm = ({ onNext }: Props) => {
  const [childName, setChildName] = useState('');
  const [relation, setRelation] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [birthDate, setBirthDate] = useState(new Date().toISOString().split('T')[0]);
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!childName || !relation || !height || !weight || !birthDate || !gender) {
      setError('모든 필드를 입력해주세요.');
      return;
    }
    
    const childinfo = {
      name: childName,
      relation,
      height: Number(height),
      weight: Number(weight),
      birthday: birthDate,
      gender,
    }

    try {

      await postBabyInfo(childinfo);
      onNext();
    } catch (err) {
      console.error('아동 정보 저장 중 오류 발생:', err);
      setError('아동 정보를 저장하는데 실패했습니다.');
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <InputContainer>
        <Label>아이 이름</Label>
        <Input
          type="text"
          value={childName}
          onChange={(e) => setChildName(e.target.value)}
        />

        <Label>아이와의 관계</Label>
        <RelationContainer>
          <RelationButton
            type="button"
            isSelected={relation === '엄마'}
            onClick={() => setRelation('엄마')}
          >
            엄마
          </RelationButton>
          <RelationButton
            type="button"
            isSelected={relation === '아빠'}
            onClick={() => setRelation('아빠')}
          >
            아빠
          </RelationButton>
        </RelationContainer>

        <PhysicalContainer>
          <PhysicalInputContainer>
            <Label>키 (cm)</Label>
            <PhysicalInput
              type="number"
              step="0.1"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
            />
          </PhysicalInputContainer>
          <PhysicalInputContainer>
            <Label>몸무게 (kg)</Label>
            <PhysicalInput
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
        
          </PhysicalInputContainer>
        </PhysicalContainer>
        <Label>생년월일</Label>
        <Input
          type="date"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
        />

        <Label>아이 성별</Label>
        <GenderContainer>
          <GenderButton
            type="button"
            isSelected={gender === '남자'}
            onClick={() => setGender('남자')}
          >
            남자
          </GenderButton>
          <GenderButton
            type="button"
            isSelected={gender === '여자'}
            onClick={() => setGender('여자')}
          >
            여자
          </GenderButton>
        </GenderContainer>


      </InputContainer>

      {error && <ErrorMessage>{error}</ErrorMessage>}
      <Button type="submit">다음</Button>
    </FormContainer>
  );
};

export default ChildInfoForm;

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  width: 80%;
  padding: 20px;
  border-radius: 8px;
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
`;

const Label = styled.label`
  margin-bottom: 10px;
`;

const Input = styled.input`
  padding: 15px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const RelationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const RelationButton = styled.button<{ isSelected: boolean }>`
  width: 48%;
  padding: 15px;
  background-color: ${({ isSelected }) => (isSelected ? '#3B6EBA' : '#f0f0f0')};
  border: 1px solid #ccc;
  border-radius: 8px;
  color: ${({ isSelected }) => (isSelected ? 'white' : 'black')};
  cursor: pointer;

`;

const GenderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
`;

const GenderButton = styled.button<{ isSelected: boolean }>`
  width: 48%;
  padding: 15px;
  background-color: ${({ isSelected }) => (isSelected ? '#3B6EBA' : '#f0f0f0')};
  border: 1px solid #ccc;
  border-radius: 8px;
  color: ${({ isSelected }) => (isSelected ? 'white' : 'black')};
  cursor: pointer;
`;


const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 15px;
`;


const PhysicalContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
  width: 100%;
`;

const PhysicalInputContainer = styled.div`
  flex: 1;
  margin-right: 10px;

  &:last-child {
    margin-right: 0; 
  }
`;

const PhysicalInput = styled.input`
  padding: 15px;
  margin-top: 10px;
  margin-bottom: 5px; 
  border: 1px solid #ccc;
  border-radius: 8px;
  text-align: right; 
  width: 100%; 
`;