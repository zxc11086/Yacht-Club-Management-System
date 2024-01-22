//验证
function verify() {
    var username = document.getElementById("username").value;
    fetch('http://127.0.0.1:3000/api/sendPassword',{
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log(data)
        if(data.status == false){
            alert('用户不存在');
        }
        else{
            alert("密码已发送至你的邮箱");
            window.location.href = "../login/login.html";
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

