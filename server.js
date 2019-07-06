// Dependencies
var express = require("express");
var mongoose = require("mongoose");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");
var mongojs = require('mongojs')

// Initialize Express
var app = express();

// Database configuration
var databaseUrl = "scraper";
var collections = ["scrapedData"];



// Serve static content for the app from the "public" directory in the application directory.
app.use(express.static("public"));


// Parse application body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");



// Hook mongojs configuration to the db variable
var db = mongojs(databaseUrl, collections);


db.on("error", (error) => console.log("Database Error:", error)
);






// Main route (simple Hello World Message)
app.get("/", (req, res) => res.render("index"));

//GETTING ALL RESULTS
app.get('/all', (req, res) => {
    db.scrapedData.find({}, (err, data) => {
        if (err) {
            console.log(err)
        }
        else {
            res.json(data)
        }
    })
})

//GETTING ALL ARTCLES THAT WERE LIKED

app.get('/favorites', (req, res)=> {
    db.scrapedData.find({"favorites": true}, {$sort: {"title": -1}}, (err, data) =>{
        if (err){
            console.log(err)
        }
        else{
            res.json(data)
        }
    })
})



//SCRAPING THE SITE FOR ARTICLES
app.get('/scrape', (req, res) => {
    axios.get("https://www.brit.co").then((response) => {

        var $ = cheerio.load(response.data);


        $("div.card-information").each((i, element) => {


            var title = $(element).children().find("span").text()
            var link = $(element).parent().attr("href");

            if (title && link) {

                db.scrapedData.insert({
                    title: title,
                    link: link
                },
                    (err, data) => {
                        if (err) {
                            console.log(err)
                        }
                        else {
                            console.log("Scraped!")
                        }
                    });
            }
        });

       res.send("done-zo!")
    });

})



/* -/-/-/-/-/-/-/-/-/-/-/-/- */

// Listen on port 3000
app.listen(3000, function () {
    console.log("App running on port 3000!");
});
