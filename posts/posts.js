const express = require('express')
const db = require("../data/db")


const router = express.Router()

router.get("/api/posts", (req,res)=>{
    db.find()
        .then(posts =>{
            res.status(200).json(posts)
        })
        .catch(err=>{
            res.status(500).json({error: "The posts information could not be retrieved."})
        })
})

router.post('/api/posts', (req, res)=>{
    !req.body.title || !req.body.contents ? res.status(400).json({message:"Please provide title and contents for the post."}) :
        db.insert(req.body)
            .then(x=>{
                res.status(201).json(x)
            })
            .catch(err=>{
                res.status(500).json({error: "There was an error while saving the post to the database"})
            })
})

router.get('/api/posts/:id/comments', (req, res)=>{
    db.findPostComments(req.params.id)
        .then(comment=>{
            !comment || comment == '' ? res.status(400).json({message: "The post with the specified ID does not exist." }) :
                res.status(200).json(comment)
        })
        .catch(err=>{
            res.status(500).json({error: "The comments information could not be retrieved." })
        })
})

router.post('/api/posts/:id/comments', (req,res)=>{

    !req.body.text ? res.status(400).json({errorMessage: "Please provide text for the comment."}):
        db.findById(req.params.id)
            .then(x=>{
                !x || x == '' ? res.status(404).json({message: "The post with the specified ID does not exist."}):
                    db.insertComment({text:req.body.text, post_id:req.params.id})
                        .then(x=>{
                            db.findCommentById(x.id).then(post=>{res.status(201).json(post)})
                                .catch(err=>{res.status(500).json({errorMessage:"Could not process request"})})
                        })
                        .catch(err=>{
                            res.status(500).json({error: "There was an error while saving the comment to the database"})
                        })
            })
            .catch(err=>{
                res.status(500).json({error: "There was an error while saving the comment to the database"})
            })

})

router.get("/api/posts/:id", (req, res)=>{
    db.findById(req.params.id)
        .then(x=>{
            !x || x == '' ? res.status(400).json({message: "The post with the specified ID does not exist." }) :
                res.status(200).json(x)
        })
        .catch(err=>{
            res.status(500).json({message: "The post with the specified ID does not exist." })
        })
})

router.delete('/api/posts/:id', (req,res)=>{
    db.findById(req.params.id)
        .then(x=>{
            !x || x == '' ? res.status(400).json({ message: "The post with the specified ID does not exist."}) :
                db.remove(req.params.id)
                    .then(y=>{
                        res.status(200).json(x)
                    })
                    .catch(err=>{
                        res.status(500).json({ error: "The post could not be removed" })
                    })
        })
        .catch(err=>{
            res.status(500).json({message:"Could not process this request"})
        })
})

router.put('/api/posts/:id',(req,res)=>{
    !req.body.title || !req.body.contents ? res.status(401).json({errorMessage: "Please provide title and contents for the post."}) :
        db.findById(req.params.id)
            .then(x=>{
                !x || x == "" ? res.status(400).json({message: "The post with the specified ID does not exist." }) :
                    db.update(req.params.id,req.body)
                        .then(y=>{
                            db.findById(req.params.id)
                                .then(newPost=>{
                                    res.status(201).json(newPost)
                                })
                                .catch(err=>{
                                    res.status(500).json({error: "The post information could not be modified."})
                                })
                        })
                        .catch(err=>{
                            res.status(500).json({error: "The post information could not be modified."})
                        })
            })
            .catch(err=>{
                res.status(500).json({error: "The post information could not be modified."})
            })
})



module.exports = router;