$(document).ready(function () {
  $('#stock_row').html('');
  post_stocks();
});

function post_stocks() {

  $.ajax({
    type: "GET",
    url: "/stock",
    headers: { 'token_give' : $.cookie('mytoken') },
    data: {},
    success: function (response) {
      if (response['result'] == 'success') {

        let stocks = response['stocks'];

        stocks.forEach(curr => make_card(curr['companyName'], curr['symbol'], curr['primaryExchange'], curr['close'], curr['_id']));

      }
    }
  });
}

function make_card(name, symbol, exchange, price, id) {

  let temp_url = `https://finance.yahoo.com/quote/${symbol}/?p=${symbol}`;

  $.ajax({
    type: "POST",
    url: "/current_price",
    data: { url_give: temp_url },
    success: function (response) {
      if (response['result'] == 'success') {

        let temp = response['price_rate'];
        console.log(temp['price']);

        //주가 변동 금액이랑, 변동 퍼센티지
        let change = temp['price'];
        let change_rate = temp['rate'];

        let temp_html;

        // +14 (+0.3%) 이런 꼴의 change_rate을 공백 기준으로 자른다.
        let temp_rate = change_rate.split(" ");

        // 전날 종가 기준 플러스냐 마이너스냐에 따라 색깔 다르게 준다. 
        if (temp_rate[0] == 0) {
          temp_html = `<div class="col-md-4">
    <div class="card mb-4 shadow-sm">
      <div class="card-body">
        <h3>${name}</h3>
        <h4>${symbol}</h4>
        <h5 class="exchange">${change}</h5>
        <h5 class = "exchange">${change_rate}</h5>
        <p class="card-text">${exchange}</p>
        <div class="d-flex justify-content-between align-items-center">
          <div class="btn-group">
            <form action = "/dashboard" method = "POST">
              <input type = "hidden" name = "symbol" value = "${symbol}">
              <p><input class = "size" type = "submit" value = "보기" /></p>
            </form>
            <button id = "${id}" onClick = "delete_stock(this.id)" type="button" class="btn btn-sm btn-outline-secondary size">삭제</button>
            </div>
          <small class="text-muted"></small>
        </div>
      </div>
    </div>
  </div>`;
        }
        else if(temp_rate[0] > 0) {
          temp_html = `<div class="col-md-4">
    <div class="card mb-4 shadow-sm">
      <div class="card-body">
        <h3>${name}</h3>
        <h4>${symbol}</h4>
        <h5 class = "exchange-red">$ ${change}</h5>
        <h5 class = "exchange-red">${change_rate}</h5>
        <p class="card-text">${exchange}</p>
        <div class="d-flex justify-content-between align-items-center">
          <div class="btn-group">
            <form action = "/dashboard" method = "POST">
              <input type = "hidden" name = "symbol" value = "${symbol}">
              <p><input class = "size" type = "submit" value = "보기" /></p>
            </form>
            <button id = "${id}" onClick = "delete_stock(this.id)" type="button" class="btn btn-sm btn-outline-secondary size">삭제</button>
            </div>
          <small class="text-muted"></small>
        </div>
      </div>
    </div>
  </div>`;
        } 
        else {
          temp_html = `<div class="col-md-4">
    <div class="card mb-4 shadow-sm">
      <div class="card-body">
        <h3>${name}</h3>
        <h4>${symbol}</h4>
        <h5 class = "exchange-blue">$ ${change}</h5>
        <h5 class = "exchange-blue">${change_rate}</h5>
        <p class="card-text">${exchange}</p>
        <div class="d-flex justify-content-between align-items-center">
          <div class="btn-group">
            <form action = "/dashboard" method = "POST">
              <input type = "hidden" name = "symbol" value = "${symbol}">
              <p><input class = "size" type = "submit" value = "보기" /></p>
            </form>
            <button id = "${id}" onClick = "delete_stock(this.id)" type="button" class="btn btn-sm btn-outline-secondary size">삭제</button>
            </div>
          <small class="text-muted"></small>
        </div>
      </div>
    </div>
  </div>`;
        }

        $('#stock_row').append(temp_html);
      }
    }
  });
}


function delete_stock(id) {

  $.ajax({
    type: "DELETE",
    url: "/stock",
    data: { id_give: id },
    success: function (response) {
      if (response['result'] == 'success') {
        alert('삭제 완료');
        window.location.reload();
      } else {
        alert('서버 오류');
      }
    }
  })
}

function show_dashboard() {

  $.ajax({
    type: "POST",
    url: "/dashboard",
    data: {},
    success: function (response) {
      if (response['result'] == 'success') {

      } else {
        alert('서버 오류');
      }
    }
  })
}

