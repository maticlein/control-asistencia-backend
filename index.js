require('dotenv').config()
const express = require('express');
const TeachableMachine = require('@sashido/teachablemachine-node'); 

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

app.listen(port, () => {
    console.log(`Aplicación corriendo en el puerto ${port}`);
});