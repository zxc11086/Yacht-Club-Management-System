var username;
var id;
var servicesDisplay;

window.onload = function(){
    if(localStorage.getItem('username')){
        username = localStorage.getItem('username');
        id = localStorage.getItem('id');
        console.log(username);
        console.log(id);
    }
    else{
        console.log(false);
    }
}

window.addEventListener('DOMContentLoaded',
    function(){
        serviceDisplay = document.getElementById('serviceDisplay');
        getAll("service");
    }
)


function mine(){
    if(username != null && id != null){
        if(username == "root"){
            window.location.href = "../manage/manage.html"; 
        }
        else{
            window.location.href = "../mine/mine.html"; 
        }
    }
    else{
        window.location.href = '../login/login.html';
    }
}

//获取服务
function getAll(type){
    fetch('http://127.0.0.1:3000/api/getAll',{
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            type: type
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        data.forEach(service => {
            const card = document.createElement('div');
            card.className = 'card';

            const img = document.createElement('img');
            img.src = '.' + service.imgurl;
            card.appendChild(img);

            const name = document.createElement('p');
            name.className = 'name';
            name.textContent = `Name: ${service.name}`;
            card.appendChild(name);
            
            const nums = document.createElement('p');
            nums.className = 'nums';
            nums.textContent = `Nums: ${service.nums}`;
            card.appendChild(nums);

            const price = document.createElement('p');
            price.className = 'price';
            price.textContent = `Price: ${service.price}`;
            card.appendChild(price);

            const buyButton = document.createElement('button');
            buyButton.textContent = 'buy';
            if(service.nums <= 0){
                buyButton.disabled = true;
            }
            buyButton.addEventListener('click', function() {
                buyService(service)
            });
            card.appendChild(buyButton);
            serviceDisplay.appendChild(card);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

//获取余额
async function getBalance() {
    const response = await fetch(`http://127.0.0.1:3000/api/getBalance?userId=${id}`);
    const data = await response.json();
    return data.balance;
}

//购买服务
async function buyService(service){
    if(!id){
        alert('请点击右上角登陆');
        return;
    }
    //获取余额
    const balance = await getBalance();
    if(balance < service.price){
        alert('余额不足！');
        return ;
    }
    if(confirm('确定购买？')){
        //购买
        await fetch('http://127.0.0.1:3000/api/buyService', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                serviceId: service.id,
                userId: id,
                price: service.price
            })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if(data.status == true){
                alert('购买成功');
                //刷新界面
                location.reload();
            }
        });
    } 
}