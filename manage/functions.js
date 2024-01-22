function exit(){
    localStorage.removeItem('username',null);
    localStorage.removeItem('id',null);
}

var query_done = false;
var usersContainer; 
var shipsContainer; 

//获取所有 
async function getAll(type){
    return fetch('http://127.0.0.1:3000/api/getAll',{
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
    .catch(error => {
        console.error('Error:', error);
    });
}

//删除
async function deleteItem(id,type,reload){
    if(confirm('确认删除？')){ 
        // 发送请求到服务器
        fetch('http://127.0.0.1:3000/api/deleteItem', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
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
            if(type == "users"){
                addUsersList();
            }
            else if(type == "ships"){
                addShipsList();
            }
            else if(type == "service"){
                addServiceList();
            }
            else{   
                searchOrders();
            }
        })
        .catch(error => {
            console.error('Error:', error);
        }); 
    }
}

window.onload = function() {
    const word = document.querySelector('.word');
    word.innerHTML = word.textContent.split('').map(letter => `<span>${letter}</span>`).join('');
}

//启动时加载 
document.addEventListener('DOMContentLoaded',
    function (){
        document.getElementById('welcome').classList.add('active');
        usersContainer = document.getElementById('usersList');
        shipsContainer = document.getElementById('shipsList');
        serviceContainer = document.getElementById('serviceList');
        var startDateInput = document.getElementById('startDate');
        var endDateInput = document.getElementById('endDate');
        startDateInput.addEventListener('change', function() {
            endDateInput.min = startDateInput.value;
        });

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
);

//将获取到的用户插入表中
async function addUsersList(){
    let data = await getAll('users');
    let users  = data;
    usersContainer.innerHTML = '';
    users.forEach(user => {
        const row = usersContainer.insertRow();
        // 插入单元格并设置内容
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.password}</td>
            <td>${user.name}</td>
            <td>${user.sex}</td>
            <td>${user.age}</td>
            <td>${user.grade}</td>
            <td>${user.email}</td>
            <td>${user.balance}</td>
        `;
        // 添加修改按钮
        const actionCell = row.insertCell();
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => { editButton.disabled = true;editUser(user,row)});
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'delete';
        deleteButton.addEventListener('click', () => deleteItem(user.id,"users","Users"));
        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);
        usersContainer.appendChild(row);
    });
}

//修改用户
function editUser(user,row){
    // 创建输入框
    const passwordInput = document.createElement('input');
    const balanceInput = document.createElement('input');
    // 创建等级选择框
    const gradeSelect = document.createElement('select');
    for(let i = 1; i <= 10; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = i;
        gradeSelect.appendChild(option);
    }

    // 设置输入框的类型
    passwordInput.type = 'text';
    balanceInput.type = 'number';

    // 设置输入框的初始值
    passwordInput.value = user.password;
    gradeSelect.value = user.grade;
    balanceInput.value = user.balance;

    row.cells[2].textContent = '';
    row.cells[2].appendChild(passwordInput);
    row.cells[6].textContent = '';
    row.cells[6].appendChild(gradeSelect);
    row.cells[8].textContent = '';
    row.cells[8].appendChild(balanceInput);

    // 创建确认按钮
    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'sure';
    confirmButton.addEventListener('click', () => {
        // 获取输入框中的值
        const password = passwordInput.value;
        const grade = gradeSelect.value;
        const balance = balanceInput.value;

        // 更新用户对象
        user.password = password;
        user.grade = grade;
        user.balance = balance;
        

        // 发送请求到服务器
        fetch('http://127.0.0.1:3000/api/editUser',{
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
            addUsersList();
        })
        .catch(error => {
            console.error('Error:', error);
        }); 
    });

    // 添加确认按钮
    row.cells[row.cells.length - 1].appendChild(confirmButton);
}

//添加用户
function addUser(){
    // 创建新的行和单元格
    const row = usersContainer.insertRow();
    const idCell = row.insertCell();
    const usernameCell = row.insertCell();
    const passwordCell = row.insertCell();
    const nameCell = row.insertCell();
    const sexCell = row.insertCell();
    const ageCell = row.insertCell();
    const gradeCell = row.insertCell();
    const emailCell = row.insertCell();
    const balanceCell = row.insertCell();
    const actionCell = row.insertCell();

    // 创建输入框
    const usernameInput = document.createElement('input');
    const passwordInput = document.createElement('input');
    const balanceInput = document.createElement('input');
    const gradeSelect = document.createElement('select');
    for(let i = 1; i <= 10; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = i;
        gradeSelect.appendChild(option);
    }

    // 设置输入框的类型
    usernameInput.type = 'text';
    balanceInput.type = 'number';
    passwordInput.type = 'text';

    // 将输入框添加到单元格
    usernameCell.appendChild(usernameInput);
    passwordCell.appendChild(passwordInput);
    gradeCell.appendChild(gradeSelect);
    balanceCell.appendChild(balanceInput);

    // 创建取消按钮
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'abort';
    cancelButton.addEventListener('click', () => {
        // 删除当前行
        usersContainer.deleteRow(row.rowIndex-1);
    });

    // 创建确认按钮
    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'sure';
    confirmButton.addEventListener('click', () => {
        // 获取输入框中的值
        const username = usernameInput.value;
        const password = passwordInput.value;
        const grade = gradeSelect.value;
        const balance = balanceInput.value;

        // 验证输入框的合法性
        if (!username || !password || !grade || !balance) {
            alert('所有字段都必须填写！');
            return;
        }
        if (balance < 0) {
            alert('余额不能小于0！');
            return;
        }

        // 创建用户对象
        const user = {
            username: username,
            password: password,
            grade: grade,
            balance: balance
        };

        // 发送请求到服务器
        fetch('http://127.0.0.1:3000/api/addUser',{
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(user)
        })
        .then(response => {
            console.log(response);
            if(response.status == 400){
                alert("用户名已存在!");
            }
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // 删除当前行
            usersContainer.deleteRow(row.rowIndex-1);
            // 重新获取用户列表
            addUsersList();
        })
        .catch(error => {
            console.error('Error:', error);
        }); 
    });
    

    // 将确认按钮添加到单元格
    actionCell.appendChild(confirmButton);
    // 将取消按钮添加到单元格
    actionCell.appendChild(cancelButton);
}

// 将获取到的游艇插入表中
async function addShipsList(){
    const ships = await getAll("ships");
    shipsContainer.innerHTML = '';
    ships.forEach(ship => {
        const row = shipsContainer.insertRow();
        // 插入单元格并设置内容
        Object.values(ship).forEach(value => {
            const cell = row.insertCell();
            if (typeof value === 'string' && (value.endsWith('.png') || value.endsWith('.jpg') || value.endsWith('.jpeg') || value.endsWith('.webp'))) {
                // 创建一个新的img元素，设置其src属性，然后将其添加到单元格中
                const img = document.createElement('img');
                img.src = '.' + value;
                cell.appendChild(img);
            } else {
                cell.textContent = value;
            }
        });

        // 添加修改按钮
        const actionCell = row.insertCell();
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => { editButton.disabled = true;handleEditShipButtonClick(ship,row)});
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'delete';
        deleteButton.addEventListener('click', () => deleteItem(ship.id,"ships","Ships"));
        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);
    });
}

//修改游艇
async function handleEditShipButtonClick(ship, row){
    // 创建输入框
    const nameInput = document.createElement('input');
    const buyPriceInput = document.createElement('input');
    const hirePriceInput = document.createElement('input');
    nameInput.type = 'text';
    hirePriceInput.type = 'int';
    buyPriceInput.type = 'int';
    // 创建状态选择框
    const statusSelect = document.createElement('select');
    for(let i = 0; i <= 1; i++) {
        const option = document.createElement('option');
        option.value = i;
        option.text = i;
        statusSelect.appendChild(option);
    }
    //创建图片选择器
    const imgSelect = document.createElement('input');
    imgSelect.type = 'file';
    imgSelect.accept = 'image/*';
    // 设置输入框的初始值
    statusSelect.value = ship.status;
    nameInput.value = ship.shipname;
    hirePriceInput.value = ship.hirePrice;
    buyPriceInput.value = ship.buyPrice;

    row.cells[1].textContent = '';
    row.cells[1].appendChild(nameInput);
    row.cells[2].textContent = '如无需修改图片，则不必修改此项目';
    row.cells[2].appendChild(imgSelect);
    row.cells[3].textContent = '';
    row.cells[3].appendChild(buyPriceInput);
    row.cells[4].textContent = '';
    row.cells[4].appendChild(hirePriceInput);
    row.cells[5].textContent = '';
    row.cells[5].appendChild(statusSelect);

    // 创建确认按钮
    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'sure';
    confirmButton.id = 'confirmButton';
    confirmButton.addEventListener('click', async () => {
        // 获取输入框中的值
        const shipname = nameInput.value;
        const status = statusSelect.value;
        const buyPrice = buyPriceInput.value;
        const hirePrice = hirePriceInput.value;
        // 更新ship对象
        ship.shipname = shipname;
        ship.status = status;
        ship.buyPrice = buyPrice;
        ship.hirePrice = hirePrice;
        //更改图片
        if(imgSelect.value){
            //先删除原有的图片
            await fetch('http://127.0.0.1:3000/api/deleteImg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(ship)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
            });

            const img = imgSelect.files[0];

            // 创建一个新的FormData对象
            const formData = new FormData();
    
            // 将图片添加到FormData对象中
            formData.append('img', img);
    
            // 发送请求到服务器
            await fetch('http://127.0.0.1:3000/api/uploadImg', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // 服务器返回的数据中应该包含图片的URL
                const imgurl = data.imgurl;
                ship.imgurl = imgurl;
            });
        }
    
        // 发送更新请求到服务器
        fetch('http://127.0.0.1:3000/api/editShip', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(ship)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // 重新获取游艇列表
            addShipsList();
        })
        .catch(error => {
            console.error('Error:', error);
        }); 
    })
    row.cells[row.cells.length - 1].appendChild(confirmButton);
}
 
//添加游艇
function addShip(){
    // 创建新的行和单元格
    const row = shipsContainer.insertRow();
    const idCell = row.insertCell();
    const nameCell = row.insertCell();
    const imgCell = row.insertCell();
    const buyPriceCell = row.insertCell();
    const hirePriceCell = row.insertCell();
    const statusCell = row.insertCell();
    const actionCell = row.insertCell();

    // 创建输入框
    const nameInput = document.createElement('input');
    const hirePriceInput = document.createElement('input');
    const buyPriceInput = document.createElement('input');
    const imgSelect = document.createElement('input');

    // 设置输入框的类型
    nameInput.type = 'text';
    buyPriceInput.type = 'int';
    hirePriceInput.type = 'int';
    imgSelect.type = 'file';
    imgSelect.accept = 'image/*';

    // 将输入框添加到单元格
    nameCell.appendChild(nameInput);
    buyPriceCell.appendChild(buyPriceInput);
    hirePriceCell.appendChild(hirePriceInput);
    imgCell.appendChild(imgSelect);

    // 创建取消按钮
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'abort';
    cancelButton.addEventListener('click', () => {
        // 删除当前行
        shipsContainer.deleteRow(row.rowIndex-1);
    });

    // 创建确认按钮
    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'sure';
    confirmButton.addEventListener('click', () => {
        // 获取输入框中的值
        const name = nameInput.value;
        const hirePrice = hirePriceInput.value;
        const buyPrice = buyPriceInput.value;
        const img = imgSelect.files[0];


        // 创建一个新的FormData对象
        const formData = new FormData();

        // 将图片添加到FormData对象中
        formData.append('img', img);

        // 发送请求到服务器
        fetch('http://127.0.0.1:3000/api/uploadImg', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // 服务器返回的数据中应该包含图片的URL
            const imgurl = data.imgurl;

            // 创建游艇对象
            const ship = {
                name: name,
                imgurl: imgurl,
                buyPrice: buyPrice,
                hirePrice: hirePrice
            };

            // 发送请求到服务器
            fetch('http://127.0.0.1:3000/api/addShip', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(ship)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // 删除当前行
                shipsContainer.deleteRow(row.rowIndex-1);
                // 重新获取游艇列表
                addShipsList();
            })
            .catch(error => {
                console.error('Error:', error);
            }); 
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
    
    // 将确认按钮添加到单元格
    actionCell.appendChild(confirmButton);
    // 将取消按钮添加到单元格
    actionCell.appendChild(cancelButton);
}

//处理游艇购买退款
async function handleRefundShipOrder(orderId){
    if(confirm('确定退款？')){
        await fetch('http://127.0.0.1:3000/api/refundShipOrder', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({id: orderId})
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            //重载
            searchOrders();
        })
        .catch(error => {
            console.error('Error:', error);
        });  
    }
}

//处理游艇租用退款
async function handleRefundHireShipOrder(orderId){
    if(confirm('确定退款？')){
        await fetch('http://127.0.0.1:3000/api/refundHireShipOrder', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({id: orderId})
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            //重载
            searchOrders();
        })
        .catch(error => {
            console.error('Error:', error);
        });  
    }
}

//处理服务退款
async function handleRefundServiceOrder(id){
    if(confirm('确定退款？')){
        await fetch('http://127.0.0.1:3000/api/refundServiceOrder', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({id: id})
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            //重载
            searchOrders();
        })
        .catch(error => {
            console.error('Error:', error);
        });  
    }
}

//拒绝退款
async function refuseRefund(id,type){
    if(confirm('确定拒绝？')){
        await fetch('http://127.0.0.1:3000/api/refuseRefund', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
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
            searchOrders();
        })
        .catch(error => {
            console.error('Error:', error);
        });  
    }
}

//将购买订单添加到列表
async function addBuyShipList(){
    buyShipOrders = await getAll('buy');
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
            <td id = 'action-${order.id}'>
                <button onclick="handleRefundShipOrder(${order.id})" ${order.status === '已退款' ? 'disabled' : ''}>refund</button>
                <button onclick="deleteItem(${order.id},'buy','Orders')" >delete</button>
            </td>
        `;
        buyShipOrdersList.appendChild(row);
        if(order.status == '待审核'){
            // 创建确认按钮
            const refuseButton = document.createElement('button');
            refuseButton.textContent = 'refuse';
            const action = document.getElementById(`action-${order.id}`);
            action.append(refuseButton);
            refuseButton.addEventListener('click', async () => {
                await refuseRefund(order.id,"buy");
                refuseButton.remove();
            });
        }
    });
}

//将租用订单添加到列表
async function addHireShipList(){
    hireShipOrders = await getAll('hire');
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
            <td id = 'action-${order.id}'>
                <button onclick="handleRefundHireShipOrder(${order.id})" ${order.status === '已退款' ? 'disabled' : ''}>refund</button>
                <button onclick="deleteItem(${order.id},'hire','Orders')" >delete</button>
            </td>
        `;
        hireShipOrdersList.appendChild(row);
        if(order.status == '待审核'){
            // 创建确认按钮
            const refuseButton = document.createElement('button');
            refuseButton.textContent = 'refuse';
            const action = document.getElementById(`action-${order.id}`);
            action.append(refuseButton);
            refuseButton.addEventListener('click', async () => {
                await refuseRefund(order.id,"hire");
                refuseButton.remove();
            });
        }
        
    });
}

//将服务订单添加到列表
async function addServiceOrderList(){
    serviceOrders = await getAll('service_order');
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
            <td id = 'action-${order.id}'>
                <button onclick="handleRefundServiceOrder(${order.id})" ${order.status === '已退款' ? 'disabled' : ''}>refund</button>
                <button onclick="deleteItem(${order.id},'service_order','Orders')">delete</button>
            </td>
        `;
        serviceOrdersList.appendChild(row);
        if(order.status == '待审核'){
            // 创建确认按钮
            const refuseButton = document.createElement('button');
            refuseButton.textContent = 'refuse';
            const action = document.getElementById(`action-${order.id}`);
            action.append(refuseButton);
            refuseButton.addEventListener('click', async () => {
                await refuseRefund(order.id,"service_order");
                refuseButton.remove();
            });
        }
    });
}

