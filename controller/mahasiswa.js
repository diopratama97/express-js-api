'use strict';

let response = require('../res');
let knex = require('../db/koneksi-knex');
const { v4: uuidv4 } = require('uuid');
const {hapus,getOne,insertMahasiswa,updateMahasiswa} = require('../helper/validation');

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
        const {id} = await getOne.validateAsync(req.params);
        //let id = req.params.id;
        let getOneMhs = await knex('mahasiswa').select('*').where('id',id).first();
        response.ok(getOneMhs,res);
    } catch (error) {
        response.err(error,res);
    }
}

//post data
exports.addMahasiswa = async (req,res) => {
    try {
        const {nim,nama,jurusan} = await insertMahasiswa.validateAsync(req.body);
        const insert = {
            id:uuidv4(),
            nim : nim,
            nama: nama,
            jurusan: jurusan
        }
        const exe = await knex('mahasiswa').insert(insert);
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
        const {id} = await getOne.validateAsync(req.params);
        const {nim,nama,jurusan} = await updateMahasiswa.validateAsync(req.body);

        const update = {
            nim: nim,
            nama: nama,
            jurusan: jurusan
        }

        const exe = await knex('mahasiswa').update(update).where('id',id);
        if (exe) {
            response.ok('UPDATE SUCCESS',res)
        }
    } catch (error) {
        response.err(error,res);
    }
}

exports.deleteMahasiswa = async (req,res) => {
    try {
        const {id} = await hapus.validateAsync(req.params);
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