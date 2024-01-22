var username = localStorage.getItem('username');

//验证
function verify() {
    var verification_code = document.getElementById("verifyInput").value;
    fetch('http://127.0.0.1:3000/api/verify',{
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            verification_code: verification_code
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
            alert('验证码错误');
        }
        else{
            alert("success!");
            localStorage.setItem('id',data.id);
            window.location.href = "../index.html";
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

