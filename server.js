const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const swaggerUi = require('swagger-ui-express');

//parse application/json
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//swagger
const apiDocs = require('./apidocs.json');
app.use('/api-docs',swaggerUi.serve, swaggerUi.setup(apiDocs));

//tampil image
app.use('/images',express.static('uploads/images'));
app.use(morgan('dev'));

//panggil routes
let routes = require('./routers/index');
routes(app);

//daftar menu routes dari index
app.use('/api',require('./middleware'));

app.listen(3030, () => {
    console.log(`Server started on port 3030`);
});