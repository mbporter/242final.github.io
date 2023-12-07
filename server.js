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

const upload = multer({ dest: __dirname + "/public/images" });

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

let albums = [
    {
        _id: 1,
        name: "OK Computer",
        artist: "Radiohead",
        releaseYear: 1997,
        genre: "Art Rock, Alt-Rock, Funk",
        description: "The album's lyrics depict a world fraught with rampant consumerism, social alienation, emotional isolation and political malaise; in this capacity, OK Computer is said to have prescient insight into the mood of 21st-century life.",
        songs: ["Airbag'", "Paranoid Andoriod", "Subterranean homesick alien", "Exit music (for a film)", "Let down", "Karma Police" , "Electioneering" , "Climbing up the Walls" , "No Surpises" , "Lucky", "The Tourist"]
    },
    {
        _id: 2,
        name: "Mm..Food?",
        artist: "MFDOOM",
        releaseYear: 2004,
        genre: "Alterative Hip Hop",
        description: "MF Doom described Mm..Food as a concept album about the things you find on a picnic, or at a picnic table." , 
        songs: ["Beef Rapp", "Hoe Cakes", "Potholderz", "One Beer", "Deep Fried Friends"]
    },
    {
        _id: 3,
        name: "In Utero",
        artist: "Nirvana",
        releaseYear: 1993,
        genre: "Gruge, Punk Rock, Noise Rock",
        description: "In Utero by Nirvana is the third and final studio album by the iconic grunge band, released in 1993, characterized by its raw and visceral sound, exploring themes of disillusionment and introspection.",
        songs: ["Serve the Servants", "Scentless Apprentice", 	"Heart-Shaped Box", "Rape Me", 	"Dumb", "Very Ape"]
    },
    {
        _id: 4,
        name: "Be the Cowboy",
        artist: "Mtski",
        releaseYear: 2018,
        genre: "Indie Rock, Art pop",
        description: "In a statement, Mitski said she experimented in narrative and fiction for the album, and said she was inspired by the image of someone alone on a stage, singing solo with a single spotlight trained on them in an otherwise dark room.",
        songs: ["Geyser", "Why Didn't You Stop Me?", "Old Friend", "A Pearl", "Lonesome Love", "Remember My Name"]
    },
    {
        _id: 5,
        name: "Voyage Sans Retour",
        artist: "Malice Mizer",
        releaseYear: 1996,
        genre: "Visual K, Art Rock",
        description: "The theme of the album is based on the story of vampires, taking a scalpel to the human world from the vampire's point of view, which also became the concept of their live performances before their major label debut.",
        songs: ["Yami no Kanata e~ (闇の彼方へ～)", "Transylvania", "Tsuioku no Kakera", "Premier Amour", "Itsuwari no Musette", "Claire ~Tsuki no Shirabe~"]
    }
];

app.get("/api/albums", (req, res) => {
    res.send(albums);
});

app.post("/api/albums", upload.single("cover"), (req, res) => {
    const result = validateAlbum(req.body);

    if (result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const album = {
        _id: albums.length + 1,
        name: req.body.name,
        artist: req.body.artist,
        releaseYear: req.body.releaseYear,
        genre: req.body.genre,
        description: req.body.description,
        songs: req.body.songs.split(",") 
    }

    albums.push(album);
    res.send(albums);
});

const validateAlbum = (album) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        name: Joi.string().min(3).required(),
        artist: Joi.string().min(3).required(),
        releaseYear: Joi.number().integer().min(1900).max(new Date().getFullYear()).required(),
        genre: Joi.string().min(3).required(),
        description: Joi.string().min(5),
        songs: Joi.allow("") 
    });

    return schema.validate(album);
};

app.put("/api/albums/:id", (req, res) => {
    const albumIndex = albums.findIndex(a => a._id == parseInt(req.params.id));
    if (albumIndex > -1) {
        const updatedAlbum = { ...albums[albumIndex], ...req.body };
        albums[albumIndex] = updatedAlbum;
        res.send(albums);
    } else {
        res.status(404).send('Album not found');
    }
});

app.delete("/api/albums/:id", (req, res) => {
    const albumIndex = albums.findIndex(a => a._id == parseInt(req.params.id));
    if (albumIndex > -1) {
        albums.splice(albumIndex, 1);
        res.send(albums);
    } else {
        res.status(404).send('Album not found');
    }
});



app.use((err, req, res, next) => {
    console.error(err.stack);

    // Send the error details to the client
    res.status(500).send('Something went wrong!');
});

app.listen(3000, () => {
    console.log("Server listening on port 3000");
});