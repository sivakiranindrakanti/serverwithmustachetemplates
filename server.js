const express = require('express');
const template = require("mustache");
const path = require('path');
var app = require('express')();
app.use("/", express.static(path.join(__dirname, "./public")));
app.get('/Storybook/page/:id', (req,res) =>{
  var Number = req.params.id;
  console.log(Number);
  var pageDetails = getmypage(Number);
  res.send(pageDetails);
});

function getmypage(Number){
  const fs = require('fs');
  var  data = fs.readFileSync('story.json', (err) => {if (err) throw err;});
  let data1 = JSON.parse(data);
  var pageData = { "telugu_txt":data1.title,
                  "english_txt":data1.title_en,
                  "next_page_url":Number -1 +2,
                  "previous_page_url":Number-1,
                  "image":data1.cover_image,
                };
  if(Number == 1){
    var page = fs.readFileSync('view/title.mustache','utf8',  (err) => {if (err) throw err;});
    var myPage = template.render( page.toString(), pageData); 
    return(myPage);
  }
  else if(Number >= 2){
    var pages = data1.pages;
    var currentPage = pages[Number - 2];
    if(currentPage == null){
         var endData = { "endPage":"THE END",
                        "previous_page_url":Number-1,
                       };
         var page = fs.readFileSync('view/endpage.mustache','utf8',  (err) => {if (err) throw err;});
         var myPage = template.render(page.toString(), endData);
         return(myPage);
    }
    else{
      var pageData = {"telugu_txt":currentPage.telugu,
                  "english_txt":currentPage.english,
                  "next_page_url":Number -1 +2,
                  "previous_page_url":Number-1,
                  "image":currentPage.image,
                }; 
    var page = fs.readFileSync('view/page.mustache','utf8',  (err) => {if (err) throw err;});
    var myPage = template.render( page.toString(), pageData);
    return (myPage);
    }
  }
} 
app.listen(3000, () => {
  console.log('server started');  
});