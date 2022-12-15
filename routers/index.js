"use strict";

const verification = require("../middleware/verification");

module.exports = (app) => {
  let home = require("../controller/index");
  let mahasiswa = require("../controller/mahasiswa");

  app.route("/").get(home.index);

  //mahasiswa
  app.route("/api/Mahasiswa").get(mahasiswa.getAllMahasiswa);
  app.route("/api/Mahasiswa/:id").get(mahasiswa.getOneMahasiswa);
  app.route("/api/Mahasiswa").post(mahasiswa.addMahasiswa);
  app.route("/api/Mahasiswa/:id").put(mahasiswa.updateMahasiswa);
  app.route("/api/Mahasiswa/:id").delete(mahasiswa.deleteMahasiswa);
  app.route("/api/nestedJsonMahasiswa").get(mahasiswa.getGroupMatakuliah);
};
