const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const PORT = 3000;

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "user_db"
});

app.use(express.urlencoded({extended: true}));

app.use(bodyParser.json());

app.use(cors());

app.use(express.static('public'));

app.get("/", (req,res) => {
    res.sendFile(__dirname+'/signup.html');
});

app.get('/login', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});
 
app.post('/user-login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const query = `SELECT email FROM user_info WHERE email = '${email}' and password='${password}';`;

    db.query(query, function (err, result) {
        if (err) {
            res.status(400);
            res.json({
                error: "Error in login, please try again later",
            });
        } else {
            if (result.length === 0) {
                res.status(400);
                res.json({
                    error: "Email or password is incorrect",
                });
            } else {
                res.status(200);
                res.json({
                    email: result[0].email,
                });

            } 
            }
        }
    )});



app.get("/profile", (req,res) => {
    res.sendFile(__dirname+'/profile.html');
});

app.post('/get-user-info', function (req, res) {
    const email = req.body.email;

    const query = `SELECT * FROM user_info WHERE email = '${email}';`;
    db.query(query, function (err, result) {
        if (err) {
            res.status(400);
            res.json({
                error: "Failed to get user info",
            });
        } else {
            res.status(200);
            res.json({
                user: result[0],
            });
        }
    });
});

app.post("/register", (req,res) => {

    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const gender = req.body.gender;
    const dob = req.body.dob;
    const email = req.body.email;
    const password = req.body.password;
    const retype_password = req.body.retype_password;

    if(password!= retype_password)
        { res.status(400);
        return res.send("Password incorrect"); }
    
   db.connect((error) => {
        if(error) throw error;
    })
const sql = "INSERT INTO user_info(first_name,last_name,gender,dob,email,password,retype_password) VALUES(?,?,?,?,?,?,?)";
    
    db.query(sql, [first_name,last_name,gender,dob,email,password,retype_password], (error, result) => {
        if(error) throw error
        else {
            res.status(200);
            res.json({
                result:"success",
            });
        }
    })
});

app.post('/update', function (req, res) {
    const user = {
    first_name : req.body.first_name,
     last_name : req.body.last_name,
     gender : req.body.gender,
     dob : req.body.dob,
     email : req.body.email,
     password : req.body.password,
    };

    console.log(user);
    const query = `
    UPDATE user_info 
    SET first_name = '${user.first_name}', last_name = '${user.last_name}', gender = '${user.gender}', email = '${user.email}', dob = '${user.dob}', password = '${user.password}'
    WHERE email = '${user.email}';
  `;

    db.query(query, function (err, result) {
        console.log(err,result);
            if (err) {
                res.json({
                    error: err,
                })
            } else {
                res.json({
                    success:true,
                })
            }
        })
    });

app.post('/delete', function (req, res) {
    const email = req.body.email;

    const query = `Delete FROM user_info WHERE email = '${email}';`;
    db.query(query, function (err, result) {
        if (err) {
            res.status(400);
            res.json({
                error: "Failed to delete account",
            });
        } else {
            res.status(200);
            res.json({
               success:true
            });
        }
    });
});



app.listen(PORT, () => {
    console.log(`server is running at http://localhost:${PORT}`);
});