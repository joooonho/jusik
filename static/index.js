$(document).ready(function () {

    post_dow_index(); //각 시장의 지수 가져오기
    post_nasdaq_index();
    save_article();
    get_article();

    get_time();

    get_id(); //회원 닉네임 가져오기 
});

function get_id() {

    if ($.cookie('mytoken') == undefined) {
        // mytoken이라는 값으로 쿠키가 없는 경우
    } else {
        // 쿠기가 있으면, 유저 정보를 불러옵니다.
        $.ajax({
            type: "GET",
            url: "/api/nick",
            headers: { 'token_give': $.cookie('mytoken') },
            data: {},
            success: function (response) {
                if (response['result'] == 'success') {
                    // 올바른 결과값을 받으면 nickname을 입력해줍니다.
                    $('#sign-up').empty();

                    let temp_html = `${response['id']} 님 환영합니다.
                    <a onClick="logout()" href="#" class="btn btn-secondary my-2">로그아웃</a>`;

                    $('#sign-up').append(temp_html);
                }
            }
        })
    }
}

// 로그아웃은 내가 가지고 있는 토큰만 쿠키에서 없애면 됩니다.
function logout() {
    $.removeCookie('mytoken');
    alert('로그아웃')
    window.location.href = '/'
}

function get_time() {

    //현재 시간 구하기
    let now = new Date();
    let hour = now.getHours();
    let minutes = now.getMinutes();

    if ((minutes + "").length < 2) {
        minutes = "0" + minutes;
    }

    time = hour + "" + minutes;
    if (time >= 2230 || time <= 500) {

        post_dow_index(); //각 시장의 지수 가져오기
        post_nasdaq_index();
        timer = setTimeout(get_time, 1000);
    }
}

function save_article() {
    $.ajax({
        type: "POST",
        url: "/article",
        sync: false,
        data: { url_give: 'https://kr.investing.com/news/most-popular-news' },
        success: function (response) {
            if (response['result'] == 'success') {

                // 2. 성공했을 때 리뷰를 올바르게 화면에 나타내기
            } else {
                alert('리뷰를 받아오지 못했습니다');
            }
        }
    });
}

function get_article() {

    $.ajax({
        type: "GET",
        url: "/article",
        data: {},
        success: function (response) {
            if (response['result'] == 'success') {
                let articles = response['articles']
                make_card(articles['url'], articles['image'], articles['title'], articles['desc']);

            }
        }
    })
}

function make_card(url, image, title, desc) {

    let urll = 'https://kr.investing.com/equities/apple-computer-inc'
    let temp_html = `<div class="px-0">
                        <img class = "rounded article-img" src="${image}">
                        <div>
                            <h1 class="display-4 font-italic">${title}</h1>
                            <p class="lead my-3">${desc}</p>
                            <p class="lead mb-0"><a href="${url}" class="text-white font-weight-bold">Contiue reading ...</a></p>
                        </div>               
                </div>`;

    $('#main-box').append(temp_html);
}

function post_dow_index() {

    //다우 지수 불러오기
    $.ajax({
        type: "POST",
        url: "/index",
        data: { url_give: 'https://kr.investing.com/indices/us-30' },
        success: function (response) {
            if (response['result'] == 'success') {

                //서버로부터 데이터 받아와서 저장함.
                let index = response['result_index'];

                make_index_dow(index['index'], index['change'], index['percent'], index['date']);
                //make_index_nasdaq(index[1]['index'], index[1]['change'], index[1]['percent'], index[1]['date']);

            }
        }
    })
}

function make_index_dow(index, change, percent, date) {

    let temp_html;
    if (change < 0) {
        temp_html = `<div class="col p-4 d-flex flex-column position-static">
        <strong class="d-inline-block mb-2 text-primary">다우 존스</strong>
        <h3 class="mb-0">${index}</h3>
        <div class="mb-1 text-muted">${date}</div>
        <p class="exchange-blue card-text mb-auto">${change}</p>
        <p class="exchange-blue card-text mb-auto">${percent}</p>
    </div>`;
    }
    else if (change == 0) {
        temp_html = `<div class="col p-4 d-flex flex-column position-static">
        <strong class="d-inline-block mb-2 text-primary">다우 존스</strong>
        <h3 class="mb-0">${index}</h3>
        <div class="mb-1 text-muted">${date}</div>
        <p class="exchange card-text mb-auto">${change}</p>
        <p class="exchange card-text mb-auto">${percent}</p>
    </div>`;
    }
    else {
        temp_html = `<div class="col p-4 d-flex flex-column position-static">
        <strong class="d-inline-block mb-2 text-primary">다우 존스</strong>
        <h3 class="mb-0">${index}</h3>
        <div class="mb-1 text-muted">${date}</div>
        <p class="exchange-red card-text mb-auto">${change}</p>
        <p class="exchange-red card-text mb-auto">${percent}</p>
    </div>`;
    }
    $('#dow-index-card').empty();
    $('#dow-index-card').append(temp_html);
}

