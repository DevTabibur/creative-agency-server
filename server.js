const express = require("express");
const cors = require("cors");
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');


// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));


app.get('/', async(req, res)=>{
    res.send("Heello WORLD")
});

// user: creative-agency
// pswd: kZcPFMy7eaFZDkX9


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hc4xz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
    console.log('mongo connected')
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
  client.close();
});


// app.get('/services', async(req, res)=>{
//     const result = await serviceCollection.find({}).toArray();
//     res.send(result)
// })


app.listen(port, (req, res)=>{
    console.log(`Server is running on ${port}`)
})