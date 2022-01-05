const express = require("express");
const hbs = require('hbs');
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const assert = require('assert');
const bodyParser = require('body-parser'); //help to get req.body
const moment = require('moment'); //deal with date format
const port = process.env.PORT || 3000;
let url = process.env.MONGODB_URI || 'mongodb+srv://miao:dm123456@webappscluster.feben.mongodb.net/profileappdb?retryWrites=true&w=majority';

let app =express();

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use(bodyParser.json())

hbs.registerPartials(__dirname + "/views/partials");
app.set('view engine', 'hbs');
app.use(express.static(__dirname +'/public'));

hbs.registerHelper("currentYear", function() {
    return new Date().getFullYear();
});

app.get('/get-data', (req, res, next)=>{

});

app.post('/insert', (req, res, next)=>{
    console.log("req : " + req);
    let item = {
        msg: req.body.msg,
        author: req.body.author,
        createdOn: moment.utc().format('MM/DD/YYYY HH:mm:ss')
    };
    console.log(moment(new Date()).utc().format('MM/DD/YYYY HH:mm:ss'));
    MongoClient.connect(url, {useNewUrlParser: true},(err, client)=>{
        assert.equal(null, err);
        let db = client.db('profileappdb');
        db.collection('message').insertOne(item, (err, result)=>{
            assert.equal(null, err);
            // refresh msg list
            let resultArray = [];
            let cursor = db.collection('message').find();
            cursor.forEach((doc, err)=>{
                assert.equal(null, err);
                let stillUtc = moment.utc(doc.createdOn).toDate();
                doc.createdOn =  moment(stillUtc).local().format('MM/DD/YYYY HH:mm:ss');
                resultArray.push(doc);
            }, ()=>{
                client.close();
                res.render('contact.hbs', {
                    pageTitle:'Contact',
                    items:resultArray
                });
            })
            client.close();
        })
    });

    // res.redirect('/contact');
});

app.post('/update', (req, res, next)=>{

});

app.post('/delete', (req, res, next)=>{
    var id = req.body.id;
    console.log('id : ' + id);
    MongoClient.connect(url, {useNewUrlParser:true},(err, db)=>{
        assert.equal(null, err);
        db.collection('message').deleteOne({"_id": objectId(id)}, (err, result)=>{
            assert.equal(null, err);
            console.log('Item deleted');
            db.close();
        })
    })
    res.redirect('/contact');
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

app.get("/vr_project", (req, res)=>{
    res.render('vr_project.hbs', {
        pageTitle:'VR Project',
    });
});

app.get("/contact", (req, res)=>{
    let resultArray = [];
    MongoClient.connect(url, {useNewUrlParser: true},(err, client)=>{
        assert.equal(null, err);
        let db = client.db('profileappdb');
        let cursor = db.collection('message').find();

        cursor.forEach((doc, err)=>{
            assert.equal(null, err);
            let stillUtc = moment.utc(doc.createdOn).toDate();
            doc.createdOn = moment(stillUtc).local().format('MM/DD/YYYY HH:mm:ss');
            resultArray.push(doc);
        }, ()=>{
            client.close();
            res.render('contact.hbs', {
                pageTitle:'Contact',
                items:resultArray
            });
        })
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
