var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var rec_schema = new Schema({
	title:{type: String, required: true},
	ingredientes:{type: Array },
	preparacion: String,
	imagen: String
});

var Receta = mongoose.model("Receta", rec_schema);

module.exports = Receta;