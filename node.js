const express = require('express')
const cors = require('cors')
const app = express();
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const moment = require('moment');
const nodemalier = require('nodemailer');
const randomstring = require('randomstring');
const { error } = require('console');
const cron = require('cron');
const mysqldump = require('mysqldump');

app.use(express.json())
app.use(cors())





//邮件模块
var transporter = nodemalier.createTransport({
    host: 'smtp.163.com',
    secureConnection: true,
    port: 465,
    secure: true,
    auth:{
        user: '1234@163.com',
        pass: '1234'
    }
});

// 设置数据库连接参数
const config = {
    connection: {
        host: '127.0.0.1',
        user: 'ship',
        password: '1234',
        database: 'ship',
    },
    dumpToFile: './backup.sql', // 设置备份文件路径
};

//创建连接池
const  pool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'ship',
    password: '1234',
    database: 'ship',
});

// 每1分钟执行一次的定时任务,删除无效的记录
const job = new cron.CronJob('0 * * * * *', () => {
    const sql = `DELETE FROM users WHERE isverified = 0 AND TIMESTAMPDIFF(MINUTE, time, NOW()) > 15 or time is NULL and isverified = 0`;
    pool.query(sql, (error, results) => {
        if (error) {
            console.error(error);
        }
    });
});

//每天备份一次
const job2 = new cron.CronJob('0 40 23 * * *', () => {
    mysqldump(config).then(output => {
        fs.writeFileSync(config.dumpToFile,output.dump);
        console.log('数据库备份成功');
    })
    .catch(error => {
    });
});

job.start();
job2.start();

// 设置图片存储位置和文件名
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './images')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
    }
})

const upload = multer({ storage: storage });
  
//返回全表
app.post('/api/getAll', (req, res) => {
    let type = req.body.type;
    const sql = `SELECT * FROM ${type}`; 
    pool.query(sql,(error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log(results);
        res.json(results);
    });
});

//返回特定 根据userId
app.post('/api/getSpecific', (req, res) => {
    let type = req.body.type;
    let id = req.body.id;
    const sql = `SELECT * FROM ${type} where userId = ${id}`; 
    pool.query(sql,(error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log(results);
        res.json(results);
    });
});

//验证
app.post('/api/verify', (req, res) => {
    const data = req.body;
    pool.query('select * from users where username = ?',[data.username], (error,results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        if(results.length != 0){
            if(results[0].verification_code == data.verification_code){
                pool.query('update users set isverified = ? where username = ?',[1,data.username],(error,results) => {
                    if(error) {
                        console.error('error querying database',error);
                        res.json({status: false});
                    }
                    else{
                        pool.query('select id from users where username = ?',[data.username],(error,results) => {
                            if(error) {
                                console.error('error querying database',error);
                                res.json({status: false});
                            }
                            else{
                                res.json({status: true,id: results[0].id});
                            }
                        });
                    }
                });
            }
            else{
                res.json({status: false});
            }
        }
        else{
            res.json({status: false});
        }
    })
});

//发送密码
app.post('/api/sendPassword', (req, res) => {
    const data = req.body;
    pool.query('select * from users where username = ?',[data.username], (error,results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        //发送验证码
        if(results.length != 0){
            //发送
            var mailOptions = {
                from: 'buct255@163.com',
                to: results[0].email,
                subject: '找回密码',
                html:
                `
                <p>你的密码是：${results[0].password}</p>
                <br>
                <p>如果不是本人操作，请忽略</p>
                `
            }
            transporter.sendMail(mailOptions,(error,info) => {
                if(error){
                    console.log(error)
                }
                else{
                    console.log('发送成功',info.response)
                }
            })
            res.json({status: true});
        }
        else{
            res.json({status: false});
        }
    })
});

//注册 
app.post('/api/register', (req, res) => {
    const data = req.body;
    console.log(data.username);
    pool.query('select * from users where username = ?',[data.username], (error,results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        //发送验证码
        if(results.length == 0){
            //生成验证码
            const verification_code = randomstring.generate({
                length: 6,
                charset: 'numeric'
            });
            //预插入
            pool.query('insert into users (username,password,email,verification_code,isverified) values (?,?,?,?,?)',[data.username,data.password,data.email,verification_code,0],(error,results) => {
                if(error) {
                    console.error('error querying database',error);
                    res.json({status: false});
                }
            });
            //发送
            var mailOptions = {
                from: 'buct255@163.com',
                to: data.email,
                subject: '凯哥游艇俱乐部注册验证码',
                html:
                `
                <p>你的验证码是：${verification_code}</p>
                <br>
                <p>十五分钟内有效</p>
                `
            }
            transporter.sendMail(mailOptions,(error,info) => {
                if(error){
                    console.log(error)
                }
                else{
                    console.log('发送成功',info.response)
                }
            })
            res.json({status: true});
        }
        else{
            res.json({status: false});
        }
    })
});

