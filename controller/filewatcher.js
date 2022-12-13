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
    const dir = path.dirname(paths);
    const folder = dir.split("/").pop();

    const getCover = await knex("uploads")
      .select("*")
      .where("folder_name", folder)
      .andWhere("catalog_cover", filename)
      .first();

    const getFile = await knex("uploads")
      .select("*")
      .where("folder_name", folder)
      .andWhere("catalog_file", filename)
      .first();

    if (getCover) {
      console.log("COVER:", getCover);
      var metaData = {
        "Content-Type": "image/jpeg",
        "X-Amz-Meta-Testing": 1234,
        example: 5678,
      };

      // upload file to minio
      var file = paths;
      minioClient.fPutObject(
        "assets",
        "image1.jpg",
        file,
        metaData,
        function (e) {
          if (e) {
            return console.log(e);
          }
          // get url file with expired time
          minioClient.presignedGetObject(
            "assets",
            "image1.jpg",
            async (e, presignedUrl) => {
              if (e) return console.log(e);
              await knex("uploads")
                .update("catalog_url_cover", presignedUrl)
                .where("id", getCover.id);
            }
          );
        }
      );
    }
    if (getFile) {
      console.log("FILE:", getFile);
      var metaData = {
        "Content-Type":
          "application/vnd.openxmlformats - officedocument.spreadsheetml.sheet",
        "X-Amz-Meta-Testing": 1234,
        example: 5678,
      };

      // upload file to minio
      var file = paths;
      minioClient.fPutObject(
        "assets",
        "file-1.xlsx",
        file,
        metaData,
        function (e) {
          if (e) {
            return console.log(e);
          }
          // get url file with expired time
          minioClient.presignedGetObject(
            "assets",
            "file-1.xlsx",
            async (e, presignedUrl) => {
              if (e) return console.log(e);
              await knex("uploads")
                .update("catalog_url_file", presignedUrl)
                .where("id", getFile.id);
            }
          );
        }
      );
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};
