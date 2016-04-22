// we use require to import the request package
const request = require('request');

// we create an http request to github.com to list my repositories
request('https://api.github.com/users/zekenie/repos', {
  // Github rejects requests if they don't have a user agent header
  headers: {
    'User-Agent': 'Zeke-s-cool-app'
  }
}, function (error, response, body) {
  // UPON response, we will log the data if there's no error or bad response code.
  if (!error && response.statusCode == 200) {
    console.log(JSON.parse(body));
  } else {
    // If there's trouble, let us know!
    console.error(error);
    console.error(body);
  }
});