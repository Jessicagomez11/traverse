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
app.get('/articles', (req, res) => {
    db.Article.find({}).then((articleInfo) => res.json(articleInfo))

        .catch((err) => res.json(err))
})

//GETTING ALL ARTCLES THAT WERE LIKED

app.get('/faves', (req, res) => {
    db.Article.find({ "fave": true }, { $sort: { "title": 1 } }).then((err, data) => {
        if (err) {
            console.log(err)
        }
        else {
            res.json(data)
        }
    })
})


// route to scrape the site 

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

        result.link = $(this).parent().attr("href")
  
        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle)
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log(err);
          })
      })
  
      // Send a message to the client
      res.send("Scrape Complete")
    })
  })

  //
  app.get("/articles/:id", (req, res) => {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
      // ..and populate all of the notes associated with it
      .populate("note")
      .then((dbArticle) => res.json(dbArticle)
     )
      .catch( (err) =>  res.json(err) )
  });

  app.post("/articles/:id", (req, res) => {
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
      .then( (dbNote) => {
        // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
        // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
        // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
        return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
      })
      .then( (dbArticle) => res.json(dbArticle) )

      .catch( (err) => res.json(err) )
  })

  //make a route to update the the fave state to true when it is clicked

  app.post("/faves/:id", (req, res) => {
      db.Article.update({"fave": false}, {$set: {"fave": true}})
      .then( (dbArticle) => res.json(dbArticle) )
      .catch( (err) => res.json(err))
  })




/* -/-/-/-/-/-/-/-/-/-/-/-/- */

// Listen on port 3000
app.listen(3000, function () {
    console.log("App running on port 3000!");
});
