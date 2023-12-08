const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");


mongoose
    .connect("mongodb+srv://Mbporter:Darcy123123@cluster0.sefh4en.mongodb.net/?retryWrites=true&w=majority")
    .then(() => {
    console.log("connected to mongodb");
    })
    .catch((error) => console.log("couldn't connect to mongodb", error));

    app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

const bookSchema = new mongoose.Schema({
    name: String,
    date: String,
    authenticity: String,
    condition: String,
    description: String,
    img: String,
});

const Book = mongoose.model("Book", bookSchema);


app.post("/api/books", upload.single("img"), (req, res) => {
    console.log("Received POST request to /api/books");
    const result = validateBook(req.body);

    if (result.error) {
        console.log("Validation error:", result.error.details[0].message);
        res.status(400).send(result.error.details[0].message);
        return;
    }

    console.log("Validated input:", req.body);

    const newBook = new Book({
        name: req.body.name,
        date: req.body.date,
        authenticity: req.body.authenticity,
        condition: req.body.condition,
        description: req.body.description,
    });

    if (req.file) {
        newBook.img = "images/" + req.file.filename;
    }

    createBook(newBook, res);
});


const createBook = async (newBook, res) => {
    const result = await newBook.save();
    res.send(newBook);
}

app.put("/api/books/:id" , upload.single("img"), (req, res) => {
    console.log(`Received PUT request to /api/books/${req.params.id}`);
    const result = validateBook(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
      }

    updateBook(req, res);
});

const updateBook = async (req, res) => {
    let fieldsToUpdate = {
        name: req.body.name,
        date: req.body.date,
        authenticity: req.body.authenticity,
        condition: req.body.condition,
        description: req.body.description,

    };

    if (req.file) {
        fieldsToUpdate.img = "images/" + req.file.filename;
    }

    const result = await Book.updateOne({ _id: req.params.id }, fieldsToUpdate);
    const book = await Book.findById(req.params.id);
    res.send(book);
};

app.delete("/api/books/:id", upload.single("img"), (req, res) => {
    console.log(`Received DELETE request to /api/books/${req.params.id}`);
    removeBook(res, req.params.id);
});

const removeBook = async (res, id) =>{
    const book = await Book.findByIdAndDelete(id);
    res.send(book);
}

const validateBook = (book) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        name: Joi.string().min(3).required(),
        date: Joi.string().min(3).required(),
        authenticity: Joi.string().required(),
        condition: Joi.allow(""),
        description: Joi.allow(""),
        
       
    });
    console.log("Validating book:", book);
    return schema.validate(book);
};
app.listen(3000, () => {
    console.log("I'm Listening");
});