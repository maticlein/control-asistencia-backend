require('dotenv').config()

const mongoose = require('mongoose');
const connectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.bhphn.mongodb.net/data?retryWrites=true&w=majority`;

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
        console.log('Conexión exitosa con Mongo Database');
    }).catch(err => {
        console.error(err);
    })