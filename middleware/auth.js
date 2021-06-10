let md5 = require('md5');
let response = require('../res');
let jwt = require('jsonwebtoken');
let config = require('../config/secret');
let ip = require('ip');
let knex = require('../db/koneksi-knex');

//controller untuk register
exports.registrasi = async (req,res) =>{
    try {
        let post = {
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
                response.ok("Berhasil menambahkan user baru", res)
            }else{
                response.err("Gagal menambahkan user",res);
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
                access_token: token,
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