
### 1. form 태그의 action 속성

<br>

  `<form>` 태그의 action 속성은 form data를 서버로 보낼 때, 해당 데이터가 도착할 URL을 명시함.
  
* 문법
  <br>
  
  - `<form action = "URL">`
  - URL은 form data를 서버로 보낼 때, 해당 데이터가 도착할 URL

* 설명
  <br>
  
  ![screenshot1](/설명/이미지/0803-1.PNG)
  
  <br>
  
  위의 스크린샷을 보면 form action = "/dashboard" 라고 되어있다. 이는 
  dashboard 페이지로 이동한다는 것을 의미한다. 
  "/dashboard"에 넘겨주는 값은 종목 코드인 "${symbol}" 이다.
  
  <br>
  
  ![screenshot2](/설명/이미지/0803-2.PNG)
  
  <br>
  
  이전 페이지로부터 넘겨받은 데이터 symbol을 {{ result['symbol'] }}로 사용한다.
