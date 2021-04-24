const { Schema, model } = require('mongoose');

// Outline what in the object
const Document = new Schema({
    _id: String,
    data: Object
})

                    // Name of the Model 
module.exports = model("Document", Document);