const params = new URLSearchParams(window.location.search);
const shipId = params.get('shipId');
const shipName = params.get('shipName');
const imgurl = '.' + params.get('imgurl');
const hirePrice = params.get('hirePrice');
var days;
var startDate;
var balance;

//启动时加载 
document.addEventListener('DOMContentLoaded',
    function (){
        document.getElementById('ship-name').innerText = shipName;
        document.getElementById('hire-price').innerText = hirePrice + "/day";
        var date = new Date();
        date.setDate(date.getDate() + 1);
        var dateString = date.toISOString().split('T')[0];
        console.log(dateString);
        document.getElementById('startDate').min = dateString;
        document.querySelector("body").style.backgroundImage = `url(${imgurl})`;
        document.querySelector("body").style.backgroundSize = 'cover';
    }
);

//获取船只的租用日期
async function getShipHiredDate(){
    const response = await fetch(`http://127.0.0.1:3000/api/getShipHiredDate?shipId=${shipId}`);
    if(response.ok){
        const hiredDates = await response.json();
        return hiredDates;
    } else {
        console.error('获取船只租用日期失败：', response.status);
        return null;
    }
}

//上传租用信息
async function uploadShipHireMessage(){
    fetch('http://127.0.0.1:3000/api/uploadShipHireMessage', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            shipId: shipId,
            days: days,
            startDate: startDate.getFullYear() + "-" + (startDate.getMonth()+1) + "-" + startDate.getDate(),
            userId: localStorage.getItem('id'),
            money: hirePrice*days
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
    })
    .catch(error => {
        // 处理请求错误
        console.error('Error:', error);
    });
}

//获取用户余额
async function getUserBalance(){
    const userId = localStorage.getItem('id');
    const response = await fetch(`http://127.0.0.1:3000/api/getBalance?userId=${userId}`);
    if(response.ok){
        const tmp = await response.json();
        balance = tmp.balance;
        console.log(balance);
    } else {
        console.error('获取用户余额失败：', response.status);
        return null;
    }
}


//判断日期是否冲突  （数据量大时可用算法优化，这里没有必要
async function judge(dates){
    //获取日期
    const hiredDates = await getShipHiredDate(); 
    console.log(hiredDates);
    if(hiredDates.length == 0){
        await uploadShipHireMessage();
        alert("租用成功！");
        window.location.href = "../ship/ship.html";
    }
    else{
        var hireddates = [];
        hiredDates.forEach(date => {
            for(var i=0;i<date.days;i++){
                var tmpdate = new Date(date.startDate);
                tmpdate.setDate(tmpdate.getDate() + i);
                hireddates.push(tmpdate.toLocaleDateString('zh-CN'));
                console.log(hireddates)
            }
        });
        orderedDates = [];
        dates.forEach(date => {
            hireddates.forEach(hireddate => {
                if(date == hireddate){
                    orderedDates.push(date);
                    return;
                }
            });
        });
        if(orderedDates.length != 0){
            alert(orderedDates + "已被预定！");
            return;
        }
        await uploadShipHireMessage();
        alert("租用成功！");
        window.location.href = "../ship/ship.html";
    }
    
    
}

async function release(){
    if(confirm("确定提交租赁？")){
        startDate = new Date(document.getElementById('startDate').value);
        days = parseInt(document.getElementById('days').value);
        await getUserBalance();
        if(balance < days * hirePrice){
            alert('没钱玩你🐎？');
            return;
        }
        var dates = [];
        for(var i=0;i<days;i++){
            var tmpdate = new Date(startDate);
            tmpdate.setDate(tmpdate.getDate() + i);
            dates.push(tmpdate.toLocaleDateString('zh-CN'));
            console.log(dates)
        }
        judge(dates);
    }
    
}
