// Data tasks
// Declare a const for SpotifyAPI and make it an object
// to which we can push properties to form our API search function
const SpotifyAPI = {};
// now add the base url
SpotifyAPI.urlBase = 'https://api.spotify.com';
// now add version
SpotifyAPI.version = 1;

// Function - url builder
// Still working within SpotifyAPI
SpotifyAPI.getUrlBase = () => {
	// Create SpotifyAPI.urlBase & SpotifyAPI.version 
	// in this function
	const {urlBase, version} = SpotifyAPI;
	return urlBase + '/v' + version + '/';
};
// Complete the url, leave endpoint arg and define within the next function
// 
SpotifyAPI.getUrlString = (endpoint) => {
	return SpotifyAPI.getUrlBase() + endpoint + '/?';
};

// Here is the search function that will actually make the call to Spotify API
// 	   
// @func search
// @param {string} q
// @param {string} type
// @returns {Promise}
// @desc - takes a searchQuery
// type arg, returns promise that makes
// call to Spotify API

/* After this is complete, we can go back to our app.js
    and have the search run on click events
    We will .then the function below within runSearch
*/
SpotifyAPI.search = (q = reqParam(), type = 'track') => {
    return new Promise((resolve, reject) => {
    	// Still confused as to how query becomes q
        const url = SpotifyAPI.getUrlString('search') + 'q=' + q + '&type=' + type;

        
        const http = new XMLHttpRequest();
        http.open('GET', url);

        http.onload = () => {
            const data = JSON.parse(http.responseText);
            resolve(data);
            // Console.log and it works!
            // Returns tracks of 'search' value
            console.log(data)
        };

        http.send();
    });
   };

