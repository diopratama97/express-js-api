'use strict';

const verification = require('../middleware/verification');

module.exports = (app) => {
    let home = require('../controller/index');
    let mahasiswa = require('../controller/mahasiswa');

    app.route('/')
        .get(home.index);

    //mahasiswa
    app.route('/Mahasiswa')
        .get(verification(),mahasiswa.getAllMahasiswa);
    app.route('/Mahasiswa/:id')
        .get(mahasiswa.getOneMahasiswa);
    app.route('/Mahasiswa')
        .post(mahasiswa.addMahasiswa);
    app.route('/Mahasiswa/:id')
        .put(mahasiswa.updateMahasiswa);
    app.route('/Mahasiswa/:id')
        .delete(mahasiswa.deleteMahasiswa);
    app.route('/nestedJsonMahasiswa')
        .get(mahasiswa.getGroupMatakuliah);
}