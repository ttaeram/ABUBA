
스프링MVC의 구조

### DispatcherServlet

프론트 컨트롤러의 역할을 수행한다. HttpServlet을 상속받는다. 

스프링 부트는 Dispatcherservlet을 자동으로 득록하면서 모든경로(urlPatterns=”/”)을 매핑한다.

### 스프링MVC의 동작순서

1. 핸들러 조회: 핸들러 매핑을 통해 URL에 매핑된 핸들러(컨트롤러)를 조회한다.
2. 핸들러 어댑터 조회: 핸들러를 실행할 수 있는 핸들러 어댑터를 조회한다.
3. 핸들러 어댑터 실행: 핸들러 어댑터를 실행한다.
4. 핸들러 실행: 핸들러 어댑터가 핸들러를 실행한다.
5. ModelAndView반환 : 핸들러 어댑터는 핸들러가 반환하는 정보를 ModelAndView로 변환해서 반환한다.
6. viewResolver호출: 뷰 리졸버를 찾고 실행한다.
    - JSP의 경우: InternalResourceViewResolver가 자동 등록되고, 사용된다.
7. View반환 : 뷰 리졸버는 뷰의 논리 이름을 물리 이름으로 바꾸고, 렌더링 역할을 담당하는 뷰 객체를 반환한다.
    - JSP의 경우 InternalResourceView(JstlView)를 반환하는데, 내부에 forward()로직이 있다.
8. 뷰 렌더링:  뷰를 통해서 뷰를 렌더링 한다.

## 핸들러 매핑과 핸들러 어댑터

### 스프링 부트가 자동 등록하는 핸들러 매핑과, 핸들러 어댑터

**HandlerMapping**

- RequestMappinghandlerMapping:
 애노테이션 기반 컨트롤러인 @RequestMapping에서 사용한다.
- BeanNameUrlHandlerMapping :
 스프링 빈의 이름으로 핸들러를 매핑한다.

**HandlerAdapter**

- RequestMappingHandleradapter 
애노테이션 기반의 컨트롤러인 @RequestMapping에서 사용한다.
- HttpRequestHandlerAdapter
HttpRequestHandler처리
- SimpleControllerHandlerAdapter
    
    Controller 인터페이스(애노테이션x,)  

HandlerMapping 을 순서대로 실행해서, 핸들러를 찾는다. 빈 이름으로 핸들러를 찾아야 하기 때문에 이름 그대로 빈 이름으로 핸들러를 찾아주는BeanNameUrlHandlerMapping 가 실행에 성공하고 핸들러인 OldController 를 반환한다.

SimpleControllerHandlerAdapter 가 Controller 인터페이스를 지원하므로 대상이 된다

## 뷰 리졸버

스프링 부트는 InternalResourceViewResolver 라는 뷰 리졸버를 자동으로 등록한다. application.properties 에 등록한 spring.mvc.view.prefix , spring.mvc.view.suffix 설정 정보를 사용해서 등록한다.

---

### RequestMappingHandlerMapping은 본인이 처리할 수 있는 요청인지 어떻게 확인할까?

클래스 레벨에 @Controller, @RequestMapping 애노테이션이 있어야한다. 

### Controller

url의 상위 디렉토리가 같은 경우, 공통되는 부분을 한번에 처리할 수 있는 방식으로 controller를 구성하였다.

- 코드
    
    ```java
    package hello.servlet.web.springmvc.v2;
    
    import hello.servlet.domain.member.Member;
    import hello.servlet.domain.member.MemberRepository;
    import org.springframework.stereotype.Controller;
    import org.springframework.web.bind.annotation.RequestMapping;
    import org.springframework.web.servlet.ModelAndView;
    
    import javax.servlet.http.HttpServletRequest;
    import javax.servlet.http.HttpServletResponse;
    import java.util.List;
    
    @Controller
    @RequestMapping("/springmvc/v2/members")
    public class SpringMemberControllerV2 {
        private MemberRepository memberRepository = MemberRepository.getInstance();
    
        @RequestMapping("/new-form")
        public ModelAndView newForm(){
            return new ModelAndView("new-form");
        }
    
        @RequestMapping("/save")
        public ModelAndView save(HttpServletRequest request, HttpServletResponse response) {
            String username = request.getParameter("username");
            int age = Integer.parseInt(request.getParameter("age"));
    
            Member member = new Member(username, age);
            memberRepository.save(member);
    
            ModelAndView mv = new ModelAndView("save-result");
            mv.addObject("member",member);
            return mv;
        }
    
        @RequestMapping()
        public ModelAndView members() {
            List<Member> members = memberRepository.findAll();
            ModelAndView mv = new ModelAndView("members");
            mv.addObject("members",members);
            return mv;
        }
    }
    ```
    


### return을 String으로?

view를 반환하기 위해서 ModelAndView를 return 타입으로 했었지만, String으로 지정하면 스프링 부트가 알아서 ModelAndView타입으로 반환하는 것과 같은 역할을 수행하게 한다.

→ 단순히 String으로 반환하는 방식도 존재한다.

### 응답 메소드형태 제한하기

- 코드
    
    ```java
    package hello.servlet.web.springmvc.v3;
    
    import hello.servlet.domain.member.Member;
    import hello.servlet.domain.member.MemberRepository;
    import org.springframework.stereotype.Controller;
    import org.springframework.ui.Model;
    import org.springframework.web.bind.annotation.*;
    
    import java.util.List;
    
    @Controller
    @RequestMapping("/springmvc/v3/members")
    public class SpringMemberControllerV3 {
        private MemberRepository memberRepository = MemberRepository.getInstance();
    
    //    @RequestMapping(value = "/new-form", method = RequestMethod.GET)
        @GetMapping("/new-form")
        public String newForm(){
            return "new-form";
        }
    
    //    @RequestMapping(value="/save", method=RequestMethod.POST)
        @PostMapping("/save")
        public String save(@RequestParam("username") String username,
                                 @RequestParam("age") int age,
                                 Model model) {
    
            Member member = new Member(username, age);
            memberRepository.save(member);
    
            model.addAttribute("member",member);
            return "save-result";
        }
    
    //    @RequestMapping(method = RequestMethod.GET)
        @GetMapping()
        public String members(Model model) {
            List<Member> members = memberRepository.findAll();
    
            model.addAttribute("members",members);
    
            return "members";
        }
    }
    ```
    
@PostMapping애노테이션 → Post메소드 요청만 허용한다.

💡@RequestParam
스프링은 HTTP 요청 파라미터를 @RequestParam 으로 받을 수 있다.@RequestParam("username") 은 request.getParameter("username") 와 거의 같은 코드라생각하면 된다 .물론 GET 쿼리 파라미터, POST Form 방식을 모두 지원한다

💡Model

Model을 파라미터로 받을 수 있다!.