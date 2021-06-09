let connection = require('../db/koneksi');
let mysql = require('mysql');
let md5 = require('md5');
let response = require('../res');
let jwt = require('jsonwebtoken');
let config = require('../config/secret');
let ip = require('ip');

//controller untuk register
exports.registrasi = (req,res) =>{
    let post = {
        username: req.body.username,
        email: req.body.email,
        password: md5(req.body.password),
        role:req.body.role,
        tanggal_daftar: new Date()
    }

    let queryCekemail = "SELECT email FROM ?? WHERE ??=?";
    let table = ["user","email",post.email];

    queryCekemail = mysql.format(queryCekemail,table);

    connection.query(queryCekemail, (error,rows)=>{
        if (error) {
            response.err(error,res);
        }else{
            if (rows.length == 0) {
                let queryInsert = "INSERT INTO ?? SET ?";
                let table = ["user"];
                queryInsert = mysql.format(queryInsert,table);
                connection.query(queryInsert, post, (error,rows)=>{
                    if (error) {
                        response.err(error,res);
                    }else{
                        response.ok("Berhasil menambahkan user baru", res)
                    }
                });
            }else{
                response.ok("Email sudah terdaftar",res);
            }
        }
    })
}

//controler login
exports.login = (req,res) =>{
    let post ={
        password: req.body.password,
        email: req.body.email
    }

    let queryLogin = "SELECT * FROM ?? WHERE ??=? AND ??=?";
    let table = ["user","password",md5(post.password),"email",post.email];

    queryLogin = mysql.format(queryLogin,table);
    connection.query(queryLogin, (error, rows)=>{
        if (error) {
            response.err(error,res);
        }else{
            if (rows.length == 1) {
                let token = jwt.sign({rows},config.secret,{
                    expiresIn:1440
                });

                let data = {
                    id_user:rows[0].id,
                    access_token: token,
                    ip_address: ip.address()
                }

                let queryTokeninsert = "INSERT INTO ?? SET ?";
                let table = ["akses_token"];

                queryTokeninsert = mysql.format(queryTokeninsert,table);
                connection.query(queryTokeninsert,data,(error,rows)=>{
                    if (error) {
                        response.err(error,res);
                    }else{
                         res.json({
                             success:true,
                             messages:'Login Berhasil',
                             token:token,
                             currUser: data.id_user
                         });
                    }
                });
            }else{
                 res.json({
                     "Error":true,
                     "Message":"Email atau Password Salah!"
                 });
            }
        }
    })
}

exports.halamanrahasia = (req,res)=>{
    response.ok("ini untuk role 2",res);
}