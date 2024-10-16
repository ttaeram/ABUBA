# 👶 ABUBA - 육아 다이어리형 금융 서비스
![Thumbnail](..%2F..%2F..%2F..%2FDownloads%2FABUBA_THUMBNAIL.JPG)

💡 ABUBA는 어떤 서비스인가요?
---
아이의 성장을 더 특별하게 기록하고 싶나요? 그렇다면 **ABUBA**를 소개합니다!

**ABUBA**는 육아와 금융을 결합한 새로운 서비스입니다. 부모님이 아이의 일상을 육아 일기로 기록하는 동시에, 아이의 미래를 위한 저축을 관리할 수 있습니다. 아이의 첫 미소, 첫 걸음, 첫 마디, 그 모든 소중한 순간을 간직하면서 미래를 위한 준비도 함께 할 수 있어요.

부모님은 아이의 사진과 음성 기록을 남길 수 있고, AI가 감정 분석을 통해 일기를 더욱 생동감 있게 정리해 줍니다. 뿐만 아니라, 아이의 계좌와 연동되어 저축 상황을 한눈에 확인하고, 목표 금액에 도달하면 특별한 기념일처럼 육아 기록을 모아 선물할 수도 있어요.

**ABUBA**와 함께라면, 아이의 성장과 함께하는 매일이 특별한 추억이 됩니다!

📆 프로젝트 기간
---
2024.08.19(월) ~ 2024.10.11(금)

🏃 팀원 소개
---
### Backend
| <img src="docs/devMembers/cjh.png"  width="150" height="150"/> | <img src="docs/devMembers/ldg.png"  width="150" height="150"/> | <img src="docs/devMembers/kjy.png"  width="150" height="150"/> |
|:--------------------------------------------------------------:|:--------------------------------------------------------------:|:--------------------------------------------------------------:|
|                              최재혁                               |                              이동규                               |                              김재윤                               |

### Frontend
| <img src="docs/devMembers/jsh.png"  width="150" height="150"/> | <img src="docs/devMembers/utr.png"  width="150" height="150"/> |
|:--------------------------------------------------------------:|:--------------------------------------------------------------:|
|                              정승훈                               |                              유태람                               |

### Infra
| <img src="docs/devMembers/kyp.png"  width="150" height="150"/> |
|:--------------------------------------------------------------:|
|                              김영표                               |

🛠️ 메인 기능
---
- ### 육아 일기 & 성장 기록
    - 아이의 소중한 순간들을 사진과 음성으로 기록할 수 있어요. 예를 들어, 아이가 처음으로 걷는 순간이나 첫 번째 생일을 일기로 남기고, 감정 달력으로 그 날의 기분을 시각화할 수 있어요
    - AI 감정 분석 기능을 통해 일기 작성자의 감정 상태를 분석하고 이모지로 표현하여, 육아 기록을 더 다양하게 간직할 수 있어요
    - 일기 기록을 바탕으로 성장 기록 차트가 자동으로 업데이트되어, 아이의 키, 몸무게 등 발달 상황을 한눈에 확인할 수 있어요
      <br/>
- ### 금융 서비스와 연동
    - 아이의 미래를 위한 저축을 간편하게 관리하세요. 부모님이 연동된 계좌로 아이의 저축 상황을 관리하고, 목표 저축 금액을 설정할 수 있어요
    - 일기 메모에 맞춰 입출금 내역을 자동으로 연결해 육아와 저축을 한 번에 관리하는 스마트한 방법을 제공합니다
      <br/>
- ### 맞춤형 육아 로드맵
    - 아이의 나이에 맞춰 개인화된 정보를 제공합니다. 각 성장 단계에 맞는 발달 정보, 정부 지원 혜택, 의료 정보 등을 쉽게 확인할 수 있어요
    - 아이의 성장에 맞춘 정보를 기반으로 필요한 육아 정보를 언제든지 받아볼 수 있어, 부모님의 육아 고민을 덜어줍니다
      <br/>
- ### 가족 간 공유와 소통
    - 가족 구성원들이 함께 작성한 일기를 공유하고, 서로의 기록을 확인하며 아이의 성장을 함께 축하할 수 있어요
    - 특정 가족 구성원이 기록한 일기가 게시되면, 실시간 알림을 통해 다른 가족들도 그 순간을 바로 확인할 수 있습니다
    - 작성된 일기는 다른 가족 구성원들도 볼 수 있어, 모두가 함께 아이의 성장을 축하하는 데 기여할 수 있어요
      <br/>

## 📜 주요 기술
---
**Backend Skills**
* IntelliJ IDEA Ultimate
* Springboot 3.3.3
* Spring Security & JWT
* Spring Data JPA
* Swagger 2.2.0
* MySQL
* Server-Sent Event(SSE)
* OpenFeign 4.1.3
* Google API

**Frontend Skills**
- Visual Studio Code
- React

**Infra Skills**
- AWS EC2 Lightsail
- AWS S3
- Jenkins
- Docker
- Nginx

## 📝 ERD Diagram
---
![ERD.JPG](docs%2FERD.JPG)

## 🎨 System Architecture
---
![img_2.png](docs/SystemArchitecture.png)

