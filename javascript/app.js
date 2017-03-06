// General utility functions go in this js
// Should think of it as the user facing
// For example, we make the API search in another script,
// then link that to our search function, button, and input below

(function() {//Protect the lemmings


// Validate search to ensure text was entered and 
const validateSearch = (value) => {
	return new Promise((resolve, reject) => {
		// If no text is entered, reject the promise
		if (value.trim() === "") {
			reject('Please input a value');
		}
		// If text is entered, then resolve data, our arg
		resolve(value);
	})
};

// Add results to the results section on our site
// Note - this isn't going to work until it is added as part of runSearch
// Later we'll add a track value in another function?
 const addTrackToHTML = (track) => {
        const {name, preview_url, id, album} = track;
        const imageUrl = album.images[1].url;
        // ^^^^ simpler version of the below set of lines
        // const name = track.name
        // const preview_url = track.preview_url
        // const id = track.id
        // const album = track.album
        // add the generate HTML contents to the search results div
        const div = document.createElement('div');
        console.log(div);
        div.classList.add('ui', 'card', 'dimmable');
        div.innerHTML = getCardMarkup(name, preview_url, id, album, imageUrl, false);
        results.appendChild(div);
        div.addEventListener('click',() => {
            PlaylistManager.addTrack(track);
            const currentIndex = PlaylistManager.tracks.length - 1;
            const playlistTrack = document.createElement('div');
            playlistTrack.classList.add('ui', 'card', 'trackid-' + id);
            playlistTrack.innerHTML = `
					<div class="item playlist-track trackid-${id}">
					    <a href="#" class="playlist-close js-playlist-close">
					        <i class="icon remove"></i>
					    </a>
					    <div class="ui tiny image">
					      <img src="${imageUrl}">
					    </div>
					    <div class="middle aligned content playlist-content">
					      ${name}
					    </div>
					</div>
					        <audio controls style="width: 100%;">
					            <source src="${preview_url}">
					        </audio>
					            `
            playlist.appendChild(playlistTrack)
            // get the AUDIO tag
            const audio = playlistTrack.querySelector('audio');
            audio.addEventListener('play', () => {
                PlaylistManager.currentSong = currentIndex;
            });
            audio.addEventListener('ended', () => {
                console.log('done!')
                const nextTrackId = PlaylistManager.getNextSong();
                setTimeout(() => {
                    document.querySelector(`.trackid-${nextTrackId} audio`).play();
                }, 1000);
                
            })
            // This code makes the second button
           const closeBtn = playlistTrack.querySelector('.js-playlist-close');
           closeBtn.addEventListener('click', () => {
                if (PlaylistManager.currentSong === currentIndex) {
                    const nextTrackId = PlaylistManager.getNextSong();
                    setTimeout(() => {
                        document.querySelector(`.trackid-${nextTrackId} audio`).play();
                    }, 500);
                }
                PlaylistManager.removeById(id);
                playlist.removeChild(playlistTrack);
           })
        })
   
    }

const button = document.querySelector('.js-button');
const input = document.querySelector('.js-searchfield');
// Now that we are getting data back from our call, 
// display results
// Need to declare our results section - REMEMBER TO CONSOLE.LOG
const results = document.querySelector('.search-results.js-search-results');
console.log(results);
const playlist = document.querySelector('.js-playlist');
// Create card markup function
// This needs to be below results variable declaration
// The HTML is the HTML that will create our mini album modules
const getCardMarkup = (name, preview_url, id, album, imageUrl, isDimmed) => {
        let html = `
            <div class="image">
                <img src="${imageUrl}">
            </div>
            <div class="content">
                <a class="header">${name}</a>
                <div class="meta">${album.name}</div>
                <div class="description">
                    <audio controls class="${id}" style="width: 100%;">
                        <source src="${preview_url}">
                    </audio>
                </div>
            </div>
        `;
        if (isDimmed) {
            html += `<div class="ui dimmer transition visible active" style="display: block !important;"></div>`;
        }
        return html;
    }
// Here is our search
const runSearch = () => {
	return new Promise((resolve, reject) => {
	// Declare input.value
	const {value} = input;
	// First we run validate search 
	validateSearch(value)
	// Now we need to clear the input and disable input/button
	// Whatever is in this .then is what q will be in SpotifyAPI.search
	// Still don't totally understand this
		.then((query) => {
			console.log('about to search Spotify for', query);
			input.value = '';
			input.setAttribute('disabled', 'disabled');
			button.setAttribute('disabled', 'disabled');

			// We return the promise for SpotifyAPI.search to end
			return SpotifyAPI.search(query)
		}).then((data) => {
                // bring back the input fields
                input.removeAttribute('disabled');
                button.removeAttribute('disabled');
                // clear search results
                results.innerHTML = "";
                // append new results
                const tracks = data.tracks.items;
                for(const track of tracks) {
                    addTrackToHTML(track);
                }
            })
            .catch((e) => {
                alert(e);
            });
    })
		
};

// Add event listener for button and for input field
// Once we make our search function, we will come back and put the
// function in place of the console.log
button.addEventListener('click', (e) => runSearch());
input.addEventListener('keydown', (e) => {
	// Add properties to e using es6
	const {keyCode, which} = e;
	// if keycode is 13 we want to run our search
	if (e.keyCode === 13 || e.which === 13) {
		runSearch();
	}
});

})();