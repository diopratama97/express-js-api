const jwt = require('jsonwebtoken');
const config = require('../config/secret');

function verification() {
    return function (req,rest,next) {
        //let role = req.body.role;
        //cek authorization header
        let tokenWithBearer = req.headers.authorization;
        if (tokenWithBearer) {
            let token = tokenWithBearer.split(' ')[1];
            //verifikasi
            jwt.verify(token,config.secret,(err,decoded)=>{
                if (err) {
                    return rest.status(401).send({
                        auth:false,
                        message: err
                    });
                }else{
                    // if (role==2) {
                        req.auth = decoded;
                        next();
                    // }else{
                    //     return rest.status(401).send({
                    //         auth: false,
                    //         message:"Gagal mengotorisasi role anda!"
                    //     });
                    // }
                }
            });
        }else{
            return rest.status(401).send({
                auth:false,
                message:"Token tidak tersedia"
            });
        }
    }
}
module.exports = verification;