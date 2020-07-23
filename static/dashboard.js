/* globals Chart:false, feather:false */

$(document).ready(function () {
  //$('#stock_row').html('');
  $('#table_price').html('');
  let symbol = $('#stock_symbol').text();

  current_price(symbol);
  stock_price(symbol);
  //매수 기록 가져오기
  order_record(symbol);
  //매도 기록 가져오기
  get_sell_record();
  //매도 종합 데이터 가져오기
  get_total_sell_record();
  graph();

  //시간 구하는 함수 
  get_time(symbol);
});

//장중일때만 현재가격을 가져오도록 한다. 
function get_time(symbol) {
  //현재 시간 구하기
  let now = new Date();
  let hour = now.getHours();
  let minutes = now.getMinutes();

  if ((minutes + "").length < 2) {
    minutes = "0" + minutes;
  }

  time = hour + "" + minutes;
  if (time >= 2230 || time <= 500) {
    console.log(time);
    current_price(symbol);
    console.log(time);
    timer = setTimeout(get_time, 1000, symbol);
  }
}

function stock_price(symbol) {

  //url = `https://finance.yahoo.com/quote/${symbol}/history?period1=1488412800&period2=1593043200&interval=1d&filter=history&frequency=1d`;
  url = `https://finance.yahoo.com/quote/${symbol}/history?p=${symbol}`;

  $.ajax({
    type: "POST",
    url: "/stock_price",
    data: { url_give: url },
    success: function (response) { // 성공하면

      let temp = response['dictionary'];
      temp.forEach(curr => list_price(curr['date'], curr['open'], curr['close'], curr['low'], curr['high'], curr['volume']));

    }
  })
}

function list_price(date, open, close, low, high, volume) {

  let temp_html = `<tr>
    <td>${date}</td>
    <td>${close}</td>
    <td>${open}</td>
    <td>${high}</td>
    <td>${low}</td>
  </tr>`;

  $('#table_price').append(temp_html);

}

//현재가 구하기
function current_price(symbol) {

  url = `https://finance.yahoo.com/quote/${symbol}/history?period1=1488412800&period2=1593043200&interval=1d&filter=history&frequency=1d`

  $.ajax({
    type: "POST",
    url: "/current_price",
    data: { url_give: url },
    success: function (response) { // 성공하면

      //현재가 구하면서 현재 손익까지 계산함 
      $('#price').empty();
      $('#rate').empty();
      $('#profit').empty();

      let temp = response['price_rate'];

      //dashboard 상단에 현재가 나타내기
      append_price_rate(temp['price'], temp['rate']);

      //get_total_total은 '매수종합'에서 총 매수가
      let cal = parseFloat($('#get_total_quantity').text().replace(/,/g, "")) * 
      parseFloat(temp['price'].replace(/,/g, "")) - parseFloat($('#get_total_total').text().replace(/,/g, ""));

      //x[j] = parseFloat(temp[i]['close'].replace(/,/g, ""));
      //y[j] = temp[i]['date'];

      // $('#price').append(temp['price']);
      // $('#rate').append(temp['rate']);
      $('#profit').append(cal);
    }
  })

  //timer = setTimeout(current_price, 1000, symbol);
}

// 전날 대비 종가가 마이너스인지 플러스인지에 따라 색깔 달리 함.
function append_price_rate(price, rate) {

  temp_temp_rate = rate.split(" ");
  //temp_temp_rate = [x, x%] 

  //console.log(temp_temp_rate);  
  if (temp_temp_rate[0] == 0) {
    temp_price = `<h3 class = "exchange">$ ${price}</h3>`;
    temp_rate = `<h3 class = "exchange"> ${rate}</h3>`;
  }
  else if (temp_temp_rate[0] < 0) {
    temp_price = `<h3 class = "exchange-blue">$ ${price}</h3>`;
    temp_rate = `<h3 class = "exchange-blue"> ${rate}</h3>`;
  }
  else {
    temp_price = `<h3 class = "exchange-red">$ ${price}</h3>`;
    temp_rate = `<h3 class = "exchange-red"> ${rate}</h3>`;
  }

  $('#price').append(temp_price);
  $('#rate').append(temp_rate);

}

function calculate() {

  $('#total_price').empty();

  let price = $('#input_price').val();
  let quantity = $('#input_quantity').val();

  $('#total_price').append(price * quantity);

}

//매수/ 매도 주문 
function buy() {

  let symbol = $('#stock_symbol').text();
  let method = $('#buy_sell').val();
  let date = $('#input_date').val();
  let price = $('#input_price').val();
  let quantity = $('#input_quantity').val();
  let total = $('#total_price').text();

  let inputBox = [['method', method], ['date', date], ['price', price], ['quantity', quantity], ['total', total]];
  let i;
  for (i = 0; i < inputBox.length; i++) {

    if (inputBox[i][1] == '') {
      alert(inputBox[i][0] + '을(를) 입력해라');
      return;
    }
  }

  if (method == '매도' && quantity > $('#get_total_quantity').text()) {

    $('#total_price').empty();
    alert('매도 수량을 보유 수량보다 작거나 같게 입력해라')
    return;
  }

  $.ajax({
    type: "POST",
    url: "/order",
    headers: { 'token_give': $.cookie('mytoken') },
    data: { symbol_give: symbol, method_give: method, date_give: date, price_give: price, quantity_give: quantity, total_give: total },
    success: function (response) { // 성공하면

      if (response['result'] == 'success')
        alert('주문 완료');
      order_record(symbol);
      get_sell_record();
      get_total_sell_record();
    }
  })
}

