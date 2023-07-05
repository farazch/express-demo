// Building APIs using node and express

//https://www.youtube.com/watch?v=pKd0Rpw7O48

// Installing express
// go to foler and type
// $$ npm install express

// How to run this from terminal
// Got within folder and run the command 
// $$ node index.js

// How to run this from browser
// http://localhost:3000/

// after any update , we need to run it with node index.js Or we can install node module that will automatically update
// npm i -g nodemon
// and then run the app with this command $$ nodemon index.js

// Query paramenters are optional ... with ? sign
// for example: http://localhost:3000/api/posts/11/2022?sortBy=name

// we use let for variable which we define and can change it later. 
// Alternately, we use canst for variables which we dont want change later

// In restful api, if response is 404, that mean object not found
// response of 400 means bad request

// Joi is package for input validaion
// We define schema ie rules for validation

const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());

const courses = [
    {id:1,name:'coures1'},
    {id:2,name:'coures2'},
    {id:3,name:'coures3'},
];


app.get('/',(req,res) => {
    res.send('Hello World');

});

app.get('/api/courses', (req,res) => {
    res.send(courses);
});

app.get('/api/courses/:id',(req,res) => {
    //res.send(req.params.id);
    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send("Course with given ID was not found");
    res.send(course);
});

app.get('/api/posts/:month/:y',(req,res) => {
    // Reading parameters
    //res.send(req.params);

    // Reading query paraments ie after ? sign
    res.send(req.query);
});

// inserting
app.post('/api/courses',(req,res) => {

    const schema = {
        name:Joi.string().min(3).required()
    };

    const result = Joi.validate(req.body,schema);
    //console.log(result);

    //if(!req.body.name || req.body.name.length < 3)
    if(result.error)
    {
        //res.status(404).send('Name is required with min lenth of 3');
        res.status(404).send(result.error.details[0].message);
        return ;
    }    

    const course = {
        id : courses.length+1,
        name : req.body.name
    };
    courses.push(course);
    res.send(course);
});

// updating
app.put('/api/courses/:id',(req,res) => {

    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send("Course with given ID was not found");

    const { error }  = validateCourse(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }

    course.name = req.body.name;
    res.send(course);


});

function validateCourse(course)
{
    const schema = {
        name:Joi.string().min(3).required()
    };

    return Joi.validate(course,schema);    
}

app.delete('/api/courses/:id',(req,res) => {

    const course = courses.find(c => c.id === parseInt(req.params.id));
    if(!course) res.status(404).send("Course with given ID was not found");

    const index = courses.indexOf(course);
    courses.splice(index,1);

    res.send(course);

});

//const port = process.env.port || 3000;
//app.listen(port,() => console.log("Listening to port ${port}."));

app.listen(3000,() => console.log("Listening to port 3000."));

