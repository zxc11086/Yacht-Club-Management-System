function exit(){
    localStorage.removeItem('username');
    localStorage.removeItem('id')
}

var user;
const id = localStorage.getItem('id');

document.addEventListener('DOMContentLoaded',
    function (){
        document.getElementById('welcome').classList.add('active');
        const username = localStorage.getItem('username');
        const content = 'Hello ' + username;
        document.getElementById('word').textContent = content + "!";

        //单词拼写显示
        const word = document.getElementById('word');
        function revealLetters() {
            const text = word.textContent;
            const letters = text.split('');
            word.textContent = '';

            letters.forEach((letter, index) => {
                setTimeout(() => {
                    word.textContent += letter;
                }, index * 150); // 调整延迟时间
            });

            word.style.animation = 'fadeIn 1.5s ease-out forwards';
        }

        // 使用setTimeout延迟显示字母
        setTimeout(revealLetters, 1000);
    }
)

// 获取个人信息
async function getProfile() {
    var tmp = {
        id : localStorage.getItem('id')
    }
    let profile;
    await fetch('http://127.0.0.1:3000/api/getUser', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(tmp)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        profile = data;
        user = profile[0];
    })
    .catch(error => {
        console.error('Error:', error);
    });
    return profile[0];
}

//修改个人信息
function commit() {
    // 获取各个输入框的值
    const password = document.getElementById('password').value;
    const npassword = document.getElementById('npassword').value;
    const rptpassword = document.getElementById('rptpassword').value;
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    const age = document.getElementById('age').value;
    const sex = document.getElementById('sex').value;

    // 检查密码是否为空
    if (!password) {
        alert('密码不能为空');
        return;
    }
    if(npassword || rptpassword){
        if(npassword != rptpassword){
            alert('两次密码不一样啊啊啊');
            return ;
        }
    }
    
    if(password != user.password){
        alert('密码不正确');
        return;
    }

    user.name = name;
    user.email = email;
    if(npassword){
        user.password = npassword;
    }
    user.age = age;
    user.sex = sex; 

    // 提交数据到后台
    fetch('http://127.0.0.1:3000/api/updateUser', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Success:', data);
        addProfile();
        alert('成功！')
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// 展示个人信息
async function addProfile(event) {
    const personalInfo = await getProfile();
    console.log(personalInfo);
    document.getElementById('username').value = personalInfo.username;
    document.getElementById('email').value = personalInfo.email;
    document.getElementById('name').value = personalInfo.name;
    document.getElementById('age').value = personalInfo.age;
    document.getElementById('sex').value = personalInfo.sex;
    document.getElementById('balance').textContent = "余额: " + personalInfo.balance;
}

//获取特定订单
async function getOrders(type) {
    return await fetch('http://127.0.0.1:3000/api/getSpecific', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({
            type: type,
            id: id
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .catch(error => {
        console.error('Error:', error);
    });  
}

// 将订单添加到列表
async function addOrdersList() {
    buyShipOrders = await getOrders('buy');
    console.log(buyShipOrders);
    // 显示购买订单
    const buyShipOrdersList = document.getElementById('buyShipOrdersList');
    buyShipOrdersList.innerHTML = '';
    buyShipOrders.forEach(order => {
        const row = document.createElement('tr');
        //东八区
        const time = new Date(order.time).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.userId}</td>
            <td>${order.shipId}</td>
            <td>${order.money}</td>
            <td>${time}</td>
            <td>${order.status}</td>
            <td>
                <button onclick="refund(${order.id},'buy')" ${order.status === '已退款' || order.status === '待审核'? 'disabled' : ''}>refund</button>
                <button onclick="deleteItem(${order.id},'buy','Orders')" >delete</button>
            </td>
        `;
        buyShipOrdersList.appendChild(row);
    });
    // 显示租用订单
    hireShipOrders = await getOrders('hire');
    console.log(hireShipOrders);
    const hireShipOrdersList = document.getElementById('hireShipOrdersList');
    hireShipOrdersList.innerHTML = '';
    hireShipOrders.forEach(order => {
        const row = document.createElement('tr');
        //东八区
        const time = new Date(order.time).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.userId}</td>
            <td>${order.shipId}</td>
            <td>${order.money}</td>
            <td>${time}</td>
            <td>${order.startDate.substring(0,10)}</td>
            <td>${order.days}</td>
            <td>${order.status}</td>
            <td>
                <button onclick="refund(${order.id},'hire')" ${order.status === '已退款' || order.status === '待审核' ? 'disabled' : ''}>refund</button>
                <button onclick="deleteItem(${order.id},'hire','Orders')" >delete</button>
            </td>
        `;
        hireShipOrdersList.appendChild(row);
    });
    // 显示服务订单
    serviceOrders = await getOrders('service_order');
    const serviceOrdersList = document.getElementById('serviceOrdersList');
    serviceOrdersList.innerHTML = '';
    serviceOrders.forEach(order => {
        const row = document.createElement('tr');
        //东八区
        const time = new Date(order.time).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' });
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.userId}</td>
            <td>${order.serviceId}</td>
            <td>${order.money}</td>
            <td>${time}</td>
            <td>${order.status}</td>
            <td>
                <button onclick="refund(${order.id},'service_order')" ${order.status === '已退款' || order.status === '待审核' ? 'disabled' : ''}>refund</button>
                <button onclick="deleteItem(${order.id},'service_order','Orders')">delete</button>
            </td>
        `;
        serviceOrdersList.appendChild(row);
    });
}

//提交退款
async function refund(orderId,type){
    if(confirm('确定退款？')){
        await fetch('http://127.0.0.1:3000/api/user_refund', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                id: orderId,
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
            //重载
            addOrdersList();
        })
        .catch(error => {
            console.error('Error:', error);
        });  
    }
}

//删除订单
function deleteItem(orderId,type){
    if(confirm('确认删除此游艇？')){ 
        // 发送请求到服务器
        fetch('http://127.0.0.1:3000/api/deleteItem', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                id: orderId,
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
            // 重新获取游艇列表
            addOrdersList();
        })
        .catch(error => {
            console.error('Error:', error);
        }); 
    }
}

//点击显示个人信息界面
function showMine() {
    // 隐藏所有内容区域
     const allContents = document.querySelectorAll('.content');
     allContents.forEach(content => {
         content.classList.remove('active');
     });
     addProfile();
     // 显示选中标签对应的内容
     const selectedContent = document.getElementById('profile');
     if (selectedContent) {
         console.log(selectedContent);
         selectedContent.classList.add('active');
     }
}

// 点击显示游艇订单页面
function showOrders(){
    // 隐藏所有内容区域
    const allContents = document.querySelectorAll('.content');
    allContents.forEach(content => {
        content.classList.remove('active');
    });
    addOrdersList();
    // 显示选中标签对应的内容
    const selectedContent = document.getElementById('orders');
    if (selectedContent) {
        console.log(selectedContent);
        selectedContent.classList.add('active');
    }
}