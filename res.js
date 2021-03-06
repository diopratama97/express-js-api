"use strict";

exports.ok = (datas, res) => {
  // let data = {
  //   status: 200,
  //   data: datas,
  // };
  res.status(200).send({ data: datas });
  //res.json(data);
  res.end();
};

exports.err = (datas, res) => {
  let data = {
    message: "Internal Server Error",
    error: datas,
  };
  res.status(500).send(data);
  res.end();
};

exports.duplikat = (datas, res) => {
  // let data = {
  //   status: 409,
  //   message: datas,
  // };
  res.status(409).send({ message: datas });
  res.end();
};

exports.errLogin = (datas, res) => {
  // let data = {
  //   status: 404,
  //   message: datas,
  // };
  res.status(404).send({ message: datas });
  res.end();
};

exports.Login = (token, id, res) => {
  let data = {
    message: "Login Berhasil",
    token: token,
    userId: id,
  };
  res.status(200).send(data);
  res.end();
};

//respons nested json object
exports.nested = (values, res) => {
  //lakukan akumulasi
  const hasil = values.reduce((akumulasi, item) => {
    //tentukan key grup
    if (akumulasi[item.nama]) {
      //buat variable grup
      const group = akumulasi[item.nama];
      //cek jika isi array adalah matakuliah
      if (Array.isArray(group.matakuliah)) {
        group.matakuliah.push(item.matakuliah);
      } else {
        group.matakuliah = [group.matakuliah, item.matakuliah];
      }
    } else {
      akumulasi[item.nama] = item;
    }
    return akumulasi;
  }, {});

  let data = {
    status: 200,
    data: hasil,
  };
  res.json(data);
  res.end();
};
