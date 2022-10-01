const express = require("express");
const cors = require("cors");
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get('/', async(req, res)=>{
    res.send("Heello WORLD")
});


app.listen(port, (req, res)=>{
    console.log(`Server is running on ${port}`)
})