## 📁 프로젝트 파일 구조도
---
### Backend
```
backend
└───src
    ├───main
    │   ├───java
    │   │   └───com
    │   │       └───hexagon
    │   │           └───abuba
    │   │               ├───account
    │   │               │   ├───controller
    │   │               │   ├───dto
    │   │               │   │   ├───request
    │   │               │   │   └───response
    │   │               │   └───service
    │   │               ├───alarm
    │   │               │   ├───controller
    │   │               │   ├───entity
    │   │               │   ├───repository
    │   │               │   └───service
    │   │               ├───auth
    │   │               │   ├───config
    │   │               │   ├───controller
    │   │               │   ├───dto
    │   │               │   │   ├───request
    │   │               │   │   └───response
    │   │               │   ├───entity
    │   │               │   ├───jwt
    │   │               │   ├───repository
    │   │               │   └───service
    │   │               ├───common
    │   │               ├───diary
    │   │               │   ├───controller
    │   │               │   ├───dto
    │   │               │   │   ├───request
    │   │               │   │   └───response
    │   │               │   ├───entity
    │   │               │   ├───repository
    │   │               │   └───service
    │   │               ├───global
    │   │               │   ├───exception
    │   │               │   └───openfeign
    │   │               │       └───dto
    │   │               │           ├───request
    │   │               │           └───response
    │   │               ├───roadmap
    │   │               │   ├───controller
    │   │               │   ├───dto
    │   │               │   │   └───response
    │   │               │   ├───repository
    │   │               │   └───service
    │   │               ├───s3
    │   │               │   └───service
    │   │               └───user
    │   │                   ├───controller
    │   │                   ├───dto
    │   │                   │   ├───request
    │   │                   │   └───response
    │   │                   ├───repository
    │   │                   └───service
    │   └───resources
    │       └───templates
    └───test
        └───java
            └───com
                └───hexagon
                    └───abuba
```
### Frontend
```
frontend
└───src
    ├───api
    ├───assets
    │   ├───fonts
    │   └───images
    ├───components
    │   ├───account
    │   ├───buttons
    │   ├───calendar
    │   ├───deposit
    │   ├───graph
    │   ├───layouts
    │   ├───login
    │   ├───main
    │   ├───onboardinginfo
    │   ├───rodamap
    │   └───signup
    ├───config
    ├───mocks
    ├───pages
    │   ├───account
    │   ├───calendar
    │   ├───diary
    │   ├───graph
    │   └───roadmap
    ├───stores
    ├───styles
    ├───types
    └───utils

```


## 📠 협업 툴
---
- Gitlab
- Jira
- Notion
- MatterMost
- Discord
- Webex

## 🖥️ ABUBA 서비스 화면
---
- ### 회원 관리
    - #### 아이 정보 입력
    ![아이정보입력.png](..%2F..%2F..%2F..%2FDownloads%2F%EC%95%84%EC%9D%B4%EC%A0%95%EB%B3%B4%EC%9E%85%EB%A0%A5.png)
    - #### 부모 계좌 인증
    ![부모 계좌 인증.png](..%2F..%2F..%2F..%2FDownloads%2F%EB%B6%80%EB%AA%A8%20%EA%B3%84%EC%A2%8C%20%EC%9D%B8%EC%A6%9D.png)
    - #### 아이 계좌 인증
    ![아이 계좌 인증.png](..%2F..%2F..%2F..%2FDownloads%2F%EC%95%84%EC%9D%B4%20%EA%B3%84%EC%A2%8C%20%EC%9D%B8%EC%A6%9D.png)

- ### 메인 페이지
  - #### 시작 화면
   ![메인페이지.png](..%2F..%2F..%2F..%2FDownloads%2F%EB%A9%94%EC%9D%B8%ED%8E%98%EC%9D%B4%EC%A7%80.png)
 
- ### 육아 일기
    - #### 일기 작성
      ![일기장 작성.png](..%2F..%2F..%2F..%2FDownloads%2F%EC%9D%BC%EA%B8%B0%EC%9E%A5%20%EC%9E%91%EC%84%B1.png)
    - #### 일기장
      ![일기장.png](..%2F..%2F..%2F..%2FDownloads%2F%EC%9D%BC%EA%B8%B0%EC%9E%A5.png)
- ### 성장 기록 & 감정 달력
    - #### 성장 기록 차트
        ![성장 기록 차트.png](..%2F..%2F..%2F..%2FDownloads%2F%EC%84%B1%EC%9E%A5%20%EA%B8%B0%EB%A1%9D%20%EC%B0%A8%ED%8A%B8.png)
    - #### 감정 달력
      ![감정 달력.png](..%2F..%2F..%2F..%2FDownloads%2F%EA%B0%90%EC%A0%95%20%EB%8B%AC%EB%A0%A5.png)

- ### 계좌 상세 정보
    - #### 계좌 이체 내역 & 일기 메모 조회
    ![계좌 상세정보.png](..%2F..%2F..%2F..%2FDownloads%2F%EA%B3%84%EC%A2%8C%20%EC%83%81%EC%84%B8%EC%A0%95%EB%B3%B4.png)
