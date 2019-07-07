// Dependencies
var express = require("express");
var mongoose = require("mongoose");
// Require axios and cheerio. This makes the scraping possible
var axios = require("axios");
var cheerio = require("cheerio");
var exphbs = require("express-handlebars");



var db = require("./models/")


// Initialize Express
var app = express();







// Use morgan logger for logging requests
// app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/scraper", { useNewUrlParser: true });




app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

app.use(express.static("public"));







// Main route (simple Hello World Message)
app.get("/", (req, res) => res.render("index"));

//GETTING ALL RESULTS
app.get('/all', (req, res) => {
    db.Article.find({}).then((articleInfo) => res.json(articleInfo))

        .catch((err) => res.json(err))
})

//GETTING ALL ARTCLES THAT WERE LIKED

app.get('/favorites', (req, res) => {
    db.Article.find({ "favorites": true }, { $sort: { "title": -1 } }).then((err, data) => {
        if (err) {
            console.log(err)
        }
        else {
            res.json(data)
        }
    })
})





app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.brit.co").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an article tag, and do the following:
      $("div.card-information").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(this).children().find("span").text()

        result.link = $(this).parent().attr("href");
  
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          });
      });
  
      // Send a message to the client
      res.send("Scrape Complete");
    });
  });



/* -/-/-/-/-/-/-/-/-/-/-/-/- */

// Listen on port 3000
app.listen(3000, function () {
    console.log("App running on port 3000!");
});
