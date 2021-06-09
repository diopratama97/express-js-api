const express = require('express');
const auth = require('./auth');
const router = express.Router();
const verifikasi = require('./verification');

router.post('/api/v1/register',auth.registrasi);
router.post('/api/v1/login', auth.login); 

//perlu otorisasi
router.get('/api/v1/rahasia',verifikasi(), auth.halamanrahasia);

module.exports = router;