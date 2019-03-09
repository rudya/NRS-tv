// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

let preload = document.getElementById('preload')
let noGames = document.getElementById('no-games')
let mainContainer = document.getElementById("main-container")


document.addEventListener("DOMContentLoaded", function() {
	//build(games)
  getGames()
  .then(posts => {
  	console.log(posts)
  	preload.style.setProperty('display', 'none')
  	mainContainer.style.setProperty('display', 'block')
  	build(posts)
  })
  .catch((err) => {
  	//no games or get request error
  	preload.style.setProperty('display', 'none')
  	noGames.style.setProperty('display', 'flex')
  	console.log(err)
  })
});

let games = [
	{
		title:"Golden State Warriors @ Houston Rockets",
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
		title:"Miami Heat vs Utah Jazz",
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
		title:"Los Angeles Lakers vs Oklahoma City Thunder",
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
		title:"Los Angeles Lakers vs Oklahoma City Thunder",
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
		title:"Miami Heat vs Utah Jazz",
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
	}
]

let build = (games) => {
	let matchupsContainer = document.getElementById("matchups-container")

	// create div for each game
  games.forEach((game,index) => {

		let gameDiv = document.createElement("div")
		gameDiv.id = "matchup" + index;
		gameDiv.className = "game"

		let title = document.createElement("div")
		title.className = "game-title med sm-marg-bot"
		title.innerHTML = game.title

		//appends
		gameDiv.appendChild(title)
		mainContainer.appendChild(document.createElement('hr'))
		mainContainer.appendChild(gameDiv)

		//add bg img
		addImgs(matchupsContainer, game.title, index)

		if (game !== null){
			
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

				if (stream.links !== null){

					//create links for each stream channel div
					stream.links.forEach((link, index) => {
						let linkTag = document.createElement('a')
						linkTag.href = link
						linkTag.target="_blank"
						linkTag.innerHTML = 'link' + (index + 1) 
						links.appendChild(linkTag)

					})
				}

			})
		} 



  })
}

let determineTeams = (string) => {
	let logos = []
	teams.forEach((team) => {
		let index = string.search(team.name)
		if (index !== -1){
			logos.push({link:team.link, index:index})
		}
	})

	logos.sort((a,b) => {
		return a.index - b.index;
	})

	return [logos[0].link, logos[1].link]
}

let addImgs = (matchupsContainer, title, index) => {

	let logos = determineTeams(title)

	let imgContainer = document.createElement("div")
	imgContainer.className = "img-container"
	let img1 = document.createElement("img")
	img1.src = logos[0]
	let img2 = document.createElement("img")
	img2.className="img2"
	img2.src = logos[1]
	imgContainer.appendChild(img1)
	imgContainer.appendChild(document.createTextNode(" @ "))
	imgContainer.appendChild(img2)

	let anchor = 'matchup' + 'index'
	matchupsContainer.append(imgContainer)
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

	  			//remove parentheses
	  			if (regex !== null){

		  			let newRegex=regex.map((link)=>{
		  				let noParenthesesLink = link.slice(1,-1)
		  				return noParenthesesLink
		  			})

		  			regex = newRegex
	  			}

	  			commentsArray.push({
	  				author:comment.data.author,
	  				links:regex
	  			})
	  		}
	  	})

	  	return commentsArray

}

const teams = [
	{name:"Atlanta Hawks", link:"images/teams/hawks.png"},
	{name:"Boston Celtics", link:"images/teams/celtics.png"},
	{name:"Brooklyn Nets", link:"images/teams/nets.png"},
	{name:"Charlotte Hornets", link:"images/teams/hornets.png"},
	{name:"Chicago Bulls", link:"images/teams/bulls.png"},
	{name:"Cleveland Cavaliers", link:"images/teams/cavaliers.png"},
	{name:"Dallas Mavericks", link:"images/teams/mavericks.png"},
	{name:"Denver Nuggets", link:"images/teams/nuggets.png"},
	{name:"Detroit Pistons", link:"images/teams/pistons.png"},
	{name:"Golden State Warriors", link:"images/teams/warriors.png"},
	{name:"Houston Rockets", link:"images/teams/rockets.png"},
	{name:"Indiana Pacers", link:"images/teams/pacers.png"},
	{name:"Los Angeles Clippers", link:"images/teams/clippers.png"},
	{name:"Los Angeles Lakers", link:"images/teams/lakers.png"},
	{name:"New York Knicks", link:"images/teams/knicks.png"},
	{name:"Memphis Grizzlies", link:"images/teams/grizzlies.png"},
	{name:"Miami Heat", link:"images/teams/heat.png"},
	{name:"Milwaukee Bucks", link:"images/teams/bucks.png"},
	{name:"Minnesota Timberwolves", link:"images/teams/timberwolves.png"},
	{name:"New York Knicks", link:"images/teams/knicks.png"},
	{name:"New Orleans Pelicans", link:"images/teams/pelicans.png"},
	{name:"Oklahoma City Thunder", link:"images/teams/thunder.png"},
	{name:"Orlando Magic", link:"images/teams/magic.png"},
	{name:"Philadelphia 76ers", link:"images/teams/76ers.png"},
	{name:"Phoenix Suns", link:"images/teams/suns.png"},
	{name:"Portland Trail Blazers", link:"images/teams/trialblazers.png"},
	{name:"San Antonio Spurs", link:"images/teams/spurs.png"},
	{name:"Toronto Raptors", link:"images/teams/raptors.png"},
	{name:"Utah Jazz", link:"images/teams/jazz.png"},
	{name:"Washington Wizards", link:"images/teams/wizards.png"},
]