// 나스닥 지수 불러오기
function post_nasdaq_index() {

    $.ajax({
        type: "POST",
        url: "/index",
        data: { url_give: 'https://kr.investing.com/indices/nq-100' },
        success: function (response) {
            if (response['result'] == 'success') {

                //서버로부터 데이터 받아와서 저장함.
                let index = response['result_index'];

                make_index_nasdaq(index['index'], index['change'], index['percent'], index['date']);
                //make_index_nasdaq(index[1]['index'], index[1]['change'], index[1]['percent'], index[1]['date']);

            }
        }
    })
}

function make_index_nasdaq(index, change, percent, date) {

    let temp_html;
    if (change < 0) {
        temp_html = `<div class="col p-4 d-flex flex-column position-static">
        <strong class="d-inline-block mb-2 text-primary">나스닥</strong>
        <h3 class="mb-0">${index}</h3>
        <div class="mb-1 text-muted">${date}</div>
        <p class="exchange-blue card-text mb-auto">${change}</p>
        <p class="exchange-blue card-text mb-auto">${percent}</p>
    </div>`;
    }
    else if (change == 0) {
        temp_html = `<div class="col p-4 d-flex flex-column position-static">
        <strong class="d-inline-block mb-2 text-primary">나스닥</strong>
        <h3 class="mb-0">${index}</h3>
        <div class="mb-1 text-muted">${date}</div>
        <p class="exchange card-text mb-auto">${change}</p>
        <p class="exchange card-text mb-auto">${percent}</p>
    </div>`;
    }
    else {
        temp_html = `<div class="col p-4 d-flex flex-column position-static">
        <strong class="d-inline-block mb-2 text-primary">나스닥</strong>
        <h3 class="mb-0">${index}</h3>
        <div class="mb-1 text-muted">${date}</div>
        <p class="exchange-red card-text mb-auto">${change}</p>
        <p class="exchange-red card-text mb-auto">${percent}</p>
    </div>`;
    }

    $('#nasdaq-index-card').empty();
    $('#nasdaq-index-card').append(temp_html);
}

function search() {

    let url = 'https://kr.investing.com/search/?q=';
    let stock_name = $('#stock').val();

    $.ajax({
        type: "POST",
        url: "/search",
        data: { url_give: url, stock_give: stock_name },
        success: function (response) { // 성공하면
            if (response['result'] == 'success') {
                $('#stock_table').empty();
                let datas = response['dictionary'];
                datas.forEach(curr => make_board(curr['href'], curr['symbol'], curr['name'], curr['exchange']));
            } else if (response['result'] == 'fail') {
                window.location.reload();
            } else {
                alert('서버오류남ㅋㅋㅋ');
            }
        }
    })
}

function make_board(href, symbol, name, exchange) {
    let base_url = 'https://kr.investing.com';
    let url = base_url + href;

    let temp_html = `<tr style="cursor:pointer;" onClick="show_stock('${symbol}')">
    <td>${name}</td>
    <td>${symbol}</td>
    <td>${exchange}</td>
  </tr>`;

    $('#stock_table').append(temp_html);

}

function get_stock_value(symbol, token) {

    let stock_value;

    url = `https://cloud.iexapis.com/stable/stock/${symbol}/quote?token=${token}`;
    //url = "https://cloud.iexapis.com/stable/stock/aapl/quote?token=pk_31c6148666914eaf9e526964898f75ab";

    $.ajax({
        type: "GET",
        url: url,
        async: false,
        data: {},
        success: function (response) { // 성공하면
            show_stock_value(response['symbol'], response['companyName'], response['primaryExchange'], response['close']);
            stock_value = {
                'symbol': response['symbol'], 'companyName': response['companyName'],
                'primaryExchange': response['primaryExchange'], 'close': response['close']
            };
        }
    })
    return stock_value;
}

