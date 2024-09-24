const mongoose = require('mongoose');

const patientOldSchema = new mongoose.Schema({
    bedNo: { type: Number, required: true}, // Still required
    name: { type: String }, // Not required anymore
    bhtNo: { type: String }, // Not required anymore
    timestamp: { type: Date, default: Date.now }, // Automatically adds timestamp
});

const PatientOld = mongoose.model('PatientOld', patientOldSchema);

module.exports = { PatientOld };
