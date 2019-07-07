const displayArticles = (articles)=> {
    $("tbody").empty()
    // Add to the table here...
  
   articles.forEach((article) => {
  
     let newArticle = $("<tr>").append(
        $("<td>").text(article.title),
        $("<td>").text(article.link).attr("href", article.link),
        $("<td>").append("<button id = "+ "addNote" + " class= " +" btn-floating btn-large waves-effect waves-light modal-trigger"+"><i class=" + "material-icons" +">mode_comment</i>")
        .attr("data-id", article._id).attr("data-target", "noteModal"),
        $("<td>").append("<button id = "+ "fave" + " class= " +" btn-floating btn-large waves-effect waves-light pink modal-trigger"+"><i class=" + "material-icons" +">grade</i>")
        .attr("data-id", article._id).attr("data-target", "faveModal"),
       
      )

      $("tbody").append(newArticle)

      
    });
}

$(".fave").on("click", () =>{
  console.log("adding to your favorite articles...")
  $('.modal').modal();
 
  // $.get.json('/faves/:id', (data) => {
  // })
})

$(document).on("click", "#addNote", () =>{
  $('.modal').modal();
  
})



$("#scrapeBtn").on("click", ()=>{
    console.log("i've been clicked!")
    $.getJSON("/articles", (data) => {
        displayArticles(data)
        $("#scrapeBtn").hide()
    });
    
})