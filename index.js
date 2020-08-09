const express = require('express')
const postsRouter = require("./posts/posts")

const index = express()
const port = process.argv[2] || 5000

index.use(express.json())
index.use(postsRouter)

index.listen(port, ()=>{
    console.log(`The server is running on port ${port}`)
})

index.get('/', (req,res) =>{
    res.status(200).json({message:"API is running"})
})