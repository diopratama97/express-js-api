//rename cover dan file dengan uuid di db
//promise all (done)
// dipisahkan antara file dan cover (done)
// hitung berapa waktu hit query sampai ke upload minio, tambah kolom monitoring waktu
// coba case beda root folder(tempat upload beda) (done)
// upload banyak data

let knex = require("../db/con-knex-pg");
//const { v4: uuidv4 } = require("uuid");
const path = require("path");
const Minio = require("minio");
const fs = require("fs");

exports.monitoring = async (paths) => {
  let minioClient = new Minio.Client({
    endPoint: "localhost",
    port: 9000,
    useSSL: false,
    accessKey: "minio",
    secretKey: "minio-express-js-api",
  });

  try {
    const filename = path.basename(paths);
    const folder = path.dirname(paths).split("/").pop();
    const extCover = process.env.COVER_EXT.split(",");
    const extFile = process.env.FILE_EXT.split(",");
    const ext = path.extname(filename);

    const coverProcess = new Promise(async () => {
      if (extCover.includes(ext)) {
        const getCover = await knex("uploads")
          .select("id", "done")
          .where("folder_name", folder)
          .andWhere("catalog_cover", filename)
          .first();

        if (getCover) {
          // upload file to minio
          minioClient.fPutObject(
            "assets",
            `${getCover.id + ext}`,
            paths,
            function (e) {
              if (e) {
                return console.log(e);
              }
              // get url file with expired time
              minioClient.presignedGetObject(
                "assets",
                `${getCover.id + ext}`,
                async (e, presignedUrl) => {
                  if (e) return console.log(e);

                  const time = new Date().getMilliseconds();
                  const updateData = await knex("uploads")
                    .update({
                      catalog_cover: `${getCover.id + ext}`,
                      catalog_url_cover: presignedUrl,
                      done: getCover.done + time,
                    })
                    .where("id", getCover.id);
                  if (updateData) {
                    fs.renameSync(
                      paths,
                      `${path.dirname(paths)}/${getCover.id + ext}`
                    );
                  }
                }
              );
            }
          );
        }
      }
    });
    const fileProcess = new Promise(async () => {
      if (extFile.includes(ext)) {
        const getFile = await knex("uploads")
          .select("id", "done")
          .where("folder_name", folder)
          .andWhere("catalog_file", filename)
          .first();

        if (getFile) {
          // upload file to minio
          minioClient.fPutObject(
            "assets",
            `${getFile.id + ext}`,
            paths,
            function (e) {
              if (e) {
                return console.log(e);
              }
              // get url file with expired time
              minioClient.presignedGetObject(
                "assets",
                `${getFile.id + ext}`,
                async (e, presignedUrl) => {
                  if (e) return console.log(e);

                  const time = new Date().getMilliseconds();
                  const updateData = await knex("uploads")
                    .update({
                      catalog_file: `${getFile.id + ext}`,
                      catalog_url_file: presignedUrl,
                      done: getFile.done + time,
                    })
                    .where("id", getFile.id);
                  if (updateData) {
                    fs.renameSync(
                      paths,
                      `${path.dirname(paths)}/${getFile.id + ext}`
                    );
                  }
                }
              );
            }
          );
        }
      }
    });
    await Promise.all([coverProcess, fileProcess]);
  } catch (error) {
    console.log(error);
    return error;
  }
};
