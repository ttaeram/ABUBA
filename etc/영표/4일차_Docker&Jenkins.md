### Docker

<aside>
💡 모든 Docker Container를 올릴 때 -p로 포트 설정, -v로 볼륨 설정 해줘야함.

</aside>

Docker는 어플리케이션을 컨테이너라는 가상 환경에서 독립적으로 실행될 수 있도록 해주는 가상화 기술이다.

그럼 가상 머신이랑 뭐가 다름? → 가상화 방식과 효율성 측면에서 차이가 있다. 가상 머신은 전체 운영체제를 포함한 독립적인 시스템을 가상화 하는 반면에 도커 컨테이너는 호스트의 운영체제의 커널을 공유하면서 어플리케이션과 종속성만을 가상화하여 가볍고 빠르게 실행가능하다.

하나의 도커 컨테이너에는 하나의 어플리케이션만 올리는 것이 국룰. 물론 하나의 컨테이너에 여러개로 묶어서 올릴 수도있다.

전체적인 동작 과정은 이렇다.


- Dockerfile
    
    도커 파일은 도커 이미지를 build하기 위해서 작성하는 명세서 같은 것이다. 
    
    어떤 외부 이미지를 쓸지, 컨테이너 안에서 뭘 할지, 포트는 어떤 걸 쓸지 이런 걸 적는다. 심지어 환경 변수 설정을 해줄 수 있어서 yaml파일이 없어도 빌드 배포 가능.

    
- Docker Volumn
    
    도커 볼륨은 local에서의 directory or file이 docker container에서도 있을 수 있게 binding해주는 것.
    
    local에서 바꾸나 docker container에서 바꾸나 binding된 파일이나 디렉토리는 다 바뀐다.
    
    예를 들자면 local에 ~/data 디렉토리를 컨테이너 안의 /var/data와 볼륨 설정을 해줬다면 컨테이너 내부로 들어가서 수정하지 않고 local ~/data 디렉토리를 수정하면 컨테이너 내부에도 수정이 된다.
    
- Docker-compose
    
    Docker compose는 여러 개의 컨테이너를 한번에 컨테이너로 만들어주는 기술.
    
    Docker network 설정을 하지 않아도 하나의 네트워크로 묶이기 때문에 만약 묶인 컨테이너들끼리 통신한다면 URL이 아닌 컨테이너 이름으로 해도 인식한다.
    
    인터넷 찾아보면 알겠지만, 옛날에는 docker-compose 이런 식으로 cli 명령어를 실행했는데, 요즘에는 docker compose 이렇게 작성한다. 변화는… 앞에 Service version 안 써줘도 되는 거? 

    
    Backend 부분을 보면 spring같은 경우에는 DB 서버가 먼저 떠야 서버가 작동한다.
    
    처음에는 그냥 depends on만 적었었는데, 저렇게 service가 healthy할 때만 spring 컨테이너를 올리도록 해야 spring 컨테이너가 내려가지 않고 한번에 올라간다. 뭔가 아무리 depend on이라고 해도 실제 실행하기 전에 spring 컨테이너가 올라가는 듯 하다.
    
    또한 저렇게 비밀번호 노출하지 말고 `MYSQL_ROOT_PASSWORD=${PASSWD}` . 이렇게 해줘야 안전하게 비밀번호를 관리할 수 있다.


### Jenkins

- Jenkins
    
    CI/CD를 구현하게 해주는 오픈소스.
    
    Job을 만들어서 어떤 조건에 그 Job을 실행하게 할 수 있음.
    
    이번 프로젝트에서는 하나의 Job에 pipeline을 모두 작성했지만, Job도 세분화해서 진행해야 할 것 같다. shell script로 여러개의 Job에 hierarchy를 설정해 줄 수 있다.
    
    하나의 pipeline에 다 넣다 보니 Backend 코드만 고쳤는데, Frontend도 빌드 배포 되는 참사가 일어난다. 프로젝트 규모가 작아서 다행이지 컸다면 참사 참사 대 참사.
    
- Job
    
    Job을 만들 때에 새로운 Item 생성으로 만든다.
    
    Pipeline으로 만들면 아래에 작성한 Pipeline을 작성해서 일의 순서를 정할 수 있다.
    
    근데 다른 사람들 보니까 Free style로 만들어서 UI를 이용해 간단하게 작성하더라… 다음에는 이렇게 해서 분리해봐야겠다.
    
- Pipeline
    파이프 라인은 Shell script로 작성된 일의 순서이다.
    stage로 각 파트를 나누어서 안에 Shell script를 작성 하는 것이 기본이다.
    
- 연결
    
    이번 프로젝트에서는 Jenkins를 호스트에 바로 실행시킨 것이 아니고 도커 컨테이너로 감싸서 실행했다.
    
    그래서 분리된 서버이며 다른 컨테이너나 다른 서버와 통신하려면 따로 설정을 해줘야한다. (같은 네트워크 안에 있으면 그냥 되는 듯 함, 네트워크 설정은 Docker Compose로 설정해줄 수 있다. → 테스트 안해봄)
    
    위에 Pipeline에서 git, ssh, nodejs는 jenkins plug-in을 따로 설치하여서 설정한 것이다.
    
    Gitlab, Github같은 remote repository를 설정하려면 Web hook을 설정해줘야 한다.
    
    위에 있는 문서에도 있고, 인터넷에서 찾아도 쉽게 따라할 수 있는 수준이다.