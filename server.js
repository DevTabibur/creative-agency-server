const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const jwt = require("jsonwebtoken");

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).send({ message: "UnAuthorized" });
  }
  const token = authHeader.split(" ")[1];
  // console.log("token", token);

  jwt.verify(token, process.env.TOKEN_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).send({ message: "forbidden" });
    }
    req.decoded = decoded;
    next();
  });
};

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
    const orderCollection = client
      .db("creative-agency")
      .collection("order");
    const reviewCollection = client
      .db("creative-agency")
      .collection("review");

    // 1.a => get load all service collections
    app.get("/services", async (req, res) => {
      const result = await serviceCollection.find({}).toArray();
      res.send(result);
    });

    // 1.b => post services server to db
    app.post("/services", async (req, res) => {
      const data = req.body;
      // console.log('body', data);
      const result = await serviceCollection.insertOne(data);
      res.send(result);
    });

    // 1.c => delete services by id
    app.delete("/services/:id", async (req, res) => {
      const id = req.params.id;
      const filter = {_id:ObjectId(id)}
      const result = await serviceCollection.deleteOne(filter);
      res.send(result);
    });

    // 2.a => get load all service collections
    app.get("/users",  async (req, res) => {
      const result = await userCollection.find({}).toArray();
      res.send(result);
    });

    // 2.b => update every user and giving them jwt token
    app.put("/users/:email", async (req, res) => {
      const email = req.params.email;
      const filter = { email: email };
      const user = req.body;
      console.log('user', user)
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);

      // giving every user a jwt token
      const token = jwt.sign({ email: email }, process.env.TOKEN_SECRET, {
        expiresIn: "1m",
      });

      res.send({ result, accessToken: token });
    });

    // 3.a => get load all service collections
    app.get("/payment", async (req, res) => {
      const result = await paymentCollection.find({}).toArray();
      res.send(result);
    });


    // 4.a => get load all order collections
    app.get("/order", async(req , res)=>{
      const result = await orderCollection.find({}).toArray();
      res.send(result)
    })


    // 4.b => get load order collections by id
    app.get("/order/:id", async(req , res)=>{
      const id = req.params.id;
      const filter = {_id:ObjectId(id)}
      const result = await orderCollection.findOne(filter)
      res.send(result)
    })


    // 4.c =>  post order collections server to db
    app.post("/order", async(req , res)=>{
      const data = req.body;
      // console.log('body', data)
      const result = await orderCollection.insertOne(data)
      res.send(result)
    })

    // 5.a => get load all review collections
    app.get("/review", async(req , res)=>{
      const result = await reviewCollection.find({}).toArray();
      res.send(result)
    })


    // 5.b => post review server to db
    app.post("/review", async(req , res)=>{
      const data = req.body;
      // console.log('data', data)
      const result = await reviewCollection.insertOne(data)
      res.send(result)
    })


    // 5.c => review deleted by id
    app.delete("/review/:id", async(req , res)=>{
      const id = req.params.id;
      const filter = {_id:ObjectId(id)}
      const result = await reviewCollection.deleteOne(filter)
      res.send(result)
    })




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
