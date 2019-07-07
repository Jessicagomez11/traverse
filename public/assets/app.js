const displayArticles = (articles)=> {
    $("tbody").empty()
    // Add to the table here...
  
   articles.forEach((article) => {
  
     let newArticle = $("<tr>").append(
        $("<td>").text(article.title),
        $("<td>").text(article.link),
        $("<td>").append("<button id = "+ "addNote" + " class= " +" btn-floating btn-large waves-effect waves-light"+"><i class=" + "material-icons" +">mode_comment</i>"),
        $("<td>").append("<button id = "+ "fave" + " class= " +" btn-floating btn-large waves-effect waves-light pink"+"><i class=" + "material-icons" +">grade</i>"),
       
      )

      $("tbody").append(newArticle)

      
    });
}

$(".fave").on("click", () =>{
  console.log("adding to your favorite articles...")
 
  // $.get.json('/faves/:id', (data) => {
  // })
})



$("#scrapeBtn").on("click", ()=>{
    console.log("i've been clicked!")
    $.getJSON("/articles", (data) => {
        displayArticles(data)
        $("#scrapeBtn").hide()
    });
    
})