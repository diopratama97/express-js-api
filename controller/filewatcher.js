let knex = require("../db/con-knex-pg");
//const { v4: uuidv4 } = require("uuid");
const path = require("path");
const Minio = require("minio");

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

    //rename cover dan file dengan uuid di db
    //promise all (done)
    // dipisahkan antara file dan cover (done)
    // hitung berapa waktu hit query sampai ke upload minio, tambah kolom monitoring waktu
    // coba case beda root folder(tempat upload beda) (done)
    // upload banyak data

    const coverProcess = new Promise(async () => {
      if (extCover.includes(path.extname(filename))) {
        console.log(path.extname(filename));
        // const getCover = await knex("uploads")
        //   .select("id")
        //   .where("folder_name", folder)
        //   .andWhere("catalog_cover", filename)
        //   .first();
        // if (getCover) {
        //   console.log("COVER:", getCover);
        //   var metaData = {
        //     "Content-Type": "image/jpeg",
        //     "X-Amz-Meta-Testing": 1234,
        //     example: 5678,
        //   };
        //   // upload file to minio
        //   var file = paths;
        //   minioClient.fPutObject(
        //     "assets",
        //     "image1.jpg",
        //     file,
        //     metaData,
        //     function (e) {
        //       if (e) {
        //         return console.log(e);
        //       }
        //       // get url file with expired time
        //       minioClient.presignedGetObject(
        //         "assets",
        //         "image1.jpg",
        //         async (e, presignedUrl) => {
        //           if (e) return console.log(e);
        //           await knex("uploads")
        //             .update("catalog_url_cover", presignedUrl)
        //             .where("id", getCover.id);
        //         }
        //       );
        //     }
        //   );
        // }
        const time = new Date().getMilliseconds();
        const toSecond = (time % 60000) / 1000;
        console.log(time);
        console.log(toSecond);
      }
    });
    const fileProcess = new Promise(async () => {
      if (extFile.includes(path.extname(filename))) {
        console.log(path.extname(filename));
        // const getFile = await knex("uploads")
        //   .select("id")
        //   .where("folder_name", folder)
        //   .andWhere("catalog_file", filename)
        //   .first();
        // if (getFile) {
        //   console.log("FILE:", getFile);
        //   var metaData = {
        //     "Content-Type":
        //       "application/vnd.openxmlformats - officedocument.spreadsheetml.sheet",
        //     "X-Amz-Meta-Testing": 1234,
        //     example: 5678,
        //   };
        //   // upload file to minio
        //   var file = paths;
        //   minioClient.fPutObject(
        //     "assets",
        //     "file-1.xlsx",
        //     file,
        //     metaData,
        //     function (e) {
        //       if (e) {
        //         return console.log(e);
        //       }
        //       // get url file with expired time
        //       minioClient.presignedGetObject(
        //         "assets",
        //         "file-1.xlsx",
        //         async (e, presignedUrl) => {
        //           if (e) return console.log(e);
        //           await knex("uploads")
        //             .update("catalog_url_file", presignedUrl)
        //             .where("id", getFile.id);
        //         }
        //       );
        //     }
        //   );
        // }
        const time = new Date().getMilliseconds();
        const toSecond = (time % 60000) / 1000;
        console.log(time);
        console.log(toSecond);
      }
    });

    await Promise.all([coverProcess, fileProcess]);
  } catch (error) {
    console.log(error);
    return error;
  }
};
