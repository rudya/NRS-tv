// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

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


  //get title and url for each post
  posts.forEach((post)=>{
  	console.log(post.data.title)
  	console.log(post.data.url)

  	/*
  	scrap title for nba game
		if nba game post
			get post url
			scrape post for stream links
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
