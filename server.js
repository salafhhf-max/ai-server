import express from "express"
import OpenAI from "openai"
import dotenv from "dotenv"
import cors from "cors"

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.static("public"))

const openai = new OpenAI({
 apiKey: process.env.OPENAI_API_KEY
})

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

  const text = req.body.text
  const type = req.body.type

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

  const result = await askAI(prompt)

  res.json({result})

 }catch(err){

  console.log(err)
  res.json({result:"AI ERROR"})
 }

})

app.listen(3000,()=>{
 console.log("AI Server running")
})