require('dotenv').config()
require("./utils/mongo.js");
const xl = require('excel4node');

const express = require('express');
const cors = require('cors');
const TeachableMachine = require('@sashido/teachablemachine-node'); 
const Lesson = require('./models/Lesson');
const Temperature = require('./models/Temperature');

const model = new TeachableMachine({
    modelUrl: process.env.TM_MODEL
});

var json = [
    {
        "name": "Mati",
        "temperature": 36.3
    },
    {
        "name": "Vale",
        "temperature": 35.7
    },
    {
        "name": "José",
        "temperature": 36.6
    },
    {
        "name": "Andrés",
        "temperature": 36.1
    },
]

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT;

const createSheet = () => {

    return new Promise(resolve => {
  
  // setup workbook and sheet
  var wb = new xl.Workbook();
  
  var ws = wb.addWorksheet('Asistencia');
  
  // Add a title row
  
  ws.cell(1, 1)
    .string('Nombre')
  
  ws.cell(1, 2)
    .string('Temperatura')
  
  // add data from json
  
  for (let i = 0; i < json.length; i++) {
  
    let row = i + 2
  
    ws.cell(row, 1)
      .string(json[i].name)
  
    ws.cell(row, 2)
      .number(json[i].temperature)
  }
  
  resolve( wb )
  
    })
  }

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

app.get("/api/lessons/:id", (req, res) => {
    Lesson.findById(req.params.id)
    .then(lesson => {
        res.json(lesson);
    })
    .catch(err => res.status(400).json("Error: " + err))
});

app.put("/api/lessons/:id", (req, res) => {
    Lesson.findById(req.params.id)
    .then(lesson => {
        let updates = lesson;
        updates.students.push(req.body.student)
        Lesson.findOneAndUpdate({ _id: req.params.id }, updates, { new: true })
        .then(updatedLesson => res.json(updatedLesson))
        .catch(err => res.status(400).json("Error: " + err))
    })
    .catch(err => res.status(400).json("Error: " + err))
});

app.get('/api/excel', function (req, res) {

    createSheet().then( file => {
      file.write('asistencia.xlsx', res);
    })
  
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