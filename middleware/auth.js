let md5 = require('md5');
let response = require('../res');
let jwt = require('jsonwebtoken');
let config = require('../config/secret');
let knex = require('../db/koneksi-knex');
const { v4: uuidv4 } = require('uuid');
const {transporter} = require('../config/transporter-email');
const {login,register} = require('../helper/validation');

//controller untuk register
exports.registrasi = async (req,res) =>{
    try {
        const data = await register.validateAsync(req.body);
        let post = {
            id: uuidv4(),
            username: data.username,
            email: data.email,
            password: md5(data.password),
            role:data.role,
            tanggal_daftar: new Date()
        }
    
        let queryCekemail = await knex('user').select('email').where('email',post.email).first();
        if (!queryCekemail) {
            const queryInsert = await knex('user').insert(post);
            if (queryInsert) {
                  // send mail 
                let info = await transporter.sendMail({
                    from: '"Express-js-api 👻" <lagimakan92@gmail.com>', 
                    to: post.email, 
                    subject: "Hello ✔", 
                    text: "Hello world?", 
                    html: "<b>Hello world?</b>",
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
        const data = await login.validateAsync(req.body);
        
        const queryLogin = await knex('user').select('id')
        .where('email',data.email)
        .andWhere('password',md5(data.password)).first();
        
        if (!queryLogin) {
            response.errLogin('Email atau Password Salah!',res);
        }else{
            let token = jwt.sign({queryLogin},config.secret,{
                expiresIn:30
            });
            response.Login(token,queryLogin.id_user,res);
        }
    } catch (error) {
        response.err(error,res);
    }
}

exports.halamanrahasia = (req,res)=>{
    response.ok("ini untuk role 2",res);
}