function order_record(symbol) {

  $.ajax({
    type: "POST",
    url: "/get_order",
    headers: { 'token_give': $.cookie('mytoken') },
    data: { symbol_give: symbol },
    success: function (response) { // 성공하면

      $('#order_record').empty();
      temp = response['orders'];

      // 개별 매수 기록
      temp.forEach(curr => list_orders(curr['_id'], curr['date'], curr['price'], curr['quantity'], curr['total']));

      get_total();
    }
  })
}

//db의 stock total에서 매수 종합 데이터 가져오는 함수
function get_total() {

  let symbol = $('#stock_symbol').text()
  $.ajax({
    type: "POST",
    url: "/get_total",
    headers: { 'token_give': $.cookie('mytoken') },
    async: false,
    data: { symbol_give: symbol },
    success: function (response) { // 성공하면

      $('#stock_total').empty();

      //왜 이것만 리스트로 왔는지 모르겠다.

      temp = response[1]['get_total'];

      //아직 매수종합 데이터가 없을 경우
      if (temp == null)
        return;

      let temp_html = `<tr>
      <td>${temp['price']}</td>
      <td id = "get_total_quantity">${temp['quantity']}</td>
      <td id = "get_total_total">${temp['total']}</td>
      <td id = "profit"></td>
    </tr>`;

      $('#stock_total').append(temp_html);

      current_price(symbol); //현재가 구함과 동시에 매수종합에서 손익 계산까지 하는 함수
    }
  })
}

function list_orders(id, date, price, quantity, total) {

  let temp_html = `<tr>
    <td>${date}</td>
    <td>${price}</td>
    <td>${quantity}</td>
    <td>${total}</td>
  </tr>`

  $('#order_record').append(temp_html);

}

//매도 기록 불러오기
function get_sell_record() {

  let symbol = $('#stock_symbol').text()

  $.ajax({
    type: "POST",
    url: "/get_sell_record",
    headers: { 'token_give': $.cookie('mytoken') },
    data: { symbol_give: symbol },
    success: function (response) { // 성공하면

      $('#sell_record').empty();
      temp = response['orders'];

      // 개별 매도 기록
      temp.forEach(curr => list_orders_sell(curr['date'], curr['price'], curr['quantity'], curr['total'], curr['profit']));

      //get_total();
    }
  })
}

function list_orders_sell(date, price, quantity, total, profit) {

  let temp_html = `<tr>
    <td>${date}</td>
    <td>${price}</td>
    <td>${quantity}</td>
    <td>${total}</td>
    <td>${profit}</td>
  </tr>`

  $('#sell_record').append(temp_html);
}

//매도 종합 데이터 가져오기
function get_total_sell_record() {

  let symbol = $('#stock_symbol').text()

  $.ajax({
    type: "POST",
    url: "/get_total_sell_record",
    headers: { 'token_give': $.cookie('mytoken') },
    data: { symbol_give: symbol },
    success: function (response) { // 성공하면

      $('#stock_total_sell').empty();

      //왜 이것만 리스트로 왔는지 모르겠다.

      temp = response[1]['get_total_sell'];

      //아직 매도종합 데이터가 없을 경우
      if (temp == null)
        return;

      let temp_html = `<tr>
      <td>${temp['quantity']}</td>
      <td>${temp['profit']}</td>
    </tr>`;

      $('#stock_total_sell').append(temp_html);
    }
  })
}

function graph() {
  'use strict'

  let symbol = $('#stock_symbol').text();
  //과거 데이터를 먼저 가져온다.
  url = `https://finance.yahoo.com/quote/${symbol}/history?p=${symbol}`;

  //과거 데이터 받아올 변수
  let temp;
  $.ajax({
    type: "POST",
    url: "/stock_price",
    data: { url_give: url },
    success: function (response) { // 성공하면

      temp = response['dictionary'];
      //temp.forEach(curr => list_price(curr['date'], curr['open'], curr['close'], curr['low'], curr['high'], curr['volume']));

      let x = [];
      let y = [];
      for (let j = 0, i = temp.length - 1; i >= 0; j++, i--) {
        x[j] = parseFloat(temp[i]['close'].replace(/,/g, ""));
        y[j] = temp[i]['date'];
      }

      feather.replace()

      // Graphs
      var ctx = document.getElementById('myChart')
      // eslint-disable-next-line no-unused-vars
      var myChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: y,
          datasets: [{
            data: x,
            lineTension: 0,
            backgroundColor: 'transparent',
            borderColor: '#007bff',
            borderWidth: 4,
            pointBackgroundColor: '#007bff'
          }]
        },
        options: {
          scales: {
            yAxes: [{
              ticks: {
                beginAtZero: false
              }
            }]
          },
          legend: {
            display: false
          }
        }
      })
    }
  })
}
