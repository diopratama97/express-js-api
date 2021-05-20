const express = require('express');
const bodyParser = require('body-parser');
const app = express();

//parse application/json
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

//panggil routes
let routes = require('./routers/index');
routes(app);

app.listen(3030, () => {
    console.log(`Server started on port 3030`);
});