// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

const teams = [
	{name:"Atlanta Hawks", link:""},
	{name:"Boston Celtics", color:""},
	{name:"Brooklyn Nets", color:""},
	{name:"Charlotte Hornets", color:""},
	{name:"Chicago Bulls", color:""},
	{name:"Cleveland Cavaliers", color:""},
	{name:"Dallas Maveriks", color:""},
	{name:"Denver Nuggets", color:""},
	{name:"Detroit Pistons", color:""},
	{name:"Golden State Warriors", color:""},
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

});


