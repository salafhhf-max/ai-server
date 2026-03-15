import express from "express"
import OpenAI from "openai"
import dotenv from "dotenv"
import cors from "cors"
import rateLimit from "express-rate-limit"
import helmet from "helmet"
import mongoose from "mongoose"

dotenv.config()

const app = express()

/* ================= SECURITY ================= */

app.disable("x-powered-by")

app.use(helmet())

app.use(cors({
 origin: "*",
 methods: ["POST"]
}))

app.use(express.json({limit:"10kb"}))
app.use(express.static("public"))

/* ================= RATE LIMIT ================= */

const limiter = rateLimit({
 windowMs: 15 * 60 * 1000,
 max: 100,
 message: {error:"Too many requests. Try again later."}
})

app.use("/ai", limiter)

/* ================= DATABASE ================= */

mongoose.connect(process.env.MONGO_URI)
.then(()=> console.log("MongoDB connected"))
.catch(err=> console.log("MongoDB Error:",err))

const userSchema = new mongoose.Schema({
 ip:String,
 usage:{type:Number,default:0},
 createdAt:{type:Date,default:Date.now}
})

const User = mongoose.model("User",userSchema)

/* ================= OPENAI ================= */

if(!process.env.OPENAI_API_KEY){
 console.error("Missing OPENAI_API_KEY")
 process.exit(1)
}

const openai = new OpenAI({
 apiKey: process.env.OPENAI_API_KEY
})

async function askAI(prompt){

 const res = await openai.chat.completions.create({
  model:"gpt-4.1-mini",
  messages:[
   {role:"user",content:prompt}
  ]
 })

 return res.choices[0].message.content
}

/* ================= AI API ================= */

app.post("/ai", async (req,res)=>{

 try{

  const ip = req.ip

  let user = await User.findOne({ip})

  if(!user){
   user = new User({ip})
   await user.save()
  }

  if(user.usage >= 50){
   return res.json({result:"Free limit reached (50 uses)"})
  }

  const text = req.body.text
  const type = req.body.type

  if(!text || typeof text !== "string"){
   return res.json({result:"Invalid input"})
  }

  if(text.length < 3){
   return res.json({result:"Input too short"})
  }

  if(text.length > 2000){
   return res.json({result:"Text too long"})
  }

  const cleanText = text.replace(/[<>]/g,"")

  let prompt=""

  if(type==="resume")
   prompt=`Create professional resume: ${cleanText}`

  if(type==="email")
   prompt=`Write professional email about: ${cleanText}`

  if(type==="summary")
   prompt=`Summarize this text: ${cleanText}`

  if(type==="translate")
   prompt=`Translate this text to Hebrew English Arabic Russian: ${cleanText}`

  if(type==="idea")
   prompt=`Give startup business idea about: ${cleanText}`

  if(type==="improve")
   prompt=`Improve this text professionally: ${cleanText}`

  if(type==="social")
   prompt=`Create social media post: ${cleanText}`

  if(type==="product")
   prompt=`Write product description for: ${cleanText}`

  if(!prompt){
   return res.json({result:"Invalid request"})
  }

  const result = await askAI(prompt)

  user.usage++
  await user.save()

  res.json({result})

 }catch(err){

  console.error("AI Error:",err)

  res.status(500).json({
   result:"Server error"
  })

 }

})

/* ================= HEALTH CHECK ================= */

app.get("/health",(req,res)=>{
 res.json({
  status:"ok",
  server:"running"
 })
})

/* ================= SERVER ================= */

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
 console.log("AI Server running on port",PORT)
})