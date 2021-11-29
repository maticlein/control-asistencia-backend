require('dotenv').config()
require("./utils/mongo.js");

const express = require('express');
const TeachableMachine = require('@sashido/teachablemachine-node'); 
const Lesson = require("./models/Lesson");

const model = new TeachableMachine({
    modelUrl: process.env.TM_MODEL
});

const app = express();
app.use(express.json());
const port = process.env.PORT;

app.get('/', (req, res) => {
    res.send('Control de asistencia');
});

app.get('/image/classify/', async (req, res) => {
    console.log(req.body.imageUrl);
    return model.classify({
        imageUrl: req.body.imageUrl,
    }).then((predictions) => {
        console.log(predictions);
        return res.json(predictions[0]);
    }).catch((e) => {
        console.error(e);
        res.status(500).send("Algo ha salido mal!")
    })
});

app.post("/api/lessons", (req, res) => {
    const lesson = req.body;
    const newLesson = new Lesson({
        subject: lesson.subject,
        date: lesson.date,
        time: lesson.time,
        students: lesson.students,
    });
    newLesson.save().then((result) => {
        res.json(result);
    });
});

app.put("/api/lessons/:id", (req, res) => {
    Lesson.findById(req.params.id)
    .then(lesson => {
        let updates = lesson;
        updates.students.push(req.body.students[0])
        Lesson.findOneAndUpdate({ _id: req.params.id }, updates, { new: true })
        .then(updatedLesson => res.json(updatedLesson))
        .catch(err => res.status(400).json("Error: " + err))
    })
    .catch(err => res.status(400).json("Error: " + err))
});

app.listen(port, () => {
    console.log(`Aplicación corriendo en el puerto ${port}`);
});