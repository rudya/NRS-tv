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
  getRequest("https://www.reddit.com/r/nbastreams/hot.json")
  .then(json => {

  	//get Game Thread Posts
  	return getPosts(json)
  })
  .then(posts => {

  	//scape comments
		return scrapeComments(posts)
  })
  .then(posts => {
  	console.log(posts)
  })
  .catch(err => {
  	console.log(err)
  })

  
});

//returns json parsed response
let getRequest = (url) => {

	return new Promise((resolve, reject)=>{

		let xhr = new XMLHttpRequest();
	 	xhr.addEventListener("load", () => {
	 				if(xhr.status == 200){
	 					resolve(JSON.parse(xhr.response))
	 				}
	 				else{
	 					reject('status code: ' + xhr.response)
	 				}
	    }, false);
	  xhr.open("GET", url)
	  xhr.send()
	})
}

// returns array of posts
let getPosts = (json) => {
	
	return new Promise((resolve, reject) => {

		//parse json
	  let data = json.data.children

	  let posts = []

	  //get title and url for each post
	  data.forEach((post)=>{

	  	if (post.data.link_flair_text === "Game Thread"){
		  	posts.push({
		  		title:post.data.title,
		  		url:post.data.url
		  	})
	  	}
	  })

	  if (posts.length !== 0){
	  	resolve(posts)
	  }else{
	  	reject('no games')
	  }
	})
}


let scrapeComments = (posts) => {

	return new Promise((resolve) => {

		let games = posts.map((post) => {

			return new Promise((resolve) => {
				getRequest(post.url + '.json')
				.then(json => {
					let commentsArray = parseCommentData(json, post)
					post.comments = commentsArray
					resolve( 
						post
					 ) 
				})
			})

		})

		Promise.all(games).then(() => {
			resolve(posts)
		})

	})

}

// returns comments as array of objects 
/*
	[
		{
			author:"",
			links:[]
		}
	]
*/
let parseCommentData = (json, post) => {

	let commentsArray = []

	//get comments data
	let comments = json[1].data.children

			//shift to skip stickied post
	  	comments.shift()
	  	comments.forEach((comment) => {

	  		if(comment.data.author !== "AutoModerator"){

	  			let regex = comment.data.body.match(/\(+(http)(.*?)\)/g);
	  			commentsArray.push({
	  				author:comment.data.author,
	  				links:regex
	  			})
	  		}
	  	})

	  	return commentsArray

}

