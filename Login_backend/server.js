require('./config/db');

const app = require('express')();
const port = process.env.PORT || 3000;

const UserRouter = require('./api/User');

// For accepting post form data
const bodyparser = require('express').json;
app.use(bodyparser());

// cors accesss to enable application on different hosts to send request
const cors = require("cors");
app.use(cors());

app.use('/user', UserRouter)

app.listen(port, () => {
    console.log('server running on port ${port}');
})