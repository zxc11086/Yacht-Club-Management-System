var username;
var id;
var shipsDisplay;

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
        shipsDisplay = document.getElementById('shipsDisplay');
        getAll("ships");
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

//获取游艇
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
        data.forEach(ship => {
            const shipCard = document.createElement('div');
            shipCard.className = 'ship-card';

            const img = document.createElement('img');
            img.src = '.' + ship.imgurl;
            shipCard.appendChild(img);

            const name = document.createElement('p');
            name.className = 'name';
            name.textContent = `Name: ${ship.shipname}`;
            shipCard.appendChild(name);

            const buyPrice = document.createElement('p');
            buyPrice.className = 'buy-price';
            buyPrice.textContent = `Buy Price: ${ship.buyPrice}`;
            shipCard.appendChild(buyPrice);

            const hirePrice = document.createElement('p');
            hirePrice.className = 'hire-price';
            hirePrice.textContent = `hire Price: ${ship.hirePrice}`;
            shipCard.appendChild(hirePrice);

            const hireButton = document.createElement('button');
            hireButton.textContent = 'hire';
            hireButton.addEventListener('click', function() {
                if(!id){
                    alert('请先登陆');
                    return;
                }
                window.location.href = `../hireShip/hireShip.html?shipId=${ship.id}&imgurl=${ship.imgurl}&hirePrice=${ship.hirePrice}&shipName=${ship.shipname}`;
            });
            shipCard.appendChild(hireButton);

            const buyButton = document.createElement('button');
            buyButton.textContent = 'Buy';
            buyButton.addEventListener('click', function() {
                buyShip(ship);
            });
            shipCard.appendChild(buyButton);
            if(ship.status == 0){
                buyButton.disabled = true;
                hireButton.disabled = true;
            }

            shipsDisplay.appendChild(shipCard);
            shipsDisplay.appendChild(shipCard);
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

//购买游艇
async function buyShip(ship){
    if(!id){
        alert('请点击右上角登陆');
        return;
    }
    console.log(ship.buyPrice);
    //获取余额
    const balance = await getBalance();
    if(balance < ship.buyPrice){
        alert('余额不足！');
        return ;
    }
    if(confirm('确定购买？')){
        //购买
        await fetch('http://127.0.0.1:3000/api/buy', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                shipId: ship.id,
                userId: id,
                buyPrice: ship.buyPrice,
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