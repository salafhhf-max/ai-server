import express from "express"
import OpenAI from "openai"
import dotenv from "dotenv"
import cors from "cors"
import rateLimit from "express-rate-limit"
import helmet from "helmet"

dotenv.config()

const app = express()

app.use(helmet())

app.use(cors({
 origin: "*",
 methods: ["POST"]
}))

app.use(express.json({limit:"10kb"}))
app.use(express.static("public"))

const limiter = rateLimit({
 windowMs: 15 * 60 * 1000,
 max: 100,
 message: {error:"Too many requests. Try later."}
})

app.use("/ai", limiter)

const openai = new OpenAI({
 apiKey: process.env.OPENAI_API_KEY
})

const usage = {}

async function askAI(prompt){

 const res = await openai.chat.completions.create({
  model: "gpt-4.1-mini",
  messages: [
   { role: "user", content: prompt }
  ]
 })

 return res.choices[0].message.content
}

app.post("/ai", async (req,res)=>{

 try{

  const ip = req.ip

  if(!usage[ip]) usage[ip] = 0

  if(usage[ip] >= 50){
   return res.json({result:"Free limit reached (50 uses)"})
  }

  const text = req.body.text
  const type = req.body.type

  if(!text || text.length < 3){
   return res.json({result:"Invalid input"})
  }

  if(text.length > 2000){
   return res.json({result:"Text too long"})
  }

  let prompt = ""

  if(type==="resume")
   prompt=`Create professional resume: ${text}`

  if(type==="email")
   prompt=`Write professional email about: ${text}`

  if(type==="summary")
   prompt=`Summarize this text: ${text}`

  if(type==="translate")
   prompt=`Translate this text to Hebrew English Arabic Russian: ${text}`

  if(type==="idea")
   prompt=`Give startup business idea about: ${text}`

  if(type==="improve")
   prompt=`Improve this text professionally: ${text}`

  if(type==="social")
   prompt=`Create social media post: ${text}`

  if(type==="product")
   prompt=`Write product description for: ${text}`

  if(!prompt){
   return res.json({result:"Invalid request"})
  }

  const result = await askAI(prompt)

  usage[ip]++

  res.json({result})

 }catch(err){

  console.error("AI Error:",err)

  res.status(500).json({
   result:"Server error"
  })

 }

})

app.get("/health",(req,res)=>{
 res.json({status:"ok"})
})

app.listen(3000,()=>{
 console.log("AI Server running on port 3000")
})