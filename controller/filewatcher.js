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
//solusi : kasih waktu interval
//2. compress file jika data size nya 100 mb butuh waktu untuk compress sekitar 4menit 36detik, belum selesai untuk compress sudah jalan script yg lain
//3. data belum selesai copy sudah diproses untuk data yg besar( maksimal data aman 73mb)
//solusi : tunggu proses compress baru upload ke minio

let knex = require("../db/con-knex-pg");
//const { v4: uuidv4 } = require("uuid");
const path = require("path");
const Minio = require("minio");
const fs = require("fs");
const sharp = require("sharp");
const gs = require("ghostscript4js");

let minioClient = new Minio.Client({
  endPoint: "localhost",
  port: 9000,
  useSSL: false,
  accessKey: "minio",
  secretKey: "minio-express-js-api",
});

const uploadMinio = async (paths, ext, processName, datas, toPath) => {
  if (datas) {
    // // upload file to minio
    minioClient.fPutObject(
      "assets",
      `${datas.id + ext}`,
      toPath,
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
              if (fs.existsSync(paths)) {
                fs.renameSync(
                  paths,
                  `${path.dirname(paths)}/${datas.id + ext}`
                );
              }
              // if (fs.existsSync(toPath)) {
              //   fs.unlinkSync(toPath);
              // }
            }
          }
        );
      }
    );
  }
};

const compressFile = async (paths, toPath) => {
  await gs.executeSync(
    `gs 
            \ -q -dNOPAUSE -dBATCH -dSAFER
              -dPrinted=false
              -dDownsampleColorImages=true
              -dDownsampleGrayImages=true
              -dDownsampleMonoImages=true
              -r144
            \ -sDEVICE=pdfwrite
            \ -dCompatibilityLevel=1.4
            \ -dPDFSETTINGS=/ebook
            \ -dEmbedAllFonts=true
            \ -dSubsetFonts=true
            \ -dAutoRotatePages=/None
            \ -dColorImageDownsampleType=/Bicubic
            \ -dColorImageResolution=144
            \ -dGrayImageDownsampleType=/Bicubic
            \ -dGrayImageResolution=144
            \ -dMonoImageDownsampleType=/Subsample
            \ -dMonoImageResolution=144
              -dColorImageDownsampleThreshold=1.0
              -dGrayImageDownsampleThreshold=1.0
              -dMonoImageDownsampleThreshold=1.0
            \ -sOutputFile=${toPath} 
            \ ${paths}`
  );
  console.log("file-done");
  return true;
};

const resizeFile = async (paths, toPath) => {
  const readImage = fs.readFileSync(paths);
  //resize image
  await sharp(readImage)
    .resize({
      width: 230,
      height: 380,
      fit: sharp.fit.inside,
      withoutEnlargement: true,
    })
    .toFile(toPath);
  console.log("image-done");
  return true;
};

exports.monitoring = async (paths) => {
  try {
    let datas;
    const filename = path.basename(paths);
    const folder = path.dirname(paths).split("/").pop();
    const ext = path.extname(filename);
    let toPath = require.main.path + `/uploads/${filename}`;

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

    // const coverProcess = new Promise(async () => {
    if (process.env.COVER_EXT.includes(ext)) {
      // datas = await builder
      //   .clone()
      //   .andWhere("catalog_cover", filename)
      //   .andWhere("statusCover", null);
      // if (datas) {
      const resize = await resizeFile(paths, toPath);
      console.log("resize", resize);
      //await uploadMinio(paths, ext, "cover", datas, toPath);
      //}
    }
    //});
    //const fileProcess = new Promise(async () => {
    else if (process.env.FILE_EXT.includes(ext)) {
      // datas = await builder
      //   .clone()
      //   .andWhere("catalog_file", filename)
      //   .andWhere("statusFile", null);
      // if (datas) {
      const compress = await compressFile(paths, toPath);
      console.log("compress", compress);
      //await uploadMinio(paths, ext, "file", datas, toPath);
      //}
    }
    // });
    // await Promise.all([coverProcess, fileProcess]);
  } catch (error) {
    console.log(error);
    return error;
  }
};
