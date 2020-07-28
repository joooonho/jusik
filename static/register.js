// 간단한 회원가입 함수입니다.
// 아이디, 비밀번호, 닉네임을 받아 DB에 저장합니다.
function email_auth() {
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
                    
                    let button = `<button id = "${number}" class="btn btn-primary" onclick="number_auth(this.id)">인증</button>`
                    $('#email_auth_button').remove();
                    
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