//登陆
app.post('/api/login', (req, res) => {
    const data = req.body;
    pool.query('select * from users where username = ?',[data.username], (error,results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log(results);
        if(results.length == 0){
            res.json({status: false});
        }
        else{
            if(results[0].password != data.password || results[0].isverified == 0){
                res.json({status: false});
            }
            else{
                res.json({status: true,id:results[0].id});
            }
        }
    })
});

//修改密码
app.post('/api/changePassword', (req, res) => {
    pool.query('update users set password = ? where id = ?',[req.body.password,req.body.id], (error,results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log(results);
        res.json(results);
    })
});

//添加用户
app.post('/api/addUser', (req, res) => {
    const user = req.body;
    // 首先检查是否存在具有相同用户名的用户
    pool.query('SELECT * FROM users WHERE username = ?', [user.username], (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        // 如果存在具有相同用户名的用户，返回错误响应
        if (results.length > 0) {
            res.status(400).send('username already exists');
            return;
        }
        // 否则，添加新的用户
        pool.query('INSERT INTO users (username, password, grade,balance) VALUES (?, ?, ?,?)', [user.username, user.password, user.grade, user.balance], (error, results) => {
            if (error) {
                console.error('Error querying database:', error);
                res.status(500).send('Internal Server Error');
                return;
            }
            console.log(results);
            res.json(results);
        });
    });
});

// 修改用户
app.post('/api/editUser', (req, res) => {
    const user = req.body;
    // 更新用户信息
    pool.query('UPDATE users SET password = ?, grade = ?,balance = ? WHERE id = ?', [user.password, user.grade, user.balance,user.id], (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log(results);
        res.json(results);
    });
});

// 获取特定用户
app.post('/api/getUser', (req, res) => {
    const userId = req.body.id;
    pool.query('SELECT * FROM users WHERE id = ?', [userId], (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log(results);
        res.json(results);
    });
});

// 更新用户
app.post('/api/updateUser', (req, res) => {
    const user = req.body;
    // 更新用户信息
    if(user.email == ""){
        user.email = null;
    }
    if(user.name == ""){
        user.name = null;
    }
    if(user.age == ""){
        user.age = null;
    }
    if(user.sex == ""){
        user.sex = null;
    }
    pool.query('UPDATE users SET password = ?, email = ?, name = ?, age = ?, sex = ? WHERE id = ?', 
    [user.password, user.email, user.name, user.age, user.sex,user.id], 
    (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log(results);
        res.json(results);
    });
});

//获取用户余额
app.get('/api/getBalance', (req, res) => {
    const userId = req.query.userId;
    pool.query('SELECT balance FROM users WHERE id = ?', [userId], (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        if (results.length > 0) {
            res.json({ balance: results[0].balance });
        } else {
            res.status(404).send('User not found');
        }
    });
});

// 添加游艇
app.post('/api/addShip', (req, res) => {
    const ship = req.body;
    // 首先检查是否存在具有相同名称的游艇
    pool.query('SELECT * FROM ships WHERE shipname = ?', [ship.name], (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        // 如果存在具有相同名称的游艇，返回错误响应
        if (results.length > 0) {
            res.status(400).send('Ship name already exists');
            return;
        }
        // 否则，添加新的游艇
        pool.query('INSERT INTO ships (shipname,imgurl, buyPrice,hirePrice) VALUES (?, ?, ?, ?)', [ship.name,ship.imgurl,ship.buyPrice,ship.hirePrice], (error, results) => {
            if (error) {
                console.error('Error querying database:', error);
                res.status(500).send('Internal Server Error');
                return;
            }
            console.log(results);
            res.json(results);
        });
    });
});

// 修改游艇
app.post('/api/editShip', (req, res) => {
    const ship = req.body;
    // 更新游艇信息
    pool.query('UPDATE ships SET shipname = ?, imgurl = ?, buyPrice = ?, hirePrice = ?,status = ? WHERE id = ?', 
    [ship.shipname, ship.imgurl, ship.buyPrice,ship.hirePrice,ship.status, ship.id], 
    (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log(results);
        res.json(results);
    });
});

