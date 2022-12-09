let md5 = require("md5");
let response = require("../res");
let jwt = require("jsonwebtoken");
let config = require("../config/secret");
let knex = require("../db/con-knex-pg");
const { v4: uuidv4 } = require("uuid");
const { transporter } = require("../config/transporter-email");
const { login, register } = require("../helper/validation");
require("dotenv").config();

//controller untuk register
exports.registrasi = async (req, res) => {
  try {
    const data = await register.validateAsync(req.body);
    let post = {
      id: uuidv4(),
      username: data.username,
      email: data.email,
      password: md5(data.password),
      //role: data.role,
      photo: req.file.path,
    };

    let queryCekemail = await knex("user")
      .select("email")
      .where("email", post.email)
      .first();
    if (!queryCekemail) {
      const queryInsert = await knex("users").insert(post);
      if (queryInsert) {
        // send mail
        let info = await transporter.sendMail({
          from: '"Express-js-api 👻" <lagimakan92@gmail.com>',
          to: post.email,
          subject: "Hello ✔",
          text: "Hello world?",
          html: "<b>Hello world?</b>",
        });

        response.ok("Registrasi Berhasil", res);
      } else {
        response.err("Registrasi gagal!", res);
      }
    } else {
      response.duplikat("Data sudah tersedia", res);
    }
  } catch (error) {
    response.err(error, res);
  }
};

//controler login
exports.login = async (req, res) => {
  try {
    const data = await login.validateAsync(req.body);

    const queryLogin = await knex("users")
      .select("id")
      .where("email", data.email)
      .andWhere("password", md5(data.password))
      .first();

    if (!queryLogin) {
      response.errLogin("Email atau Password Salah!", res);
    } else {
      console.log(process.env.ACCESS_TOKEN_SECRET);
      const accessToken = jwt.sign(
        { queryLogin },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: "30s",
        }
      );
      const refreshToken = jwt.sign(
        { queryLogin },
        process.env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: "1d",
        }
      );
      await knex("users")
        .update("refresh_token", refreshToken)
        .where("id", queryLogin.id);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.cookie("userId", queryLogin.id, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });

      response.Login(accessToken, queryLogin.id, res);
    }
  } catch (error) {
    response.err(error, res);
  }
};

exports.Logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) return res.sendStatus(204);
  const user = await knex("users")
    .select("*")
    .where("refresh_token", refreshToken)
    .first();

  if (!user) return res.sendStatus(204);

  await knex("users").update("refresh_token", null).where("id", user.id);
  res.clearCookie("refreshToken");
  res.clearCookie("userId");
  return res.sendStatus(200);
};

exports.tokenRefresh = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(401);

    const user = await knex("users")
      .select("*")
      .where("refresh_token", refreshToken)
      .first();

    if (!user) return res.sendStatus(403);
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) return res.sendStatus(403);
        const accessToken = jwt.sign(
          { user },
          process.env.ACCESS_TOKEN_SECRET,
          {
            expiresIn: "30s",
          }
        );
        res.json({ accessToken });
      }
    );
  } catch (error) {
    console.log(error);
  }
};
exports.halamanrahasia = (req, res) => {
  response.ok("ini untuk role 2", res);
};
exports.fileupload = (req, res) => {
  return response.ok(req.files, res);
};
