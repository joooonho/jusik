### 1. 예외 처리 추가

<br>

  - 다우/나스닥 지수를 가져오는데 실패하여 이를 수정함.
  
  <br>
  
  - 1) 원인
  
  - ![1](https://github.com/Yang-Joon-Ho/jusik/blob/master/%EC%84%A4%EB%AA%85/%EC%9D%B4%EB%AF%B8%EC%A7%80/1206%20flask%20%EC%98%A4%EB%A5%98%20%ED%91%9C%EC%8B%9C.PNG)
  
  <br>
  
  - 위의 이미지와 같이 "POST /index HTTP/1.1" 500" 오류가 발생하였고, 
  로그를 분석한 결과 주요 지수 데이터를 제공하는 "investing.com"에서 html 구조가
  바뀌는 바람에 데이터가 제대로 스크래핑이 되지 않는 문제였다.
  
  <br>
  <br>
  
  - 2) 해결
  - ![2](https://github.com/Yang-Joon-Ho/jusik/blob/master/%EC%84%A4%EB%AA%85/%EC%9D%B4%EB%AF%B8%EC%A7%80/1206%20flask%20%EC%BD%94%EB%93%9C.PNG)
  
  <br>
  
  - 따라서 위와 같이 서버 코드에서  해당 부분에 try/except를 추가하였다. 
  먼저, try 구문에 스크래핑 코드를 넣어주고 NonType 오류가 또 발생할 경우
  except 구문에서 가져오지 못한 값들에 대해서는 'null'이라고 표시를 하도록 했다.
  
<br>
<br>

### 2. AWS EC2 인스턴스가 실행되지 않는 문제 해결

<br>

  - AWS EC2 인스턴스에 접속할 수 없는 문제 발생
  
  <br>
  
  - 1) 원인
  
  - ![3](https://github.com/Yang-Joon-Ho/jusik/blob/master/%EC%84%A4%EB%AA%85/%EC%9D%B4%EB%AF%B8%EC%A7%80/1206%20%EC%9D%B8%EC%8A%A4%ED%84%B4%EC%8A%A4.PNG)
  
  <br>
  
  - 위의 인스턴스 창에서 상태검사가 1/2로 검사가 완료되지 않아 인스턴스에 접속할 수 없는 문제가
  있었다.
  
  <br>
  <br>
  
  - 2) 해결
  
  
  - ![4](https://github.com/Yang-Joon-Ho/jusik/blob/master/%EC%84%A4%EB%AA%85/%EC%9D%B4%EB%AF%B8%EC%A7%80/1206%EC%9D%B8%EC%8A%A4%ED%84%B4%EC%8A%A4%20%EC%83%81%ED%83%9C.PNG)
  
  <br>
  
  - 이 때 상태검사에서 인스턴스 상태 검사가 통과로 표시되어있지 않으며
  해결하기 위해서는 인스턴스 상태 보고말고 다른 버튼이 있는데 그걸 누르고,
  영어로 내 인스턴스 접속 안돼요하고 메세지 보내면 2초안에 해결된다. 
