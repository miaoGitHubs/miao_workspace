const express = require("express");
const hbs = require('hbs');
const mongo = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;
const assert = require('assert');
const bodyParser = require('body-parser'); //help to get req.body
const moment = require('moment'); //deal with date format
const port = process.env.PORT || 3000;
let url = process.env.MONGODB_URI || 'mongodb://miao:dm123456@mernprojectdb-shard-00-00.hnp0y.mongodb.net:27017,mernprojectdb-shard-00-01.hnp0y.mongodb.net:27017,mernprojectdb-shard-00-02.hnp0y.mongodb.net:27017/test?ssl=true&replicaSet=mernprojectdb-shard-0&authSource=admin&retryWrites=true&w=majority';

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
        createdOn: Date()
    };

    mongo.connect(url, (err, db)=>{
        assert.equal(null, err);
        db.collection('message').insertOne(item, (err, result)=>{
            assert.equal(null, err);
            console.log('Item inserted !! : '+ result);
            // refresh msg list
            let resultArray = [];
            let cursor = db.collection('message').find();
            cursor.forEach((doc, err)=>{
                assert.equal(null, err);

                doc.createdOn = moment.utc(new Date(doc.createdOn)).local().format('MM/DD/YYYY HH:mm:ss');
                resultArray.push(doc);
            }, ()=>{
                db.close();
                res.render('contact.hbs', {
                    pageTitle:'Contact',
                    items:resultArray
                });
            })
            db.close();
        })
    });

    // res.redirect('/contact');
});

app.post('/update', (req, res, next)=>{

});

app.post('/delete', (req, res, next)=>{
    var id = req.body.id;
    console.log('id : ' + id);
    mongo.connect(url, (err, db)=>{
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
    mongo.connect(url, (err, db)=>{
        assert.equal(null, err);
        let cursor = db.collection('message').find();

        cursor.forEach((doc, err)=>{
            assert.equal(null, err);
            doc.createdOn = moment.utc(new Date(doc.createdOn)).local().format('MM/DD/YYYY HH:mm:ss');
            resultArray.push(doc);
        }, ()=>{
            db.close();
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
