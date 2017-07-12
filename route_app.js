var express = require("express");
var Receta = require("./models/recetas");
var Ingrediente = require("./models/ingredientes");
var router = express.Router();
var fs = require("fs");

router.get("/", function(req,res){
	Receta.aggregate([ { $sample: { size: 5 } } ],function(err,recetas){
			if(err){ res.redirect("/app"); return;}
			res.render("app/home", {recetas: recetas});
		});
});

router.get("/recetas/new", function(req,res){
	Ingrediente.find({},function(err,ingredientes){
			if(err){ res.redirect("/app"); return;}
			res.render("app/recetas/new", {ingredientes: ingredientes});
		}).sort({ title: 1 });
});

router.get("/ingredientes/new", function(req,res){
	res.render("app/ingredientes/new");
});

router.route("/recetas/:id")
	.get(function(req,res){
		Receta.findById(req.params.id, function(err,receta){
			if(err){ res.redirect("/app"); return;}
			Ingrediente.find({},function(err,ingredientes){
				if(err){ res.redirect("/app"); return;}
				res.render("app/recetas/show", {receta: receta, result_ing: ingredientes});
			});
		})
	})
	.put(function(req,res){
		var extension = req.body.image.name.split(".").pop();
		Receta.findById(req.params.id, function(err,receta){
			receta.title = req.body.title;
			receta.ingredientes= req.body.ingredientes;
			receta.preparacion= req.body.preparacion;
			if(extension)
			{
				receta.imagen= extension;
			}
			receta.save(function(err){
				if(!err){
					fs.rename(req.body.image.path, "public/img/recetas/" + receta._id + "." + extension);
					Receta.find({},function(err,recetas){
						if(err){ res.redirect("/app"); return;}
						// res.render("app/recetas", {recetas: recetas}).sort({ title: 1 });
						res.render("app/recetas", {recetas: recetas});
					});
				}
				else{
					Receta.findById(req.params.id, function(err,receta){
						if(err){ res.redirect("/app"); return;}
						Ingrediente.find({},function(err,ingredientes){
							if(err){ res.redirect("/app"); return;}
							res.render("app/recetas/show", {receta: receta, result_ing: ingredientes});
						});
					})
				}
			})
		})
	});

router.get("/recetas/delete/:id", function(req,res){
	Receta.findOneAndRemove({ _id: req.params.id }, function(err){
		if(!err){
			Receta.find({},function(err,recetas){
				if(err){ res.redirect("/app"); return;}
				res.render("app/recetas", {recetas: recetas});
			}).sort({ title: 1 });
		}
		else
		{
			console.log(err);
		}
	})
});

router.route("/ingredientes/:id")
	.get(function(req,res){
		Ingrediente.findById(req.params.id, function(err,ingrediente){
			if(err){ res.redirect("/app"); return;}
				res.render("app/ingredientes/show", {ingrediente: ingrediente});
			});
	})
	.put(function(req,res){
		var extension = req.body.image.name.split(".").pop();
		Ingrediente.findById(req.params.id, function(err,ingrediente){
			ingrediente.title = req.body.title;
			if(extension)
			{
				ingrediente.imagen= extension;
			}
			ingrediente.save(function(err){
				if(!err){
					fs.rename(req.body.image.path, "public/img/ingredientes/" + ingrediente._id + "." + extension);
					Ingrediente.find({},function(err,ingredientes){
						if(err){ res.redirect("/app"); return;}
						res.render("app/ingredientes", {ingredientes: ingredientes});
					});
				}
				else{
					console.log(err);
				}
			})
		})
	});

router.get("/ingredientes/delete/:id", function(req,res){
	Ingrediente.findOneAndRemove({ _id: req.params.id }, function(err){
		if(!err){
			Ingrediente.find({},function(err,ingredientes){
				if(err){ res.redirect("/app"); return;}
				res.render("app/ingredientes", {ingredientes: ingredientes});
			}).sort({ title: 1 });
		}
		else
		{
			console.log(err);
		}
	})
});

router.route("/recetas")
	.get(function(req,res){
		Receta.find({},function(err,recetas){
			if(err){ res.redirect("/app"); return;}
			res.render("app/recetas", {recetas: recetas});
		}).sort({ title: 1 });
	})
	.post(function(req,res){
		var extension = req.body.image.name.split(".").pop();
		var data = {
			title: req.body.title,
			ingredientes: req.body.ingredientes,
			preparacion: req.body.preparacion,
			imagen: extension
		}

		var receta = new Receta(data);

		receta.save(function(err){
			if(!err){
				fs.rename(req.body.image.path, "public/img/recetas/" + receta._id + "." + extension);
				res.redirect("/app/recetas");
			}
			else{
				res.render(err);
			}
		})
	});

router.route("/ingredientes")
	.get(function(req,res){
		Ingrediente.find({},function(err,ingredientes){
			if(err){ res.redirect("/app"); return;}
			res.render("app/ingredientes", {ingredientes: ingredientes});
		}).sort({ title: 1 });
	})
	.post(function(req,res){
		var extension = req.body.image.name.split(".").pop();
		var data = {
			title: req.body.title,
			imagen: extension
		}

		var ingrediente = new Ingrediente(data);

		ingrediente.save(function(err){
			if(!err){
				fs.rename(req.body.image.path, "public/img/ingredientes/" + ingrediente._id + "." + extension);
				res.redirect("/app/ingredientes");
			}
			else{
				res.render(err);
			}
		})
	});

module.exports = router;