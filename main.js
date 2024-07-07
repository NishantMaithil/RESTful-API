const express = require('express');
const mongoose = require('mongoose');

//connecting database 
mongoose.connect('mongodb://localhost:27017/Sample',{useNewUrlParser : true , useUnifiedTopology : true })
.then(()=> {
    console.log("Database is connected");
}).catch(()=>{
    console.log("Connection Failed");
})


//creating schema for the product
const productSchema = new mongoose.Schema({
    name : String,
    description : String,
    price : Number
})

const app = express();
const Product = new mongoose.model("Product",productSchema);

app.use(express.json());


//Create Product
app.post('/api/v1/product/new',async (req,res)=>{
    await Product.create(req.body);
    res.status(201).json({
        success : true,
        Product
    })
})

//Read products
app.get('/api/v1/product',async(req,res)=>{
    const resultProduct = await Product.find();
    res.status(200).json({
        success : true,
        resultProduct,
    })
})

//update Product
app.put('/api/v1/product/:id',async(req,res)=>{
    let resultProduct = await Product.findById(req.params.id);
    if(!resultProduct){
        return res.status(500).json({
            success : false,
            message : 'Product was not found'
        })
    }
    resultProduct = await Product.findByIdAndUpdate(req.params.id,req.body,{new : true,
        useFindAndModify : false,
        useValidators : true
    })
   

    res.status(200).json({
        success : true,
        resultProduct
    })

});

//delete Product
app.delete('/api/v1/product/delete/:id',async(req,res)=>{
    const resultProduct = await Product.findById(req.params.id);
    if(resultProduct===null){
        return res.status(500).json({
            success : false,
            message : 'Product was not found'
        })
    }
    await resultProduct.deleteOne();
    res.status(200).json({
        success : true,
        resultProduct

    })
});

app.get('/demo',(req,res)=>{
    res.send("This is a demo of REST API");
})
app.listen(3000,()=>{
    console.log('Server is running on port 3000');
})