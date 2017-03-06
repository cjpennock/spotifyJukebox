// Create Playlist manager object
const PlaylistManager = {};

// We need to create the array to which we will push tracks
PlaylistManager.tracks = [];

// This anchors us on the current song
// No matter how many songs are in the array, 
// the first (one playing) will be current song
PlaylistManager.currentSong = 0;

/*
    @func addTrack
    @param track

    Adds a track id to the end of our array
    PlaylistManager.addTrack('trackId');
*/
PlaylistManager.addTrack = (track = reqParam()) => {
    PlaylistManager.tracks.push(track);
};

// This function removes a track
PlaylistManager.removeById = (id) => {
    // For loop lets us go through each track
    for (let i = 0; i < PlaylistManager.tracks.length; i++) {
        // Track is the track the loop is currently touching
        const track = PlaylistManager.tracks[i];
        // Splice removes the track with the matching id
        if (track.id === id) {
            PlaylistManager.tracks.splice(i, 1);

            break;
        }
    }
}


PlaylistManager.getNextSong = () => {
    PlaylistManager.currentSong++;
    const {tracks, currentSong} = PlaylistManager;

    const len = tracks.length;
    if (currentSong === len) {
        PlaylistManager.currentSong = 0;
    }

    return tracks[PlaylistManager.currentSong].id;
}