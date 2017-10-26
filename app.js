var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

PullRequest = require('./Models/PullRequest')
GitHubService = require('./Services/github.service');


// mongoose.connect('mongodb://localhost/pullRequests')
mongoose.connect('mongodb://heroku_6k0pw1fc:v6ngfojvien2m6rj2i3bqthiu8@ds235785.mlab.com:35785/heroku_6k0pw1fc');
app.use(bodyParser.json())



gitHubService = new GitHubService();
temp = 1;

setInterval(function(){
	console.log("["+temp+"]Requesting...")
	temp++;
	gitHubService.getOpenPullRequestsDashboard(function(result){
		PullRequest.addBulkPullRequests("Dashboard", JSON.parse(result));
	})
	gitHubService.getOpenPullRequestsIonic(function(result){
		PullRequest.addBulkPullRequests("Ionic", JSON.parse(result));
	})
// }, 1000 * 10);
}, 1000 * 60);

app.get('/', function (req, res) {
	res.send("API Pull Requests - Kerley de Sousa Dantas");
});

app.get('/pullRequests', function (req, res) {
	PullRequest.getPullRequests(null, function(err, pullRequests){
		if(err){
			throw err;
		}
		res.json(pullRequests);
	});
})

app.get('/openedPullRequests', function (req, res) {
	PullRequest.getPullRequests({open:true}, function(err, pullRequests){
		if(err){
			throw err;
		}
		res.json(pullRequests.sort(function(a,b){return b.priority - a.priority}));
	});
})

// app.get('/farmer/:_id', function (req, res) {
// 	Farmer.getFarmerById(req.params._id, function(err, farmer){
// 		if(err){
// 			throw err;
// 		}
// 		res.json(farmer);
// 	});
// })

app.post('/pullRequest', function (req, res) {
	var pull = req.body;
	PullRequest.addPullRequest(pull, function(err, pull){
		if(err){
			throw err;
		}
		res.json(pull);
	});
})

app.post('/changedPriority', function (req, res) {
	var pulls = req.body;
	PullRequest.changedPriority(pulls);
	res.json({status:200});
})

app.put('/pullRequest/:id', function (req, res) {
	var id = req.params.id;
	var update = req.body;
	PullRequest.updatePullRequest(id, update, {});
	res.json({status:200});
})

app.listen(process.env.PORT || 5000)
console.log("Running...")