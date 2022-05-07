const express = require('express');
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
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
        const myItemsCollection = client.db('ecoHub').collection('myItems')

        // Product api 

        app.get('/product',async(req,res) => {
            const cursor = productsCollection.find({});
            const products = await cursor.toArray();
            res.send(products);
        });

        // single product by search id 

        app.get('/product/:id',async(req,res) => {
            const idWithQuery = {_id:ObjectId(req.params.id)};
            const product = await productsCollection.findOne(idWithQuery);
            res.send(product)
        })

        app.get('/product',async(req,res) =>{
            let query = {};
            const email = req.query.email
            if(email){
                query = {email:email}
            }
            const cursor = productsCollection.find(query)
            const singleP = await cursor.toArray() ;
            res.send(singleP)
        })
        // All Product

        app.get('/totalProduct',async(req,res) => {
            const cursor = allProductCollection.find({});
            const allProduct = await cursor.toArray();
            res.send(allProduct);
        });

        // post on product
        
        app.post('/product',async(req,res) =>{
            const newProduct = req.body;
            const addProduct = await productsCollection.insertOne(newProduct);
            res.send(addProduct);
        });
        app.get('/myItems',async(req,res) =>{
            const cursor = myItemsCollection.find({});
            const addItems = await cursor.toArray();
            res.send(addItems);
        });

        // update or stock in single product 
        app.put('/product/:id',async(req,res) =>{
            const id = req.params.id;
            const updateProduct = req.body;
            const filter = {_id:ObjectId(id)};
            const option = {upsert:true};
            const productDoc ={
                $set:{
                    quantity:updateProduct.quantity,
                },
            };
            const result = await productsCollection.updateOne(filter,option,productDoc);
            res.send(result);
        });

        // single order info
        app.post('/myItems',async(req,res)=>{
            const myItems = req.body;
            const addMyItems = await myItemsCollection.insertOne(myItems);
            res.send(addMyItems)
        });

        // show my item 
        app.get('/myItems/:id',async(req,res) => {
            const idWithQuery = {_id:ObjectId(req.params.id)};
            const myItem = await myItemsCollection.findOne(idWithQuery);
            res.send(myItem)
        })

        // delete from database on product
        app.delete('/product/:id',async(req,res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)};
            const deleteProduct = await productsCollection.deleteOne(query);
            res.send(deleteProduct);
        }) 

        
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