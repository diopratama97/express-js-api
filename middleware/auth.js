let md5 = require('md5');
let response = require('../res');
let jwt = require('jsonwebtoken');
let config = require('../config/secret');
let ip = require('ip');
let knex = require('../db/koneksi-knex');
const { v4: uuidv4 } = require('uuid');
const nodemailer = require("nodemailer");

//controller untuk register
exports.registrasi = async (req,res) =>{
    try {
        let post = {
            id: uuidv4(),
            username: req.body.username,
            email: req.body.email,
            password: md5(req.body.password),
            role:req.body.role,
            tanggal_daftar: new Date()
        }
    
        let queryCekemail = await knex('user').select('email').where('email',post.email).first();
        if (!queryCekemail) {
            const queryInsert = await knex('user').insert(post);
            if (queryInsert) {
                  // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true, // true for 465, false for other ports
                    auth: {
                    user: 'lagimakan92@gmail.com', // generated ethereal user
                    pass: 'password', // generated ethereal password
                    },
                });

                  // send mail with defined transport object
                let info = await transporter.sendMail({
                    from: '"Express-js-api 👻" <lagimakan92@gmail.com>', // sender address
                    to: post.email, // list of receivers
                    subject: "Hello ✔", // Subject line
                    text: "Hello world?", // plain text body
                    html: "<b>Hello world?</b>", // html body
                });

                response.ok("Registrasi Berhasil", res)
            }else{
                response.err("Registrasi gagal!",res);
            }
        }else{
            response.duplikat("Data sudah tersedia",res);
        }
    } catch (error) {
        response.err(error,res);
    }
}

//controler login
exports.login = async (req,res) =>{
    try {
        const queryLogin = await knex('user').select('id')
        .where('email',req.body.email)
        .andWhere('password',md5(req.body.password)).first();
        
        if (!queryLogin) {
            response.errLogin('Email atau Password Salah!',res);
        }else{
            let token = jwt.sign({queryLogin},config.secret,{
                expiresIn:30
            });

            let data = {
                id_user:queryLogin.id,
                //access_token: token,
                ip_address: ip.address()
            }

            const queryTokeninsert = await knex('akses_token').insert(data);
            if (queryTokeninsert) {
                response.Login(token,data.id_user,res);
            }else{
                response.err('Gagal insert token',res);
            }
        }
    } catch (error) {
        response.err(error,res);
    }
}

exports.halamanrahasia = (req,res)=>{
    response.ok("ini untuk role 2",res);
}