const PORT = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { type, availableParallelism } = require("os");

// const username = thakurshahab1809
// password = 3mXw4pSuvLlQT2Mc

app.use(express.json());
app.use(cors());
mongoose.connect("mongodb+srv://thakurshahab1809:3mXw4pSuvLlQT2Mc@cluster0.lyhejms.mongodb.net/cloth-store");


const storage = multer.diskStorage({
   destination:'./uploads/images',
   filename:(req,file,cb)=>{
      cb(null,`${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
   }
})

const upload = multer({storage:storage});

//creating upload endpoints
app.use('/images',express.static('uploads/images'))

 app.post('/upload',upload.single('product'),(req,res)=>{
   res.json({
      success:1,
      image_url:`http://localhost:${PORT}/images/${req.file.filename}`
   })
 })


     const productSchema = mongoose.Schema({
      id:{
         type:Number,
         required:true
      },
      name:{
         type:String,
         required:true
      },
      image:{
         type:String,
         required:true
      },
      category:{
         type:String,
         required:true
      },
      new_price:{
         type:Number,
         require:true
      },
      old_price:{
         type:Number,
         required:true
      },
      date:{
         type:Date,
         default:Date.now()
      },
      available:{
         type:Boolean,
         default:true
      }
     })

    const Product = mongoose.model("Product",productSchema);

    app.post('/addproduct',async(req,res)=>{
      const product = new Product({
         id:req.body.id,
         name:req.body.name,
         image:req.body.image,
         category:req.body.category,
         new_price:req.body.new_price,
         old_price:req.body.old_price,
      })
      console.log(product);
      await product.save();
      console.log("saved");
      res.json({
         success:true,
         name:req.body.name,
      })
    })

    app.post('/removeProduct', async(req,res)=>{
      await Product.findOneAndDelete({id:req.body.id});
      console.log("produt removed");
      res.json({
         success:true,
         name:req.body.name
      })

    })

    //get all products
  app.get("/allProducts",async(req,res)=>{
   const product = await Product.find({})
    console.log("all product fetched");
    res.json(product)
  })

app.listen(PORT, (err)=>{
   if(!err) console.log(`Server is running on port ${PORT}`);
   else
   console.log(err);
})