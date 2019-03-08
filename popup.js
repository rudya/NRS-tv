// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

document.addEventListener("DOMContentLoaded", function() {
	build(games)
/*  getGames()
  .then(posts => {
  	console.log(posts)
  	build()
  })
  .catch((err) => {
  	//no games or get request error
  	console.log(err)
  })*/
});

let games = [
	{
		title:"warriors vs rockets",
		url:"",
		streams:[
			{
				author:"buffstremas",
				links:["link1","link2"]
			},
			{
				author:"buffstreams2",
				links:["link1","link2"]
			},
			{
				author:"buffstreams2",
				links:["link1","link2"]
			}
		]
	},
	{
		title:"heat vs jazz",
		url:"",
		streams:[
			{
				author:"buffstremas",
				links:["link1","link2"]
			},
			{
				author:"buffstreams2",
				links:["link1","link2"]
			}
		]
	},
	{
		title:"lakers vs thunder",
		url:"",
		streams:[
			{
				author:"buffstremas",
				links:["link1","link2"]
			},
			{
				author:"buffstreams2",
				links:["link1","link2"]
			},
			{
				author:"buffstreams2",
				links:["link1","link2"]
			}
		]
	}
]

let build = (games) => {
	let mainContainer = document.getElementById("main-container")

	// create div for each game
  games.forEach((game) => {

		let gameDiv = document.createElement("div")
		gameDiv.className = "game"

		let title = document.createElement("div")
		title.className = "game-title med sm-marg-bot"
		title.innerHTML = game.title

		//appends
		gameDiv.appendChild(title)
		mainContainer.appendChild(gameDiv)
		mainContainer.appendChild(document.createElement('hr'))

		//add bg img
		addImgs(gameDiv)

		//create stream channel divs for each game
		game.streams.forEach((stream) => {

			let streamContainer = document.createElement("div")
			streamContainer.className = "stream-container"

			let streamDiv = document.createElement("div")
			streamDiv.className = "stream sm-marg-bot"

			let author = document.createElement("div")
			author.className = "stream-author"
			author.innerHTML = stream.author

			let linksContainer = document.createElement("div")
			linksContainer.className = "links-container"

			let links = document.createElement("div")
			links.className = "links"

			//appends
			linksContainer.appendChild(links)

			streamDiv.appendChild(author)
			streamDiv.appendChild(linksContainer)

			streamContainer.appendChild(streamDiv)

			gameDiv.appendChild(streamContainer)

			//create links for each stream channel div
			stream.links.forEach((link) => {

				links.innerHTML += link + " "

			})

		})


  })
}

let addImgs = (gameDiv) => {
		let imgContainer = document.createElement("div")
		imgContainer.className = "img-container"
		let img1 = document.createElement("img")
		img1.src = "images/teams/jazz.png"
		let img2 = document.createElement("img")
		img2.className="img2"
		img2.src = "images/teams/jazz.png"
		imgContainer.appendChild(img1)
		imgContainer.appendChild(img2)
		gameDiv.append(imgContainer)
}


let getGames = () => {

	return new Promise((resolve, reject) => {

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
	  	resolve(posts)
	  })
	  .catch(err => {
	  	reject(err)
	  })
	})

}

//returns json parsed response
let getRequest = (url) => {

	return new Promise((resolve, reject)=>{

		let xhr = new XMLHttpRequest();
	 	xhr.addEventListener("load", () => {
	 				if(xhr.status == 200){
	 					resolve(JSON.parse(xhr.response))
	 				}
	 				else{
	 					reject('Something went wrong :/ ' + xhr.response)
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
					let streamsArray = parseCommentData(json, post)
					post.streams = streamsArray
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