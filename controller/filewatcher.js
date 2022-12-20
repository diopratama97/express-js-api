//rename cover dan file dengan uuid di db
//promise all (done)
// dipisahkan antara file dan cover (done)
// hitung berapa waktu hit query sampai ke upload minio, tambah kolom monitoring waktu
// coba case beda root folder(tempat upload beda) (done)
// upload banyak data

//new
//status uploads
//syarat pindah compress dan upload minio

//issue
// 1. jika di rename setelah upload kena error no such file data sebagian besar berhasil ada yg tidak

let knex = require("../db/con-knex-pg");
//const { v4: uuidv4 } = require("uuid");
const path = require("path");
const Minio = require("minio");
const fs = require("fs");

let minioClient = new Minio.Client({
  endPoint: "localhost",
  port: 9000,
  useSSL: false,
  accessKey: "minio",
  secretKey: "minio-express-js-api",
});

const processData = async (paths, ext, processName, filename, folder) => {
  //getData
  let datas = null;
  const builder = knex("uploads")
    .select(
      "id",
      "done",
      "statusCover",
      "statusFile",
      "catalog_file",
      "catalog_url_file",
      "catalog_cover",
      "catalog_url_cover"
    )
    .where("folder_name", folder)
    .first();

  if (processName === "cover") {
    datas = await builder.clone().andWhere("catalog_cover", filename);
  }
  if (processName === "file") {
    datas = await builder.clone().andWhere("catalog_file", filename);
  }

  if (datas) {
    // upload file to minio
    minioClient.fPutObject(
      "assets",
      `${datas.id + ext}`,
      paths,
      async function (e) {
        if (e) {
          return console.log(e);
        }
        // get url file with expired time
        minioClient.presignedGetObject(
          "assets",
          `${datas.id + ext}`,
          async (e, presignedUrl) => {
            if (e) return console.log(e);

            const time = new Date().getMilliseconds();
            const dataUpdate = {
              catalog_cover:
                processName === "cover"
                  ? `${datas.id + ext}`
                  : datas.catalog_cover,
              catalog_url_cover:
                processName === "cover"
                  ? presignedUrl
                  : datas.catalog_url_cover,
              catalog_file:
                processName === "file"
                  ? `${datas.id + ext}`
                  : datas.catalog_file,
              catalog_url_file:
                processName === "file" ? presignedUrl : datas.catalog_url_file,
              done: datas.done + time,
              statusCover: processName === "cover" ? "DONE" : datas.statusCover,
              statusFile: processName === "file" ? "DONE" : datas.statusFile,
            };

            const updateData = await knex("uploads")
              .update(dataUpdate)
              .where("id", datas.id);
            if (updateData) {
              fs.renameSync(paths, `${path.dirname(paths)}/${datas.id + ext}`);
            }
          }
        );
      }
    );
  }
};

exports.monitoring = async (paths) => {
  try {
    const filename = path.basename(paths);
    const folder = path.dirname(paths).split("/").pop();
    const ext = path.extname(filename);

    const coverProcess = new Promise(async () => {
      if (process.env.COVER_EXT.includes(ext)) {
        await processData(paths, ext, "cover", filename, folder);
      }
    });
    const fileProcess = new Promise(async () => {
      if (process.env.FILE_EXT.includes(ext)) {
        await processData(paths, ext, "file", filename, folder);
      }
    });
    await Promise.all([coverProcess, fileProcess]);
  } catch (error) {
    console.log(error);
    return error;
  }
};
