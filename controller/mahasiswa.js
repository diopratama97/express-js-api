'use strict';

let response = require('../res');
let connection = require('../db/koneksi');

//get all 
exports.getAllMahasiswa = (req,res) => {
    connection.query('SELECT * FROM mahasiswa',(error,rows,fields)=>{
        if (error) {
            console.log(error);
        }else{
            response.ok(rows,res);
        }
    })
}

//get one
exports.getOneMahasiswa = (req,res) => {
    let id = req.params.id;
    connection.query('SELECT * FROM mahasiswa WHERE id = ?',[id],(error,rows,fields)=>{
        if (error) {
            console.log(error);
        }else{
            response.ok(rows,res);
        }
    })
}

//post data
exports.addMahasiswa = (req,res) => {
    const {nim,nama,jurusan} = req.body;

    connection.query('INSERT INTO mahasiswa (nim,nama,jurusan) VALUES(?,?,?)',[nim,nama,jurusan],
    (error,rows,fields)=> {
        if (error) {
            console.log(error);
        }else{
            response.ok('INSERT SUCCESS',res);
        }
    });
}

//update data 
exports.updateMahasiswa = (req,res) => {
    const id = req.params.id;
    const {nim,nama,jurusan} = req.body;

    connection.query('UPDATE mahasiswa SET nim=?,nama=?,jurusan=? WHERE id=?',[nim,nama,jurusan,id],
    (error,rows,fields)=>{
        if (error) {
            console.log(error);
        }else{
            response.ok('UPDATE SUCCESS',res)
        }
    })
}

exports.deleteMahasiswa = (req,res) => {
    const id = req.params.id;

    connection.query('DELETE FROM mahasiswa WHERE id=?',[id],(error,rows,fields)=>{
        if (error) {
            console.log(error);
        }else{
            response.ok('DELETE SUCCESS',res);
        }
    })
}

//tampil matakuliah nested json object
exports.getGroupMatakuliah = (reg,res) => {
    connection.query('SELECT mahasiswa.*,matakuliah.matakuliah,matakuliah.sks FROM krs JOIN matakuliah,mahasiswa WHERE krs.id_matakuliah=matakuliah.id AND krs.id_mahasiswa=mahasiswa.id ORDER BY mahasiswa.id',
    (error,rows,fields)=>{
        if (error) {
            console.log(error);
        }else{
            response.nested(rows,res);
        }
    })
}