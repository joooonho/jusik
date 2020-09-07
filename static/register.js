// 간단한 회원가입 함수입니다.
// 아이디, 비밀번호, 닉네임을 받아 DB에 저장합니다.
function email_auth() {

    //이메일 인증 버튼을 누르면 버튼을 없애버림
    $('#email_auth_button').remove();

    let id =  $('#userid').val();
    let pw = $('#userpw').val();
    let name = $('#usernick').val();
    let email = $('#useremail').val();
    
    let inputBox = [['id', id], ['pw', pw], ['nickName', name], ['email', email]];

    for(let i = 0; i < inputBox.length; i++) {
        if(inputBox[i][1] == ''){
            alert(inputBox[i][0] + '을(를) 입력해주세요.')
            return;
        }
    }
    
    $.ajax({
        type: "POST",
        url: "/api/email_auth",
        data: { id_give: $('#userid').val(), nickname_give: $('#usernick').val(),
        email_give: $('#useremail').val() },
        success: function (response) {
            if (response['result'] == 'success') {

                let number = response['number']

                alert('이메일로 인증번호 전송 완료')
                    let temp_html = `<div class="form-group">
                                <label for="userpw">인증번호</label>
                                <input type="text" class="form-control" id="auth_num" placeholder="인증 번호">
                            </div>`
                    
                    let button = `<button id = "auth-button" class="btn btn-primary" onclick="number_auth('${number}')">인증</button>`
                    
                    $('#user').append(temp_html);
                    $('#user').append(button);
            } else {
                alert(response['msg'])
            }
        }
    })
}

function number_auth(number) {
    if($('#auth_num').val() == number){

        $('#auth-button').remove();
        let button = `<button class="btn btn-primary" onclick="register()">회원가입</button>`
        alert('인증 완료')
        $('#user').append(button)
    }
    else {
        alert('인증 번호가 다릅니다.')
    }
}

function register() {
    $.ajax({
        type: "POST",
        url: "/api/register",
        data: {
            id_give: $('#userid').val(), pw_give: $('#userpw').val(),
            nickname_give: $('#usernick').val(), email_give: $('#useremail').val()
        },
        success: function (response) {
            if (response['result'] == 'success') {
                alert('회원가입이 완료되었습니다.')
                window.location.href = 'login.html'
            } else {
                alert(response['msg'])
            }
        }
    })
}
