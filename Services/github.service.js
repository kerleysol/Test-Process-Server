'use strict';
(function() {
  var GitHubService = function() {
    var https = require('https');
    var app = this;
    app.console = function(){
      console.log("Kerley");
    }
    app.getOpenPullRequestsDashboard = function(callback){
      var user = "kerleysol"
      var pass = '1220swat'
      var options = {
        hostname: 'api.github.com',
        path: '/repos/HeavyConnected/dashboard/pulls',
        method: 'GET',
        headers: { 
          Authorization: 'Basic '+ new Buffer(user+":"+pass).toString('base64'),
          'User-Agent':'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)'
        }
      };
      var req = https.request(options, function(res) {
        var str=""
        res.on('data', function (chunk) {
            str+=chunk
        });
        res.on('end', function () {
          callback(str)
        });
      });
      req.end();
    }

    app.getOpenPullRequestsIonic = function(callback){
      var user = "kerleysol"
      var pass = '1220swat'
      var options = {
        hostname: 'api.github.com',
        path: '/repos/HeavyConnected/HC-Ionic/pulls',
        method: 'GET',
        headers: { 
          Authorization: 'Basic '+ new Buffer(user+":"+pass).toString('base64'),
          'User-Agent':'Mozilla/4.0 (compatible; MSIE 7.0; Windows NT 6.0)'
        }
      };
      var req = https.request(options, function(res) {
        var str=""
        res.on('data', function (chunk) {
            str+=chunk
        });
        res.on('end', function () {
          callback(str)
        });
      });
      req.end();
    }


  };
  module.exports = function() {
    return new GitHubService();
  };
}());