// 添加图片
app.post('/api/uploadImg', upload.single('img'), (req, res) => {
    // 返回文件路径
    res.json({imgurl: `./images/${req.file.filename}`});
});

// 删除图片
app.post('/api/deleteImg', (req, res) => {
    const imgurl = req.body.imgurl;
    if (fs.existsSync(imgurl)) {
        fs.unlink(imgurl, (err) => {
            if (err) {
                console.error('Error deleting image:', err);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.json({status: true});
        });
    } else {
        res.json({status: false});
    }
});

//购买游艇
app.post('/api/buy', (req, res) => {
    const userId = req.body.userId;
    const shipId = req.body.shipId;
    const buyPrice = req.body.buyPrice;
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');

    // 从用户的余额中扣除游艇的价格
    pool.query('UPDATE users SET balance = balance - ? WHERE id = ?', [buyPrice, userId], (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
    });
    // 将游艇的状态设置为0
    pool.query('UPDATE ships SET status = 0 WHERE id = ?', [shipId], (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
    });
    //更新buy表
    pool.query('INSERT INTO buy (userId, shipId, time, money,status) VALUES (?, ?, ?, ?,?)', [userId, shipId, currentTime, buyPrice,'正常'], (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json({status: true});
    });
});

//购买游艇退款
app.post('/api/refundShipOrder', (req, res) => {
    const orderId = req.body.id;

    // 获取订单信息
    pool.query('SELECT * FROM buy WHERE id = ?', [orderId], (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (results.length > 0) {
            const order = results[0];
            const userId = order.userId;
            const shipId = order.shipId;
            const buyPrice = order.money;

            // 将购买价格退还给用户
            pool.query('UPDATE users SET balance = balance + ? WHERE id = ?', [buyPrice, userId], (error, results) => {
                if (error) {
                    console.error('Error querying database:', error);
                    res.status(500).send('Internal Server Error');
                    return;
                }
            });

            // 将游艇的状态设置为1
            pool.query('UPDATE ships SET status = 1 WHERE id = ?', [shipId], (error, results) => {
                if (error) {
                    console.error('Error querying database:', error);
                    res.status(500).send('Internal Server Error');
                    return;
                }
            });

            // 订单设置为已退款
            pool.query('UPDATE buy set status = ? WHERE id = ? ', ['已退款',orderId], (error, results) => {
                if (error) {
                    console.error('Error querying database:', error);
                    res.status(500).send('Internal Server Error');
                    return;
                }
                res.json({status: true});
            });
        } else {
            res.status(404).send('Order not found');
        }
    });
});

//获取游艇的租用日期
app.get('/api/getShipHiredDate', (req, res) => {
    const shipId = req.query.shipId;
    pool.query('SELECT startDate,days FROM hire where shipId = ? and status = ? ',[shipId,"正常"], (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json(results);
    });
});

//添加租用记录
app.post('/api/uploadShipHireMessage', (req, res) => {
    const time = moment().format('YYYY-MM-DD HH:mm:ss');
    const { shipId, days, startDate, userId, money} = req.body;
    console.log(startDate);
    pool.query('INSERT INTO hire (shipId, days, startDate,userId,money,time) VALUES (?, ?, ?, ?, ?, ?)',[shipId, days, startDate, userId, money, time], (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        //扣款
        pool.query('UPDATE users SET balance = balance - ? WHERE id = ?', [money, userId], (error, results) => {
            if (error) {
                console.error('Error querying database:', error);
                res.status(500).send('Internal Server Error');
                return;
            }
            res.json(results);
        });
    });
});

//租用游艇退款
app.post('/api/refundHireShipOrder', (req, res) => {
    const orderId = req.body.id;

    // 获取订单信息
    pool.query('SELECT * FROM hire WHERE id = ?', [orderId], (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (results.length > 0) {
            const order = results[0];
            const userId = order.userId;
            const shipId = order.shipId;
            const money = order.money;

            // 将购买价格退还给用户
            pool.query('UPDATE users SET balance = balance + ? WHERE id = ?', [money, userId], (error, results) => {
                if (error) {
                    console.error('Error querying database:', error);
                    res.status(500).send('Internal Server Error');
                    return;
                }
            });

            // 将游艇的状态设置为1
            pool.query('UPDATE ships SET status = 1 WHERE id = ?', [shipId], (error, results) => {
                if (error) {
                    console.error('Error querying database:', error);
                    res.status(500).send('Internal Server Error');
                    return;
                }
            });

            // 订单设置为已退款
            pool.query('UPDATE hire set status = ? WHERE id = ? ', ['已退款',orderId], (error, results) => {
                if (error) {
                    console.error('Error querying database:', error);
                    res.status(500).send('Internal Server Error');
                    return;
                }
                res.json({status: true});
            });
        } else {
            res.status(404).send('Order not found');
        }
    });
});

// 删除
app.post('/api/deleteItem', (req, res) => {
    const id = req.body.id;
    const type = req.body.type;
    const sql = `DELETE FROM ${type} WHERE id = ${id}`; 
    pool.query(sql, (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log(results);
        res.json(results);
    });
});

// 添加服务
app.post('/api/addService', (req, res) => {
    const service = req.body;
    // 首先检查是否存在具有相同名称的服务
    pool.query('SELECT * FROM service WHERE name = ?', [service.name], (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        // 如果存在具有相同名称的服务，返回错误响应
        if (results.length > 0) {
            res.status(400).send('Ship name already exists');
            return;
        }
        // 否则，添加新的服务
        pool.query('INSERT INTO service (name, imgurl, price, nums) VALUES (?, ?, ?, ?)', [service.name,service.imgurl,service.price,service.nums], (error, results) => {
            if (error) {
                console.error('Error querying database:', error);
                res.status(500).send('Internal Server Error');
                return;
            }
            console.log(results);
            res.json(results);
        });
    });
});

//修改服务
app.post('/api/editService', (req, res) => {
    const service = req.body;
    // 更新游艇信息
    pool.query('UPDATE service SET name = ?, imgurl = ?, price = ?, nums = ? WHERE id = ?', 
    [service.name, service.imgurl, service.price, service.nums, service.id], 
    (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        console.log(results);
        res.json(results);
    });
});

//购买服务
app.post('/api/buyService', (req, res) => {
    const userId = req.body.userId;
    const serviceId = req.body.serviceId;
    const price = req.body.price;
    const currentTime = moment().format('YYYY-MM-DD HH:mm:ss');

    // 从用户的余额中扣除服务的价格
    pool.query('UPDATE users SET balance = balance - ? WHERE id = ?', [price, userId], (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
    });

    // 将服务的数量减1
    pool.query('UPDATE service SET nums = nums - 1 WHERE id = ?', [serviceId], (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
    });
    //更新service_order表
    pool.query('INSERT INTO service_order (userId, serviceId, time, money) VALUES (?, ?, ?, ?)', [userId, serviceId, currentTime, price], (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json({status: true});
    });
});

//购买服务退款
app.post('/api/refundServiceOrder', (req, res) => {
    const orderId = req.body.id;

    // 获取订单信息
    pool.query('SELECT * FROM service_order WHERE id = ?', [orderId], (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
            return;
        }

        if (results.length > 0) {
            const order = results[0];
            const userId = order.userId;
            const serviceId = order.serviceId;
            const money = order.money;

            // 将购买价格退还给用户
            pool.query('UPDATE users SET balance = balance + ? WHERE id = ?', [money, userId], (error, results) => {
                if (error) {
                    console.error('Error querying database:', error);
                    res.status(500).send('Internal Server Error');
                    return;
                }
            });

            // 将服务的数量加1
            pool.query('UPDATE service SET nums = nums + 1 WHERE id = ?', [serviceId], (error, results) => {
                if (error) {
                    console.error('Error querying database:', error);
                    res.status(500).send('Internal Server Error');
                    return;
                }
            });

            // 订单设置为已退款
            pool.query('UPDATE service_order set status = ? WHERE id = ? ', ['已退款',orderId], (error, results) => {
                if (error) {
                    console.error('Error querying database:', error);
                    res.status(500).send('Internal Server Error');
                    return;
                }
                res.json({status: true});
            });
        } else {
            res.status(404).send('Order not found');
        }
    });
});

//用户提交退款
app.post('/api/user_refund', (req, res) => {
    const orderId = req.body.id;
    const type = req.body.type;
    // 订单设置为待审核
    pool.query(`UPDATE ${type} set status = ? WHERE id = ? `, ['待审核',orderId], (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json({status: true});
    });
});

//管理员拒绝退款
app.post('/api/refuseRefund', (req, res) => {
    const orderId = req.body.id;
    const type = req.body.type;
    // 订单设置为待审核
    pool.query(`UPDATE ${type} set status = ? WHERE id = ? `, ['已拒绝',orderId], (error, results) => {
        if (error) {
            console.error('Error querying database:', error);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.json({status: true});
    });
});


const port = 3000;
const host = '127.0.0.1';

app.listen(port, host, () => {
    console.log(`Server running at http://${host}:${port}/`);
});
