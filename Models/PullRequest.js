var mongoose = require('mongoose')

var pullRequestSchema = mongoose.Schema = ({
	platform: {
		type : String
	},
	title: {
		type : String
	},
	description: {
		type : String
	},
	author:  {
		type : String
	},
	testers:  {
		type : String
	},
	url : {
		type : String
	},
	open : {
		type : Boolean
	},
	idPullRequest : {
		type: Number,
	},
	priority : {
		type : Number,
		default: 0
	},
	created : {
		type : String,
	},
	updated : {
		type : String,
	},
	testedOnAndroid : {
		type : Boolean,
		default: false
	},
	testedOnIos : {
		type : Boolean,
		default: false
	}
});

function concatAssignees(arrAssignees){
	return arrAssignees.reduce(function(str, el){
		if(str)
			return str+', '+el.login;
		return el.login
	},'')
}

function contains(obj, arr){
	result = true
	arr.forEach(function(el){
		if(obj.number && el.idPullRequest){
			if(obj.number == el.idPullRequest){
				result=false;
			}
		}else{
			if(obj.idPullRequest == el.number){
				result=false;
			}
		}
		
	})
	return result;
}


function updatedPr(id, update){
	var query = {_id:id}
	PullRequest.findOneAndUpdate(query, {$set : update}, {}, function(err, pr){if(err){throw err;}});
}

// function closePullRequest(platform, pr){
// 	var query = {_id:pr._id}
// 	pr.open = false
// 	PullRequest.findOneAndUpdate(query, pr,{}, function(err, pr){if(err){throw err;}});
// }

function insertGitToMongo(platform, prGit){
	prMongo = {
		title: prGit.title,
		description: prGit.body,
		author:  prGit.user.login,
		testers:  concatAssignees(prGit.assignees),
		url : prGit.html_url,
		open : true,
		idPullRequest : prGit.number,
		platform:platform,
		created: prGit.created_at,
		updated: prGit.updated_at
	}
	PullRequest.create(prMongo);
}

function isPullUpdated(obj, arr){
	var result = false
	arr.forEach(function(el){
		if(obj.number == el.idPullRequest){
			if (obj.updated_at > el.updated) {
				console.log(obj.updated_at+" == "+el.updated);
				result = true;
			}else{
				console.log("==> "+obj.updated_at+" == "+el.updated);
			}
		}
	})
	return result
}

var PullRequest = module.exports = mongoose.model('PullRequest', pullRequestSchema);


module.exports.getPullRequests = function (query, callback, limit){
	PullRequest.find(query, callback).limit(limit);
};

module.exports.addBulkPullRequests = function (platform, pullRequest){
	PullRequest.find({open:true, platform: platform}, function(err, pullsOpen){
		if(pullsOpen && pullRequest){
			var newsPullRequests = pullRequest.filter(function(el){return contains(el, pullsOpen)});
			for (var i = 0; i < newsPullRequests.length; i++) {
				insertGitToMongo(platform,newsPullRequests[i])
			}
			var closedPullRequests = pullsOpen.filter(function(el){return contains(el, pullRequest)});
			for (var i = 0; i < closedPullRequests.length; i++) {
				// closePullRequest(platform, closedPullRequests[i]);
				updatedPr(closedPullRequests[i]._id, {open:false})
			}
			// var pullsUpdated = pullRequest.filter(function(el){return isPullUpdated(el, pullsOpen)});
			// for (var i = 0; i < pullsUpdated.length; i++) {
			// 	console.log(pullsUpdated[i].number)
			// }
		}
	});
};

module.exports.addPullRequest = function (pullRequest, callback){
	PullRequest.create(pullRequest, callback);
};

module.exports.updatePullRequest = function (id, update, options){
	updatedPr(id, update)
};

module.exports.changedPriority = function (pullRequests){
	for (var i = 0; i < pullRequests.length; i++) {
		updatedPr(pullRequests[i]._id, {priority: pullRequests[i].priority})
	}
};