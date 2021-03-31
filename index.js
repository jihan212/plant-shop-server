const express = require('express');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const port = process.env.PORT ||2000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})

//--------Mongodb--------

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ier7s.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    console.log('Connection error',err);
  const collection = client.db("GreenPlant").collection("product");

  app.get('/products', (req, res) => {
      collection.find()
      .toArray((err, items) => {
          res.send(items)
      })
  })

  app.post('/admin', (req, res) => {
      const newProduct = req.body;
      console.log('Adding new product',newProduct);
      collection.insertOne(newProduct)
      .then(result => {
          console.log('Inserted count', result.insertedCount);
          res.send(result.insertedCount > 0)
      })
  })

//   client.close();
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})