'use strict';

let response = require('../res');
let knex = require('../db/koneksi-knex');

//get all 
exports.getAllMahasiswa = async (req,res) => {
    try {
        let allMahasiswa = await knex('mahasiswa').select('*');
        response.ok(allMahasiswa,res);
    } catch (error) {
        response.err(error,res);
    }
}

//get one
exports.getOneMahasiswa = async (req,res) => {
    try {
        let id = req.params.id;
        let getOne = await knex('mahasiswa').select('*').where('id',id).first();
        response.ok(getOne,res);
    } catch (error) {
        response.err(error,res);
    }
}

//post data
exports.addMahasiswa = async (req,res) => {
    try {
        const {nim,nama,jurusan} = req.body;
        const insertMahasiswa = {
            nim : nim,
            nama: nama,
            jurusan: jurusan
        }
        const exe = await knex('mahasiswa').insert(insertMahasiswa);
        if (exe) {
            response.ok('INSERT SUCCESS',res);
        }
    } catch (error) {
        response.err(error,res);
    }
}

//update data 
exports.updateMahasiswa = async (req,res) => {
    try {
        const id = req.params.id;
        const {nim,nama,jurusan} = req.body;

        const updateMahasiswa = {
            nim: nim,
            nama: nama,
            jurusan: jurusan
        }

        const exe = await knex('mahasiswa').update(updateMahasiswa).where('id',id);
        if (exe) {
            response.ok('UPDATE SUCCESS',res)
        }
    } catch (error) {
        response.err(error,res);
    }
}

exports.deleteMahasiswa = async (req,res) => {
    try {
        const id = req.params.id;
        const deleteMahasiswa = await knex('mahasiswa').where('id',id).del();
        if (deleteMahasiswa) {
            response.ok('DELETE SUCCESS',res);
        }
    } catch (error) {
        response.err(error,res);
    }
}

//tampil matakuliah nested json object
exports.getGroupMatakuliah = async (reg,res) => {
    try {
        const groupMatakuliah = await knex('krs').leftJoin('matakuliah as mk','mk.id','krs.id_matakuliah')
        .leftJoin('mahasiswa as mhs','mhs.id','krs.id_mahasiswa')
        .select('mhs.*','mk.matakuliah','mk.sks')
        .groupBy('mhs.id')
        response.nested(groupMatakuliah,res);
    } catch (error) {
        response.err(error,res);
    }
}