// 将服务添加到列表
async function addServiceList() {
    service = await getAll('service');
    console.log(service); 
    // 显示所有服务
    const serviceList = document.getElementById('serviceList');
    serviceList.innerHTML = '';
    service.forEach(order => {
        const tmpurl = "." + order.imgurl
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.name}</td>
            <td>
                <img src= ${tmpurl} >
            </td>
            <td>${order.price}</td>
            <td>${order.nums}</td>
        `;
        // 添加修改按钮
        const actionCell = row.insertCell();
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => { editButton.disabled = true;editService(order,row)});
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => deleteItem(order.id,"service","Service"));
        actionCell.appendChild(editButton);
        actionCell.appendChild(deleteButton);
        usersContainer.appendChild(row);
        serviceList.appendChild(row);
    });
}

//添加服务
function addService(){
    // 创建新的行和单元格
    const row = serviceContainer.insertRow();
    const idCell = row.insertCell();
    const nameCell = row.insertCell();
    const imgCell = row.insertCell();
    const priceCell = row.insertCell();
    const numsCell = row.insertCell();
    const actionCell = row.insertCell();

    // 创建输入框
    const nameInput = document.createElement('input');
    const priceInput = document.createElement('input');
    const numsInput = document.createElement('input');
    const imgSelect = document.createElement('input');

    // 设置输入框的类型
    nameInput.type = 'text';
    priceInput.type = 'int';
    numsInput.type = 'int';
    imgSelect.type = 'file';
    imgSelect.accept = 'image/*';

    // 将输入框添加到单元格
    nameCell.appendChild(nameInput);
    priceCell.appendChild(priceInput);
    numsCell.appendChild(numsInput);
    imgCell.appendChild(imgSelect);

    // 创建取消按钮
    const cancelButton = document.createElement('button');
    cancelButton.textContent = 'abort';
    cancelButton.addEventListener('click', () => {
        // 删除当前行
        serviceContainer.deleteRow(row.rowIndex-1);
    });

    // 创建确认按钮
    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'sure';
    confirmButton.addEventListener('click', () => {
        // 获取输入框中的值
        const name = nameInput.value;
        const price = priceInput.value;
        const nums = numsInput.value;
        const img = imgSelect.files[0];


        // 创建一个新的FormData对象
        const formData = new FormData();

        // 将图片添加到FormData对象中
        formData.append('img', img);

        // 发送请求到服务器
        fetch('http://127.0.0.1:3000/api/uploadImg', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // 服务器返回的数据中应该包含图片的URL
            const imgurl = data.imgurl;

            // 创建游艇对象
            const service = {
                name: name,
                imgurl: imgurl,
                price: price,
                nums: nums
            };

            // 发送请求到服务器
            fetch('http://127.0.0.1:3000/api/addService', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify(service)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // 删除当前行
                serviceContainer.deleteRow(row.rowIndex-1);
                // 重新获取游艇列表
                addServiceList();
            })
            .catch(error => {
                console.error('Error:', error);
            }); 
        })
        .catch(error => {
            console.error('Error:', error);
        });
    });
    
    // 将确认按钮添加到单元格
    actionCell.appendChild(confirmButton);
    // 将取消按钮添加到单元格
    actionCell.appendChild(cancelButton);
}

//修改服务项目
async function editService(service, row){
    // 创建输入框
    const nameInput = document.createElement('input');
    const priceInput = document.createElement('input');
    const numsInput = document.createElement('input');
    nameInput.type = 'text';
    priceInput.type = 'int';
    numsInput.type = 'int';
    //创建图片选择器
    const imgSelect = document.createElement('input');
    imgSelect.type = 'file';
    imgSelect.accept = 'image/*';
    // 设置输入框的初始值
    nameInput.value = service.name;
    priceInput.value = service.price;
    numsInput.value = service.nums;

    row.cells[1].textContent = '';
    row.cells[1].appendChild(nameInput);
    row.cells[2].textContent = '如无需修改图片，则不必修改此项目';
    row.cells[2].appendChild(imgSelect);
    row.cells[3].textContent = '';
    row.cells[3].appendChild(priceInput);
    row.cells[4].textContent = '';
    row.cells[4].appendChild(numsInput);

    // 创建确认按钮
    const confirmButton = document.createElement('button');
    confirmButton.textContent = 'sure';
    confirmButton.id = 'confirmButton';
    confirmButton.addEventListener('click', async () => {
        // 获取输入框中的值
        const name = nameInput.value;
        const nums = numsInput.value;
        const price = priceInput.value;
        // 更新ship对象
        service.name = name;
        service.nums = nums;
        service.price = price;
        //更改图片
        if(imgSelect.value){
            //先删除原有的图片
            await fetch('http://127.0.0.1:3000/api/deleteImg', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(service)
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
            });

            const img = imgSelect.files[0];

            // 创建一个新的FormData对象
            const formData = new FormData();
    
            // 将图片添加到FormData对象中
            formData.append('img', img);
    
            // 发送请求到服务器
            await fetch('http://127.0.0.1:3000/api/uploadImg', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // 服务器返回的数据中应该包含图片的URL
                const imgurl = data.imgurl;
                service.imgurl = imgurl;
            });
        }
    
        // 发送更新请求到服务器
        fetch('http://127.0.0.1:3000/api/editService', {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify(service)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // 重新获取服务列表
            addServiceList();
        })
        .catch(error => {
            console.error('Error:', error);
        }); 
    })
    row.cells[row.cells.length - 1].appendChild(confirmButton);
}

//搜索订单
async function searchOrders(event) {
    if(event){
        event.preventDefault();
    }
    // 获取输入框的值
    const userId = document.getElementById('userId').value;
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    const type = document.getElementById('orderType').value;
    console.log(type)
    // 隐藏所有内容区域
    const allContents = document.querySelectorAll('.content');
    allContents.forEach(content => {
        content.classList.remove('active');
    });
    // 显示选中标签对应的内容
    const selectedContent = document.getElementById('searchOrders');
    const selectedContent_orders = document.getElementById(type + 'Orders');
    if (selectedContent) {
        console.log(selectedContent);
        selectedContent_orders.classList.add('active');
        selectedContent.classList.add('active');
    }
    // 显示购买订单
    if(type == 'buy' || type == null){
        buyShipOrders = await getAll('buy');
        // 根据username和Date来筛选数据
        buyShipOrders = buyShipOrders.filter(order => {
            var orderDate = new Date(order.time);
            const year = orderDate.getFullYear();
            const month = orderDate.getMonth() + 1; 
            const date = orderDate.getDate();
            orderDate = `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
            console.log(orderDate)
            var start = startDate;
            var end = endDate;
        
            if(!start){
                start = '1900-01-01';
            }
            if(!end){
                end = '9999-12-31';
            }
            // 如果userId为null，则按照日期筛选
            if(!userId) {
                return orderDate >= start && orderDate <= end;
            }
            else{
                return order.userId == userId && orderDate >= start && orderDate <= end;
            }
        });
        console.log(buyShipOrders);
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
                <td id = 'action-${order.id}'>
                    <button onclick="handleRefundShipOrder(${order.id})" ${order.status === '已退款' ? 'disabled' : ''}>refund</button>
                    <button onclick="deleteItem(${order.id},'buy','Orders')" >delete</button>
                </td>
            `;
            buyShipOrdersList.appendChild(row);
            if(order.status == '待审核'){
                // 创建确认按钮
                const refuseButton = document.createElement('button');
                refuseButton.textContent = 'refuse';
                const action = document.getElementById(`action-${order.id}`);
                action.append(refuseButton);
                refuseButton.addEventListener('click', async () => {
                    await refuseRefund(order.id,"buy");
                    refuseButton.remove();
                });
            }
        });
    }
    // 显示租用订单
    if(type == 'hire'){
        hireShipOrders = await getAll('hire');
        // 根据username和Date来筛选数据
        hireShipOrders = hireShipOrders.filter(order => {
            var orderDate = new Date(order.time);
            const year = orderDate.getFullYear();
            const month = orderDate.getMonth() + 1; 
            const date = orderDate.getDate();
            orderDate = `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
            console.log(orderDate)
            var start = startDate;
            var end = endDate;
        
            if(!start){
                start = '1900-01-01';
            }
            if(!end){
                end = '9999-12-31';
            }
            // 如果userId为null，则按照日期筛选
            if(!userId) {
                return orderDate >= start && orderDate <= end;
            }
            else{
                return order.userId == userId && orderDate >= start && orderDate <= end;
            }
        });
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
                <td id = 'action-${order.id}'>
                    <button onclick="handleRefundHireShipOrder(${order.id})" ${order.status === '已退款' ? 'disabled' : ''}>refund</button>
                    <button onclick="deleteItem(${order.id},'hire','Orders')" >delete</button>
                </td>
            `;
            hireShipOrdersList.appendChild(row);
            if(order.status == '待审核'){
                // 创建确认按钮
                const refuseButton = document.createElement('button');
                refuseButton.textContent = 'refuse';
                const action = document.getElementById(`action-${order.id}`);
                action.append(refuseButton);
                refuseButton.addEventListener('click', async () => {
                    await refuseRefund(order.id,"hire");
                    refuseButton.remove();
                });
            }
        });
    }
    // 显示服务订单
    if(type == 'service'){
        serviceOrders = await getAll('service_order');
        // 根据username和Date来筛选数据
        serviceOrders = serviceOrders.filter(order => {
            var orderDate = new Date(order.time);
            const year = orderDate.getFullYear();
            const month = orderDate.getMonth() + 1; 
            const date = orderDate.getDate();
            orderDate = `${year}-${month.toString().padStart(2, '0')}-${date.toString().padStart(2, '0')}`;
            console.log(orderDate)
            var start = startDate;
            var end = endDate;
        
            if(!start){
                start = '1900-01-01';
            }
            if(!end){
                end = '9999-12-31';
            }
            // 如果userId为null，则按照日期筛选
            if(!userId) {
                return orderDate >= start && orderDate <= end;
            }
            else{
                return order.userId == userId && orderDate >= start && orderDate <= end;
            }
        });
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
                <td id = 'action-${order.id}'>
                    <button onclick="handleRefundServiceOrder(${order.id})" ${order.status === '已退款' ? 'disabled' : ''}>refund</button>
                    <button onclick="deleteItem(${order.id},'service_order','Orders')">delete</button>
                </td>
            `;
            serviceOrdersList.appendChild(row);
            if(order.status == '待审核'){
                // 创建确认按钮
                const refuseButton = document.createElement('button');
                refuseButton.textContent = 'refuse';
                const action = document.getElementById(`action-${order.id}`);
                action.append(refuseButton);
                refuseButton.addEventListener('click', async () => {
                    await refuseRefund(order.id,"service_order");
                    refuseButton.remove();
                });
            }
        });
    }
}

