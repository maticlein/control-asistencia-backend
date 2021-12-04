const mongoose = require("mongoose");

const temperatureSchema = new mongoose.Schema({
    temperature: Number,
});

const Temperature = mongoose.model("Temperature", temperatureSchema);

module.exports = Temperature;