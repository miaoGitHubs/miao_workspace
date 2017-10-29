const express = require("express");
const hbs = require('hbs');
const port = process.env.PORT || 3000;

var app =express();

hbs.registerPartials(__dirname + "/views/partials");
app.set('view engine', 'hbs');
app.use(express.static(__dirname +'/public'));

hbs.registerHelper("currentYear", function() {
    return new Date().getFullYear();
});


app.get('/', (req, res, next)=>{
    res.render('home.hbs', {
    	pageTitle:'Miao',
    	welcomeMessage: 'Welcome to miao website',
    });
});

app.get("/gallery", (req, res)=>{
    res.render('gallery.hbs', {
        pageTitle:'Gallery',
    });
});

app.get("/photos", (req, res)=>{
    res.render('photos.hbs', {
        pageTitle:'Photo',
    });
});

app.get("/logo", (req, res)=>{
    res.render('logo.hbs', {
        pageTitle:'Logo',
    });
});

app.get("/icon", (req, res)=>{
    res.render('icon.hbs', {
        pageTitle:'Icon',
    });
});

app.get("/typegraphy", (req, res)=>{
    res.render('typegraphy.hbs', {
        pageTitle:'Typegraphy',
    });
});

app.get("/projects", (req, res)=>{
    res.render('projects.hbs', {
        pageTitle:'Projects',
    });
});

app.get("/contact", (req, res)=>{
    res.render('contact.hbs', {
        pageTitle:'Contact',
    });
});

//bad -send back json with errorMessage
app.get("/bad",(req, res)=>{
    res.send({
    	errorMessage: "Unable to handle request!"
    });
});


app.listen(port, ()=>{
	console.log(`Server is up on port: ${port}`);
});
