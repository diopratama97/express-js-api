const sharp = require("sharp");
const fs = require("fs");
const path = require("path");
const gs = require("ghostscript4js");

const toPath = "./uploads/test2.pdf";
const paths = "../fileUpload/6e8ecad28a6162f7e220a6a3223d02c1.pdf";

gs.executeSync(
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

//const coverBuffer = Buffer.from("../fileUpload/cover/img-1.jpg");

//console.log(path.dirname("../fileUpload/cover/img-1.jpg"));

// const read = fs.readFileSync("../fileUpload/cover/img-1.jpg");
//console.log(require.main.path);
// sharp(read)
//   .resize({
//     width: 230,
//     height: 380,
//     fit: sharp.fit.inside,
//     withoutEnlargement: true,
//   })
//   .toFile("./uploads/images/img.jpg");