function get_stock_info(symbol, token) {

    let stock_info;

    url = `https://cloud.iexapis.com/stable/stock/${symbol}/company?token=${token}`
    console.log(url);
    $.ajax({
        type: "GET",
        url: url,
        async: false,
        data: {},
        success: function (response) { // 성공하면
            show_stock_info(response['industry'], response['website'], response['description'], response['sector']);
            stock_info = {
                'industry': response['industry'],
                'website': response['website'], 'description': response['description'], 'sector': response['sector']
            };
        }
    })

    return stock_info;
}

//symbol, companyName, primaryExchange, close
function show_stock_info(industry, website, description, sector) {

    //<div class="col p-4 d-flex flex-column position-static">

    let temp_html = `<div class="col p-4 d-flex flex-column position-static">
    <h5 id = "industry" class="mb-0">${industry}</h5>
    <div id = "website" class="mb-1 text-muted">${website}</div>
    <div id = "sector" class="mb-1 text-muted">${sector}</div>
    <p id = "description" class="mb-auto">${description}</p>
</div>`;

    $('#main-right').append(temp_html);
}

function show_stock_value(symbol, companyName, primaryExchange, close) {

    let temp_html = `<div class="col p-4 d-flex flex-column position-static">
    <h5 id = "symbol" class="mb-0">${symbol}</h5>
    <div id = "companyName" class="mb-1 text-muted">${companyName}</div>
    <div id = "primaryExchange" class="mb-1 text-muted">${primaryExchange}</div>
    <p id = "close" class="mb-auto">${close}</p>
    <a href="#" onClick="save_stock()" class="stretched-link">관심종목 추가</a>
    </div>`;

    $('#main-right').prepend(temp_html);
}

function show_stock(symbol) {

    let token = "pk_31c6148666914eaf9e526964898f75ab";

    $('#main-right').empty();

    get_stock_value(symbol, token);
    get_stock_info(symbol, token);

}

function load_user_info() {

    let id;
    $.ajax({
        type: "GET",
        url: "/api/nick",
        async: false,
        headers: { 'token_give': $.cookie('mytoken') },
        data: {},
        success: function (response) {
            if (response['result'] == 'success') {
                // 올바른 결과값을 받으면 nickname을 입력해줍니다.
                id = response['id'];
            } else {
                // 에러가 나면 메시지를 띄우고 로그인 창으로 이동합니다.
                alert(response['msg'])
                window.location.href = '/login'
            }
        }
    })
    return id;
}

function save_stock() {

    let id_receive;
    if ($.cookie('mytoken') == undefined) {
        // mytoken이라는 값으로 쿠키가 없으면, 로그인 창으로 이동시킵니다.
        alert('먼저 로그인을 해주세요')
        return;
        // window.location.href='/'
    } else {
        // 쿠기가 있으면, 유저 정보를 불러옵니다.
        id_receive = load_user_info();

        let companyName = $('#companyName').text();
        let symbol = $('#symbol').text();
        let primaryExchange = $('#primaryExchange').text();
        let close = $('#close').text();
        let industry = $('#industry').text();
        let website = $('#website').text();
        let sector = $('#sector').text();
        let description = $('#description').text();

        $.ajax({
            type: "POST",
            url: "/stock",
            data: {
                id: id_receive,
                companyName: companyName, symbol: symbol, primaryExchange: primaryExchange, close: close,
                industry: industry, website: website, sector: sector, description: description
            },
            success: function (response) {
                if (response['result'] == 'success') {
                    alert('관심종목에 추가 완료')
                }
            }
        })
    }
}

function move_to_interest() {

    if ($.cookie('mytoken') == undefined) {
        // mytoken이라는 값으로 쿠키가 없으면, 로그인 창으로 이동시킵니다.
        alert('먼저 로그인을 해주세요');
        // window.location.href='/'
    } else {
        // 쿠기가 있으면, 유저 정보를 불러옵니다.
        window.location.href = '/interests.html';
    }
}

function move_to_articles() {

    if ($.cookie('mytoken') == undefined) {
        // mytoken이라는 값으로 쿠키가 없으면, 로그인 창으로 이동시킵니다.
        alert('먼저 로그인을 해주세요');
        // window.location.href='/'
    } else {
        // 쿠기가 있으면, 유저 정보를 불러옵니다.
        window.location.href = '/articles.html';
    }
}


