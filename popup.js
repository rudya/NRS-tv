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
  	//console.log(posts)
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
	{city:"Atlanta", name:"Hawks", link:"images/teams/hawks.png"},
	{city:"Boston", name:"Celtics", link:"images/teams/celtics.png"},
	{city:"Brooklyn", name:"Nets", link:"images/teams/nets.png"},
	{city:"Charlotte", name:"Hornets", link:"images/teams/hornets.png"},
	{city:"Chicago", name:"Bulls", link:"images/teams/bulls.png"},
	{city:"Cleveland", name:"Cavaliers", link:"images/teams/cavaliers.png"},
	{city:"Dallas", name:"Mavericks", link:"images/teams/mavericks.png"},
	{city:"Denver", name:"Nuggets", link:"images/teams/nuggets.png"},
	{city:"Detroit", name:"Pistons", link:"images/teams/pistons.png"},
	{city:"Golden State", name:"Warriors", link:"images/teams/warriors.png"},
	{city:"Houston", name:"Rockets", link:"images/teams/rockets.png"},
	{city:"Indiana", name:"Pacers", link:"images/teams/pacers.png"},
	{city:"Los Angeles", name:"Clippers", link:"images/teams/clippers.png"},
	{city:"Los Angeles", name:"Lakers", link:"images/teams/lakers.png"},
	{city:"New York", name:"New York Knicks", link:"images/teams/knicks.png"},
	{city:"Memphis", name:"Grizzlies", link:"images/teams/grizzlies.png"},
	{city:"Miami", name:"Heat", link:"images/teams/heat.png"},
	{city:"Milwaukee", name:"Bucks", link:"images/teams/bucks.png"},
	{city:"Minnesota", name:"Timberwolves", link:"images/teams/timberwolves.png"},
	{city:"New York", name:"Knicks", link:"images/teams/knicks.png"},
	{city:"New Orleans", name:"Pelicans", link:"images/teams/pelicans.png"},
	{city:"Oklahoma City", name:"Thunder", link:"images/teams/thunder.png"},
	{city:"Orlando", name:"Magic", link:"images/teams/magic.png"},
	{city:"Philadelphia", name:"76ers", link:"images/teams/76ers.png"},
	{city:"Phoenix", name:"Suns", link:"images/teams/suns.png"},
	{city:"Portland", name:"Trail Blazers", link:"images/teams/trailblazers.png"},
	{city:"Sacramento", name:"Kings", link:"images/teams/kings.png"},
	{city:"San Antonio", name:"Spurs", link:"images/teams/spurs.png"},
	{city:"Toronto", name:"Raptors", link:"images/teams/raptors.png"},
	{city:"Utah", name:"Jazz", link:"images/teams/jazz.png"},
	{city:"Washington", name:"Wizards", link:"images/teams/wizards.png"},
]