const { MongoClient, ServerApiVersion } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ynzvptg.mongodb.net/?retryWrites=true&w=majority`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // collection
    const couponCollection = client.db("klassy-missy").collection("coupons");
    const userCollection = client.db("klassy-missy").collection("users");

    //  create user
    const users = { email: "sumi@gamil.com", password: "123445" };
    const result = await userCollection.insertOne(users);
    console.log(users,result);

    // get user
    app.get("/user", async (req, res) => {
      const users = await userCollection.find().toArray();
      res.send(users);
    });
    // get coupons
    app.get("/coupons", async (req, res) => {
      const cursor = couponCollection.find({});
      const coupons = await cursor.toArray();

      res.send({ status: true, data: coupons });
    });
    // insert coupons
    app.post("/coupons", async (req, res) => {
      const coupons = req.body;
      const result = await couponCollection.insertOne(coupons);
      res.send(result);
    });

    // update:
    app.put("/coupon", async (req, res) => {
      const coupons = req.body;
      const filter = {};
      const options = { upsert: true };
      const updateDoc = {
        $set: coupons,
      };
      const result = await couponCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.send({ result });
    });
    // delete coupons
    app.delete("/coupons/:id", async (req, res) => {
      const id = req.params.id;
      const result = await couponCollection.deleteOne({ _id: ObjectId(id) });
      res.send(result);
    });
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Klassy Missy!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
