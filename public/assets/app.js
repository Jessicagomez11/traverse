const displayArticles = (articles)=> {
    $("tbody").empty()

   
    // Add to the table here...
  
   articles.forEach((article) => {
   
    console.log(article._id)
     let newArticle = $("<tr>").append(
        $("<td>").text(article.title),
        $("<td>").text(article.link).attr("href", article.link),
        $("<td>").append(`<button id=addNote class="btn-floating btn-large waves-effect waves-light modal-trigger" noteData-id=${article._id} ><i class= "material-icons" >mode_comment</i></button>`),
        $("<td>").append(`<button id=fave class="btn-floating pink lighten-4 btn-large waves-effect waves-light modal-trigger" faveData-id=${article._id} ><i class= "material-icons" >grade</i></button>`),
        
      )

      $("tbody").append(newArticle)
      
    
    });
}

//adding an article to favorites

$(document).on("click", "#fave", function (){

  var thisId = this.getAttribute("faveData-id");
  console.log(this)
  console.log(thisId)

  $.ajax({
    method: "POST",
    url: '/faves/'+ thisId,
  }).then( (data)=>{
    console.log("adding to your favorite articles...")
    console.log("data: " + data)
  })
})

//adding a note

$(document).on("click", "#addNote", function() {

  var thisId = this.getAttribute("faveData-id");
  console.log(this)
  console.log(thisId)
console.log("let's add a note")
  
})


//scraping the site
$("#articlesBtn").on("click", () =>{



  $.getJSON("/articles", (data) => {
    
    console.log("i've been clicked!")
      
        displayArticles(data)
        $("#scrapeBtn").hide()
    });
    
   
})


//getting all articles
$("#scrapeBtn").on("click", () =>{

  $.getJSON("/scrape", (data) => {
      
    console.log("data: " + data)
    console.log("scraping articles....")
}).then( ()=>{
  displayArticles()
})

})