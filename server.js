/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Zhan Wang Student ID: 148668171 Date: January 19, 2021
*  Heroku Link: 
*
********************************************************************************/
const exphbs = require('express-handlebars');
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const RestaurantDB = require("./modules/restaurantDB.js");
const db = new RestaurantDB("mongodb+srv://dbUser:Seneca123456@cluster0.qq4cg.mongodb.net/sample_restaurants?retryWrites=true&w=majority");
app.use (cors());

app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('engine', '.hbs');

app.use(bodyParser.json());

const HTTP_PORT = process.env.PORT || 8080;

app.get("/", function(req,res){
    res.render("index.hbs", {
        layout: false
    })
})

//*****API Router */

//GET All /api/restaurants
app.get("/api/restaurants",(req, res)=>{
   let emps =  db.getAllRestaurants(req.params.page, req.params.perPage, req.params.borough);
    res.json(emps);
});

//Get One  ie:/api/restaurants/59a47286cfa9a3a73e51e72c This route must accept a route parameter
app.get("/api/restaurants/:id", (req,res)=>{
    let o = db.getRestaurantById(req.params.id);
    if(o){
        res.json(o);
    }else{
        res.status(404).json({"message":"Resource not found! "});
    }
});


// POST NEW    RESTAURANT
app.post("api/restaurants", (req,res)=>{
    db.addNewRestaurant(req.body)
    .then(()=>{
        res.status(201).json('New restaurant successfully added!');
    })
    .catch((err)=>{
        res.status(400).json(err);
    });
});

// PUT UPDATE A RESTAURANT 
app.put("/api/restaurants/:id", (req,res)=>{
    db.updateRestaurantById(req.data,req.params.id)
    .then(()=>{
        res.status(200).json(`Restaurant ${req.data._id} succesfully updated! `);
    })
    .catch((err)=>{
        res.status(404).json(err);
    });
});

// DELETE /api/restaurants  This rout need accepte a route parameter, /api/restaurants/59a47286cfa9a3a73e51e72c

app.delete("/api/restaurants/:id", (req,res)=>{
    db.deleteRestaurantById(req.params.id)
        .then(()=>{
            res.status(204).json(`Restaurant ${req.params.id} deleted!`);
        })
        .catch((err)=>{
            res.status(404).json(err);
        });
});


// ################################################################################
// Tell the app to start listening for requests

db.initialize().then(()=>{
    app.listen(HTTP_PORT, ()=>{
    console.log(`server listening on: ${HTTP_PORT}`);
    });
    }).catch((err)=>{
    console.log(err);
    });

