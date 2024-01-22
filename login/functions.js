function login() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    var Error = document.getElementById("Error");

    Error.innerHTML = "";

    console.log("username: " + username);
    console.log("Password: " + password);

    const data = {
        username: username,
        password: password,
    }

    // 使用 fetch 发起 GET 请求
    fetch('http://127.0.0.1:3000/api/login', {
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
        // 处理从服务器获取到的数据
        console.log(data);
        if(data.status == false){
            Error.innerHTML = "username not exists or password wrong";
        }
        else{
            alert("success!");
            localStorage.setItem("username",username);
            localStorage.setItem("id",data.id);
            if(username == "root"){
                window.location.href = "../manage/manage.html";
            }
            else{
                window.location.href = "../index.html";
            }
        }
    })
    .catch(error => {
        // 处理请求错误
        console.error('Error:', error);
    });

}
