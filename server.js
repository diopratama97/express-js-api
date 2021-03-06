const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const app = express();
const swaggerUi = require("swagger-ui-express");
const cookieParser = require("cookie-parser");

//app use cookie parser
app.use(cookieParser());
//parse application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//swagger
const apiDocs = require("./apidocs.json");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(apiDocs));

//tampil image
app.use("/images", express.static("uploads/images"));
app.use(morgan("dev"));

//panggil routes
let routes = require("./routers/index");
routes(app);

//daftar menu routes dari index
app.use("/api", require("./middleware"));

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
