var express = require("express");
var bodyParser = require("body-parser");
var User = require("./models/user").User;
// var session = require("express-session");
var cookieSession = require("cookie-session");
var router_app = require("./route_app");
var session_middleware = require("./middlewares/session");
var methodOverride = require("method-override");
var formidable = require("express-formidable");

var app = express();

app.use("/public",express.static('public'));
app.use(bodyParser.json()); //para peticiones applications/json
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));

/*app.use(session({
	secret: "123jhhahah",
	resave: false,
	saveUninitialized: false
}))*/

app.use(cookieSession({
	name: "session",
	keys: ["llave-1","llave-2"]
}));

app.use(formidable.parse({ keepExtensions: true }));
app.set("view engine", "jade");

app.get("/",function(req,res){
	//console.log(req.session.user_id);
	res.render("login");
});

app.get("/signup",function(req,res){
	User.find(function(err,doc){
		console.log(doc);
		res.render("signup");
	});
});

app.get("/login",function(req,res){
	res.render("login");
});

app.post("/users",function(req,res){
	var user = new User({email: req.body.email, 
						password: req.body.password,
						password_confirmation: req.body.password_confirmation,
						username: req.body.username
						});
	user.save().then(function(us){
		res.send("Guardamos el usuario exitosamente");
		res.redirect("/login");
	},function(err){
		if(err){
			console.log(String(err));
			res.send("No Pudimos guardar la información");
		}
	});
});

app.post("/sessions", function(req,res){
	User.findOne({username: req.body.username, password: req.body.password}, function(err,user){
		if(err || !user){
			console.log(String(err));
			res.send("Usuario y/o Contraseña Inválidos");
		}
		else{
			req.session.user_id = user._id;
			res.redirect("/app");
		}
	});
});

app.use("/app", session_middleware);
app.use("/app", router_app);

app.listen(8080);