var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ing_schema = new Schema({
	title:{type: String, required: true},
	imagen: String
});

var Ingrediente = mongoose.model("Ingrediente", ing_schema);

module.exports = Ingrediente;