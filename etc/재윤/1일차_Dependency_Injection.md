프로젝트 및 테스트를 진행하며 @Autowired 하나만 써도 정말 편하게 사용할 수 있던지라 신경쓰지 않고 사용했는데, 어느 순간부터 필드 주입을 권장하지 않는다는 구문이 뜬다는 것이었습니다.

![](https://velog.velcdn.com/images/joajy/post/2b2557a1-beb1-4ca1-b8d0-33a5edb7312e/image.png)
<br>
 ![](https://velog.velcdn.com/images/joajy/post/a6ef548d-ea0d-4e08-b197-bf1b276ea339/image.png)

>1. 필드 주입(setter 주입도)은 객체 생성시점에 순환 참조가 일어나는지 여부를 확인할 수 없습니다.

ex) new ServiceImpl(new BoardServiceImpl(new ServiceImpl(...)))

컨테이너가 빈을 생성하는 시점에서 객체 생성 중 사이클이 발생되는 문제가 발생하면 실제 코드 동작 중 문제가 발생할 수 밖에 없습니다.

>2. 편리하지만, 외부에서 수정이 어려운 이유로 테스트 코드 작성 시 객체를 수정할 수 없습니다.

테스트 코드를 작성할 때 객체를 수정해서 원하는 결과를 도출해야 하는데, 이를 테스트할 수 없다면 실제 코드가 어떻게 동작하는지 미리 확인하기 어려운 점이 있습니다.
(다만 Board board = new board(); 같이 주입 관련 어노테이션 없이 하면 임시방편 정도는 될 수도..? 있겠네요)

등등 여러 이유가 있지만 우선 다음의 두 이유와 권장하지 않는다는데 굳이 쓸 이유도 없겠다, 해당 코드 및 위와 같은 방식으로 Autowired 어노테이션을 가지는 코드를 다음과 같이 수정하였습니다.
![](https://velog.velcdn.com/images/joajy/post/a5018a42-66ca-4789-a912-36bd47c817aa/image.png)
