var username
//注册
function register() {
    username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var email = document.getElementById("email").value;

    var usernameError = document.getElementById("usernameError");
    var passwordError = document.getElementById("passwordError");
    var emailError = document.getElementById("emailError");

    usernameError.innerHTML = "";
    emailError.innerHTML = "";
    passwordError.innerHTML = "";

    if(username.length > 20 || username.length < 4){
        usernameError.innerHTML = "username should between 4 - 20";
    }
    else if(password.length > 20 || password.length < 8){
        passwordError.innerHTML = "password should between 8 - 20";
    }
    else{
        console.log("username: " + username);
        console.log("Password: " + password);
        console.log("email: " + email);

        const data = {
            username: username,
            password: password,
            email: email
        }

        // 使用 fetch 发起请求
        fetch('http://127.0.0.1:3000/api/register',{
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            if(data.status == false){
                usernameError.innerHTML = "username already exists";
            }
            else{
                localStorage.setItem('username',username);
                window.location.href = '../verify/verify.html';
            }
        })
        .catch(error => {
            console.error('Error:', error);
        })
    }
}
