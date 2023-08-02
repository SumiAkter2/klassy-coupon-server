const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ynzvptg.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    const couponCollection = client.db("klassy-missy").collection("coupons");

    app.get("/coupons", async (req, res) => {
      const cursor = couponCollection.find({});
      const coupons = await cursor.toArray();

      res.send(coupons);
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
