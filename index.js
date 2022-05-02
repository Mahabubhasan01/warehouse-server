const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const productsCollection = client.db('ecoHub').collection('product');
        const allProductCollection = client.db('ecoHub').collection('totalProduct');
        const contactInfo = client.db('ecoHub').collection('contact');

        // Product api 

        app.get('/product',async(req,res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });

        // single product by search id 

        app.get('/products/:id',async(req,res) => {
            const idWithQuery = {_id:ObjectId(req.params.id)};
            const product = await productsCollection.findOne(idWithQuery);
            res.send(product)
        })
        // All Product

        app.get('/totalProduct',async(req,res) => {
            const cursor = allProductCollection.find({});
            const allProduct = await cursor.toArray();
            res.send(allProduct);
        });
        //  contact
        app.post('/contact',async(req,res) =>{
            const singleInfo = req.body;
            const addInfo = await contactInfo.insertOne(singleInfo);
            res.send(addInfo)
        })


        
    }
    finally{

    }

}
run().catch(console.dir);
app.listen(port, () => {
    console.log('Running my port is ',port);
})