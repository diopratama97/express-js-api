'use strict';

let response = require('../res');
let connection = require('../db/koneksi');

exports.index = (req,res) => {
    response.ok("SERVER BERJALAN!",res);
}