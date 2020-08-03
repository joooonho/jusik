# jusik
주식 모의 투자 웹서비스

<h1>주식 웹서비스</h1>

<h2><li>서비스 개요</li></h2> 

<h4>1. 서비스 소개</h4>

서비스의 이름은 ‘주식 모의 투자 서비스’입니다. 평소에 주식투자를 즐겨 해왔는데, 모의 투자의 필요성을 느끼고 직접 만들게 되었습니다.

<h4>2. 서비스의 기능</h4>

1) 메인 페이지 :
메인 페이지에는 ‘인베스팅닷컴’이라는 증권 사이트에서 가장 인기있는 기사가 스크랩 되어 띄워져 있습니다. 기사 아래에는 종목 검색 창이 있고, 미국 주식에 한해서만 검색이 가능합니다.
검색 창에서 종목을 검색하고, 해당 종목을 클릭하면 우측 하단에 회사에 대한 간략한 개요와 주가와 같은 정보가 나옵니다. 여기서 관심 종목 추가하기 버튼을 눌러 주식을 찜할 수 있습니다.
2) 관심 종목 페이지 :
메인 페이지에서 관심종목에 추가한 주식들을 종합해서 볼 수 있는 공간입니다. 각 주식에는 ‘보기’와 ‘삭제’ 버튼이 있으며 ‘삭제’ 버튼을 누르면 해당 주식은 관심종목에서 사라집니다.
3) 종목 자세히 보기 페이지 :
관심 종목 페이지에서 주식에 대한 ‘보기’ 버튼을 누르면 해당 페이지로 이동합니다. 여기서는 해당 주식의 과거 가격 데이터들을 볼 수 있으며 모의 ‘매수’, ‘매도’가 가능한 공간입니다.
본인이 지금까지 이 주식을 얼마나 보유했었으며 얼만큼의 이익을 실현했는지 등에 대한 정보를 볼 수 있습니다.
4) 로그인 기능 :
회원 정보를 기입하여 회원가입을 하고 로그인을 할 수 있다. 로그인을 해야 관심 종목, 관심 기사 열람 기능을 사용할 수 있습니다. 
5) 관심 기사 페이지 :
관심 기사 URL을 추가하여 관심기사들을 모아 볼 수 있는 페이지입니다. 

<h4>3. 서비스에 사용된 기술</h4>

프론트엔드는 Javascript, JQuery로 구현을 하였고, 서버는 python — flask, DB는 mongoDB, 프론트엔드와 서버 사이의 통신은 ajax로 구현하였습니다.
request로 신문 기사, 주가 정보를 스크랩하여 beatifulsoup으로 가공하고 가공한 데이터를 프론트 엔드에 나타내는 식의 모듈이 주를 이루었습니다.
즉, CRUD에 따른 설계로 서비스를 구현하였습니다.

<h4>4. 서비스를 구현하면서 겪은 어려움</h4>

1) 주가 데이터를 가져오기 적당한 곳을 찾는데부터 어려움을 겪었습니다. 처음에는 ‘iex cloud’ 라는 주식 api 무료 제공 서비스에서 api 통신을 통해 주가 데이터를 끌어오려 했으나 사실 완전 무료는 아니고 접근 횟수 제한이 있어 ‘야후 파이낸스’, ‘인베스팅 닷컴’에서 스크랩을 하는것으로 선회하였습니다. 내게 필요한 api 명령어를 찾기 위해 꽤 시간을 투자했는데 아쉽게도 무용지물이 된 경험이었습니다.
2) 다른 페이지로 이동하면서 데이터를 전송해주는 것을 구현하는 데 어려움을 겪었으나 [form - action](/설명/form-action.md)을 통해 해결하였습니다.
3) 서버와의 통신 속도가 너무 느려 이를 개선하였는데, 프로그램에서 보통 함수의 실행 흐름과 $ajax의 실행 흐름의 차이를 잘 이해하게되는 계기가 되었습니다.


<h2><li>파일 구조 설명</li></h2>

<h4>1. app.py</h4>

flask 서버를 구동하여 mongo DB와 클라이언트와 통신 하는 곳.

<h4>2. /templates/</h4>

1) articles.html : 관심 기사들을 보여주는 페이지 
2) dashboard.html : 주식 종목의 차트를 보여주고, 모의 매수 매도가 가능한 페이지
3) index.html : 메인 페이지로서 인베스팅 닷컴에서 가져온 기사와 다우, 나스닥 지수를 보여주고, 종목 검색이 가능한 페이지 
4) interests.html : 관심 종목들을 볼 수 있는 페이지
5) login.html : 로그인 페이지 
6) register.html : 회원가입 페이지 

<h4>3. /static/</h4>

각 html 파일과 연결되는 js 파일과 css 파일들이 존재한다.
