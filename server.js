const express = require('express');
const app = express();
const collection = require('./config')
const {ObjectId} = require('mongodb')

app.use(express.urlencoded({extended:true}));
app.use(express.json())

app.get("/blogs", async function (req,res) {
    try {
        const blogs = await collection.find();
        res.status(200).json(blogs)
    }catch(err){
        res.status(500).json({error:"Error has occured"})
    }
})
app.get("/blogs/:id", async function(req,res) {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid blog ID' });
    }
    try{
        const blog = await collection.findById(req.params.id)
        if(!blog){
            return res.status(404).json({error: "Blog not found"})
        }else {
            res.status(200).json(blog)
        }
    }catch (err){
        res.status(500).json({error: "Failed to fetch data"})
    }
});

app.post("/blogs", async function (req,res) {
    const data = {
        title: req.body.title,
        body: req.body.body,
        author: req.body.author,
    }
    const existingBlog = await collection.findOne({title: data.title})
    if(existingBlog){
        res.send("Such blog already exists")
    }else{
        const blogData = await collection.insertMany(data)
        console.log(blogData)
    }
})

app.put("/blogs/:id", async function (req,res) {
    const { title, body, author } = req.body;

    if (!title || !body || !author) {
        return res.status(400).json({ error: 'Title, body, and author are required.' });
    }
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid blog ID' });
    }
    try{
        const result = await collection.findByIdAndUpdate(
            req.params.id,
            {$set: {title,body,author}},
            {new: true}
        )
        if (result.matchedCount === 0) return res.status(404).json({ error: 'Blog not found' });
        res.status(200).json({ message: 'Blog updated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update blog post' });
    }
})

app.delete("/blogs/:id", async function (req,res) {
    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ error: 'Invalid blog ID' });
    }
    try {
        const result = await collection.findByIdAndDelete(req.params.id);
        if (result.deletedCount === 0) return res.status(404).json({ error: 'Blog not found' });
        res.status(200).json({ message: 'Blog deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete blog post' });
    }
})

const PORT = 5000
app.listen(PORT, function () {
    console.log(`Server is active on http://localhost:${PORT}`)
})