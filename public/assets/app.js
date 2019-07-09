const displayArticles = (articles)=> {
    $("tbody").empty()
    // Add to the table here...
  
   articles.forEach((article) => {
  
     let newArticle = $("<tr>").append(
        $("<td>").text(article.title),
        $("<td>").text(article.link).attr("href", article.link),
        $("<td>").append("<button id = "+ "addNote" + " class= " +" btn-floating btn-large waves-effect waves-light modal-trigger"+"><i class=" + "material-icons" +">mode_comment</i>"),
        
        $("<td>").append("<button>")
        .attr("faveData-id", article._id)
        .attr("id", "fave")
        .attr("class", "btn-floating btn-large waves-effect waves-light pink modal-trigger" )
       
        // id = "+ "fave" + " class= " +" btn-floating btn-large waves-effect waves-light pink modal-trigger"+"><i class=" + "material-icons" +">grade</i>"),
       
      )

      $("tbody").append(newArticle)
      
      // document.getElementById("fave").setAttribute("faveData-id", article._id)
      // document.getElementById("addNote").setAttribute("noteData-id", article._id)
      
    });
}

$(document).on("click", "#fave", function (){

  var thisId = this.getAttribute("faveData-id");
  console.log(this)
  console.log(thisId)

  $.ajax({
    method: "POST",
    url: '/faves/'+ thisId,
  }).then( (data)=>{
    console.log("adding to your favorite articles...")
    console.log("data: "+data)

  })

  
})

$(document).on("click", "#addNote", () =>{
console.log("let's add a note")
  
})



$(document).on("click", "#scrapeBtn", () =>{

    console.log("i've been clicked!")
    $.getJSON("/articles", (data) => {
      
      console.log("data: " + data)
          console.log("fetching results")
        displayArticles(data)
        $("#scrapeBtn").hide()
    });
    
})