// 点击显示用户管理页面
function showUsers(){
    // 隐藏所有内容区域
    const allContents = document.querySelectorAll('.content');
    allContents.forEach(content => {
        content.classList.remove('active');
    });
    addUsersList();
    // 显示选中标签对应的内容
    const selectedContent = document.getElementById('users');
    if (selectedContent) {
        console.log(selectedContent);
        selectedContent.classList.add('active');
    }
}

// 点击显示游艇管理页面
function showShips() {
    // 隐藏所有内容区域
    const allContents = document.querySelectorAll('.content');
    allContents.forEach(content => {
        content.classList.remove('active');
    });
    addShipsList();
    // 显示选中标签对应的内容
    const selectedContent = document.getElementById('ships');
    if (selectedContent) {
        console.log(selectedContent);
        selectedContent.classList.add('active');
    }
}

// 点击显示服务页面
function showService(){
    // 隐藏所有内容区域
    const allContents = document.querySelectorAll('.content');
    allContents.forEach(content => {
        content.classList.remove('active');
    });
    addServiceList();
    // 显示选中标签对应的内容
    const selectedContent = document.getElementById('service');
    if (selectedContent) {
        selectedContent.classList.add('active');
    }
}

// 点击显示搜索订单页面
function showSearchOrders(){
    // 隐藏所有内容区域
    const allContents = document.querySelectorAll('.content');
    allContents.forEach(content => {
        content.classList.remove('active');
    });
    addBuyShipList();
    // 显示选中标签对应的内容
    const selectedContent = document.getElementById('searchOrders');
    const selectedContent_buyOrders = document.getElementById('buyOrders');
    if (selectedContent) {
        console.log(selectedContent);
        selectedContent_buyOrders.classList.add('active');
        selectedContent.classList.add('active');
    }
}

//备份订单
async function backupOrders(){
    const buyOrders = await getAll("buy"); 
    const hireOrders = await getAll("hire"); 
    const serviceOrders = await getAll("service_order");

    const allOrders = {
        buyOrders,
        hireOrders,
        serviceOrders
    };

    const jsonStr = JSON.stringify(allOrders,null,2);
    const blob = new Blob([jsonStr], {type: "application/json"});
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'orders_backup.json';
    link.click();

}