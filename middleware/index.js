const express = require('express');
const auth = require('./auth');
const router = express.Router();
const verifikasi = require('./verification');

router.post('/auth/register',auth.registrasi);
router.post('/auth/login', auth.login); 

//perlu otorisasi
router.get('/rahasia',verifikasi(), auth.halamanrahasia);

module.exports = router;