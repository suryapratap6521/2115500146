require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const apiRoutes = require('./routes/apiRoutes');

app.use(cors({
    origin: true,
    credentials: true 
}));

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use(apiRoutes);

app.listen(process.env.PORT || 8000, "0.0.0.0", (error) => {
    if (!error) console.log("Server started at http://0.0.0.0:" + process.env.PORT || 8000);
    else console.log(error.message);
}); 