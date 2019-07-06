const displayArticles = (articles)=> {
    $("tbody").empty()
    // Add to the table here...
  
   articles.forEach((article) => {
  
     let newArticle = $("<tr>").append(
        $("<td>").text(article.title),
        $("<td>").text(article.link),
       
  
      )
      $("tbody").append(newArticle)
    });
}


$("#scrapeBtn").on("click", ()=>{
    console.log("i've been clicked!")
    $.getJSON("/all", (data) => {
        displayArticles(data)
    });
    
})