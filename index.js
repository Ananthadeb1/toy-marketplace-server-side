const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zcvxptr.mongodb.net/?retryWrites=true&w=majority`;

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
    await client.connect();

    const toysCollection = client.db("toyLand").collection("toys");

     // get data for homepage 
     app.get('/toyssample', async (req, res) => {
      const query = {}
      const toysData = await toysCollection.find(query).toArray()
      console.log(toysData)
      res.send(toysData)
  });

    // get all data for Alltoy page from mongodb
    app.get("/alltoys", async (req, res) => {
      const query = {};
      const alltoys = await toysCollection.find(query).toArray();
      res.send(alltoys);
    });
    // get specific data for toy details
    app.get("/toy/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const toy = await toysCollection.findOne(query);
      res.send(toy);
    });
    // insert data on toys collection
    app.post("/addtoy", async (req, res) => {
      const toy = req.body;
      const result = await toysCollection.insertOne(toy);
      res.send(result);
    });
    // get mytoys data based on email address
    app.get("/mytoys", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = { seller_email: req.query.email };
      }
      console.log(query);
      const mytoys = await toysCollection.find(query).toArray();
      res.send(mytoys);
    });

    //  delete  item by id query
    app.delete('/mytoys/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const deletedToy = await toysCollection.deleteOne(query);
      res.send(deletedToy)
  });
  // edit data by filtering 
  app.put('/mytoys/:id', async (req, res) => {
    const id = req.params.id;
    const updatedData = await toysCollection.updateOne({ _id: new ObjectId(id) }, { $set: req.body })
    console.log(updatedData)
    res.send(updatedData)
});

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("toy is running");
});
app.listen(port, () => {
  console.log("listening to  ", port);
});
