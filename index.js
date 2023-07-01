const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
const app = express();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zcvxptr.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const toysCollection = client.db("toyLand").collection("toys");


    // get all data for Alltoy page from mongodb
    app.get('/alltoys', async (req, res) => {
        const query = {}
        const alltoys = await toysCollection.find(query).toArray();
        res.send(alltoys)
    });
    // get specific data for toy details 
    app.get('/toy/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id:new ObjectId(id) }
        const toy = await toysCollection.findOne(query)
        res.send(toy)
    });


    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Pure spices Running successfully');
})
app.listen(port, () => {
    console.log('listening to  ', port);
})