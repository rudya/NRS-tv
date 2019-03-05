// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

const teams = [
	{name:"Atlanta Hawks", color:""},
	{name:"Boston Celtics", color:""},
	{name:"Brooklyn Nets", color:""},
	{name:"Charlotte Bobcats", color:""},
	{name:"Chicago Bulls", color:""},
	{name:"Cleveland Cavaliers", color:""},
	{name:"Dallas Maveriks", color:""},
	{name:"Denver Nuggets", color:""},
	{name:"Detroit Pistons", color:""},
	{name:"Golden State Warrios", color:""},
	{name:"Houston Rockets", color:""},
	{name:"Indiana Pacers", color:""},
	{name:"Los Angeles Clippers", color:""},
	{name:"Los Angeles Lakers", color:""},
	{name:"New York Knicks", color:""},
	{name:"Memphis Grizzlies", color:""},
	{name:"Miami Heat", color:""},
	{name:"Milwaukee Bucks", color:""},
	{name:"Minnesota Timberwolves", color:""},
	{name:"New York Knicks", color:""},
	{name:"New Orleans Pelicans", color:""},
	{name:"Oklahoma City Thunder", color:""},
	{name:"Orlando Magic", color:""},
	{name:"Philadelphia 76ers", color:""},
	{name:"Phoenix Suns", color:""},
	{name:"Portland Trail Blazers", color:""},
	{name:"San Antonio Spurs", color:""},
	{name:"Toronto Raptors", color:""},
	{name:"Utah Jazz", color:""},
	{name:"Washington Wizards", color:""},
]


chrome.runtime.onInstalled.addListener(function() {

  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log("The color is green.");
  });


  //get nbaredditstreams json
  let json = httpGet("https://www.reddit.com/r/nbastreams/hot.json")

  //parse json
  let data = JSON.parse(json).data

  //get posts
  let posts = data.children

  //console.log(posts)
  //get title and url for each post
  posts.forEach((post)=>{

  	/*if (post.data.link_flair_text === "Game Thread"){*/
  	if(post.data.title === "Game Thread: Dallas Mavericks @ Brooklyn Nets (19:30 PM ET)"){
	  	//console.log(post.data.title)
	  	//console.log(post.data.url)
	  	json = httpGet(post.data.url+'.json')

	  	//get comments data
	  	data = JSON.parse(json)
	  	let comments = data[1].data.children

	  	//shift to skip stickied post
	  	comments.shift()
	  	console.log(comments)

	  	comments.forEach((comment) => {
	  		if(comment.data.author !== "AutoModerator"){
	  			console.log(comment.data.author)
	  			console.log(comment.data.body)
	  		}
	  	})
  	}

  	/*
  	scrap title for nba game
		if nba game post
			get post url
			scrape post for stream links
				skip post data and go to comments
				skip "join discord" stickied comment, filter 
				scrape stream links
			store nba game match up and stream links
			
		*/
  })

  
});

function httpGet(theUrl){
  var xmlHttp = null;

  xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", theUrl,false)
  xmlHttp.onreadystatechange=function()
  {
      if (xmlHttp.readyState==4 && xmlHttp.status==200)
      {
          return xmlHttp.responseText;
      }
  }
  xmlHttp.send( null );
  return xmlHttp.responseText;
}
