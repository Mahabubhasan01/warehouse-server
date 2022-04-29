const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');
            require('dotenv').config();

// MiddleWare 
app.use(cors());
app.use(express.json());           

// EcoHub
// dKoHkpONM8nJUd8s




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7lgnv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try{
        await client.connect();
        const productsCollection = client.db('ecoHub').collection('products');

        // Product api 

        app.get('/products',async(req,res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send('this is');
        })
    }
    finally{

    }

}
run().catch(console.dir);
app.listen(port, () => {
    console.log('Running my port is ',port);
})