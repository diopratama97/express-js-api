const express = require("express");
const auth = require("./auth");
const router = express.Router();
const verifikasi = require("./verification");
const { upload } = require("../helper/upload-images");

router.post("/auth/register", upload.single("photo"), auth.registrasi);
router.post("/auth/login", auth.login);
router.get("/auth/logout", auth.Logout);
router.get("/auth/refreshToken", auth.tokenRefresh);
router.post("/file-uploads", upload.array("file"), auth.fileupload);

//perlu otorisasi
router.get("/rahasia", verifikasi(), auth.halamanrahasia);

module.exports = router;
