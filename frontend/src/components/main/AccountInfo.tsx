import React from 'react'
import styled from 'styled-components';

type Props = {}

const AccountInfo = (props: Props) => {
  return (
    <Container>
        <TextInfo>
            <Name>
                [아이미래적금] 신한 주거래 통장
            </Name>
            <Name>
                110-432-363235
            </Name>
        </TextInfo>
        <Money>
            5,000,000 원
        </Money>
    </Container>
  )
}

export default AccountInfo

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
  background-color: #3B6EBA;
  color:white;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 15px;
  width: 100%;
  margin: 20px auto; 
`;


const TextInfo = styled.div` 
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 10px auto;
  justify-content: space-between;
`

const Name = styled.div`
  font-size:16px;

`

const Money = styled.div`
    display: flex;
    justify-content: right;
    text-align: right;
    font-size:px;

`