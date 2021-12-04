require('dotenv').config()
require("./utils/mongo.js");

const express = require('express');
const cors = require('cors');
const TeachableMachine = require('@sashido/teachablemachine-node'); 
const Lesson = require('./models/Lesson');
const Temperature = require('./models/Temperature');

const model = new TeachableMachine({
    modelUrl: process.env.TM_MODEL
});

const app = express();
app.use(cors());
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
        teacher: lesson.teacher,
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
        updates.students.push(req.body.students)
        Lesson.findOneAndUpdate({ _id: req.params.id }, updates, { new: true })
        .then(updatedLesson => res.json(updatedLesson))
        .catch(err => res.status(400).json("Error: " + err))
    })
    .catch(err => res.status(400).json("Error: " + err))
});

app.get("/api/temperature", (req, res) => {
    Temperature.findById("61aaf28a8dcbb8ade1545e6f")
    .then(temperature => {
         res.json(temperature);
    })
    .catch(err => res.status(400).json("Error: " + err))    
});

app.post("/api/temperature", (req, res) => {
    const data = req.body;
    const newTemperature = new Temperature({
        temperature: data.temperature,
    });
    newTemperature.save().then((result) => {
        res.json(result);
    });
});

app.put("/api/temperature", (req, res) => {
    Temperature.findById("61aaf28a8dcbb8ade1545e6f")
    .then(temperature => {
        let updates = temperature;
        updates.temperature = req.body.temperature;
        Temperature.findOneAndUpdate({ _id: "61aaf28a8dcbb8ade1545e6f" }, updates, { new: true })
        .then(updatedTemperature => res.json(updatedTemperature))
        .catch(err => res.status(400).json("Error: " + err))
    })
    .catch(err => res.status(400).json("Error: " + err)) 
});

app.listen(port, () => {
    console.log(`Aplicación corriendo en el puerto ${port}`);
});