const express = require('express');
const auth = require('./auth');
const router = express.Router();
const verifikasi = require('./verification');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        cb(null,'./uploads/images');
    },
    filename: (req,file,cb)=>{
        cb(null,new Date().toISOString()+'-'+ file.originalname);
    }
});

const fileFilter = (req,file,cb)=>{
    if (file.mimetype === 'image/jpeg'|| file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null,true);
    }else{
        cb(null,false);
    }
}
const upload = multer({
    storage: storage, 
    limits:{
    fileSize: 1024 * 1024 * 5
    },
    fileFilter: fileFilter
});

router.post('/auth/register',upload.single('photo'),auth.registrasi);
router.post('/auth/login', auth.login); 

//perlu otorisasi
router.get('/rahasia',verifikasi(), auth.halamanrahasia);

module.exports = router;