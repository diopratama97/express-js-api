const express = require('express');
const auth = require('./auth');
const router = express.Router();
const verifikasi = require('./verification');

router.post('/api/register',auth.registrasi);
router.post('/api/login', auth.login); 

//perlu otorisasi
router.get('/api/rahasia',verifikasi(), auth.halamanrahasia);

module.exports = router;