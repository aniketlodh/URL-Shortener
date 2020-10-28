let express=require("express");
let app=express();
let ejs=require("ejs");
const shortUrl=require("./models/shortUrl");
const mongoose=require("mongoose");
require("dotenv").config()
app.use(express.urlencoded({extended:false}));
const mongo=process.env.MONGO_URL;
mongoose.connect("mongodb+srv://"+mongo+"?retryWrites=true&w=majority",{
    useNewUrlParser:true,useUnifiedTopology:true
})
app.set("view engine","ejs");
app.get("/",async (req,res)=>{
    try {
      const ShortUrls=await shortUrl.find({})
      res.render("index",{ShortUrls:ShortUrls});
    } catch (e) {
      console.log("error");
    }
})
app.post("/shortUrls",async (req,res)=>{
  try{
    await shortUrl.create({full:req.body.fullUrl})
    res.redirect("/");
  }catch(err){
    console.log(err);
  }
})
app.get("/:shortUrl",async (req,res)=>{
    try {
      const url= await shortUrl.findOne({short:req.params.shortUrl});
      if(url==null) return res.sendStatus(404);
      url.clicks++;
      url.save();
      res.redirect(url.full);
    } catch (e) {
      console.log(e);
    }
})
app.listen(process.env.PORT || 3000,()=>{
    console.log("success");
});
