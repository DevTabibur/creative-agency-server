const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require("mongodb");
const jwt = require('jsonwebtoken');

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const verifyJWT = (req, res, next)=>{
  const authHeader = req.headers.authorization;

  if(!authHeader){
    return res.status(401).send({message: 'UnAuthorized'})
  }
  
}

// user: creative-agency
// pswd: kZcPFMy7eaFZDkX9

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hc4xz.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const serviceCollection = client
      .db("creative-agency")
      .collection("services");
    const userCollection = client.db("creative-agency").collection("users");
    const paymentCollection = client
      .db("creative-agency")
      .collection("payment");

    // 1.a => get load all service collections
    app.get("/services", async (req, res) => {
      const result = await serviceCollection.find({}).toArray();
      res.send(result);
    });

    // 1.b => post services server to db
    app.post("/services", async(req, res)=>{
        const data = req.body;
        // console.log('body', data);
        const result = await serviceCollection.insertOne(data);
        res.send(result)
    })


    // 2.a => get load all service collections
    app.get("/users", async (req, res) => {
      const result = await userCollection.find({}).toArray();
      res.send(result);
    });
    // 3.a => get load all service collections
    app.get("/payment", async (req, res) => {
      const result = await paymentCollection.find({}).toArray();
      res.send(result);
    });
  } finally {
    // await client.close()
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("Heello WORLD");
});

app.listen(port, (req, res) => {
  console.log(`Server is running on ${port}`);
});
