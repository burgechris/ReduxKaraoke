// LYRIC INFO
const songList = {
  1: "Don't want to be a fool for you, Just another player in your game for two, You may hate me but it ain't no lie, Baby bye bye bye, Bye bye, I Don't want to make it tough, I just want to tell you that I've had enough, It might sound crazy but it ain't no lie, Baby bye bye bye".split(', '),
  2: "I threw a wish in the well, Don't ask me I'll never tell, I looked at you as it fell, And now you're in my way, I'd trade my soul for a wish, Pennies and dimes for a kiss, I wasn't looking for this, But now you're in my way, Your stare was holding, Ripped jeans, skin was showin', Hot night, wind was blowin', Where you think you're going baby?, Hey, I just met you and this is crazy, But here's my number, so call me maybe, It's hard to look right at you baby, But here's my number, so call me maybe, Hey I just met you and this is crazy, But here's my number, so call me maybe, And all the other boys try to chase me, But here's my number, so call me maybe".split(', ')
};

// Initial Redux
const initialState = {
  currentSongId: null,
  songsById: {
    1: {
      title: "Bye Bye Bye",
      artist: "N'Sync",
      songId: 1,
      songArray: songList[1],
      arrayPosition: 0,
    },
    2: {
      title: "Call Me Maybe",
      artist: "CRJ",
      songId: 2,
      songArray: songList[2],
      arrayPosition: 0,

    }
  }
};

//Redux Reducer
const lyricChangeReducer = (state = initialState.songsById, action) => {
  let newArrayPosition;
  let newSongsByIdEntry;
  let newSongsByIdStateSlice;
  switch (action.type) {
    case 'NEXT_LYRIC':
      newArrayPosition = state[action.currentSongId].arrayPosition + 1;
      newSongsByIdEntry = Object.assign({}, state[action.currentSongId], {
        arrayPosition: newArrayPosition
      })
      newSongsByIdStateSlice = Object.assign({}, state, {
        [action.currentSongId] : newSongsByIdEntry
      });
      return newSongsByIdStateSlice
    case 'RESTART_SONG':
      newSongsByIdEntry = Object.assign({}, state[action.currentSongId], {
        arrayPosition: 0
      })
      newSongsByIdStateSlice= Object.assign({}, state, {
        [action.currentSongId]: newSongsByIdEntry
      });
      newState = initialState;
      return newSongsByIdStateSlice;
    default:
      return state;
  }
}

const songChangeReducer = (state = initialState.currentSongId, action) => {
  switch (action.type){
    case 'CHANGE_SONG':
      return action.newSelectedSongId
    default:
      return state;
  }
}

const rootReducer = this.Redux.combineReducers({
  currentSongId: songChangeReducer,
  songsById: lyricChangeReducer
});

//Jest Tests + Setup
const { expect } = window;

expect(lyricChangeReducer(initialState.songsById, { type: null })).toEqual(initialState.songsById);

expect(lyricChangeReducer(initialState.songsById, { type: 'NEXT_LYRIC', currentSongId: 2 })).toEqual({
  1: {
    title: "Bye Bye Bye",
    artist: "N'Sync",
    songId: 1,
    songArray: songList[1],
    arrayPosition: 0,
  },
  2: {
    title: "Call Me Maybe",
    artist: "CRJ",
    songId: 2,
    songArray: songList[2],
    arrayPosition: 1,

  }
});

expect(lyricChangeReducer(initialState.songsById, { type: 'RESTART_SONG', currentSongId: 1 })).toEqual({
  1: {
    title: "Bye Bye Bye",
    artist: "N'Sync",
    songId: 1,
    songArray: songList[1],
    arrayPosition: 0,
  },
  2: {
    title: "Call Me Maybe",
    artist: "CRJ",
    songId: 2,
    songArray: songList[2],
    arrayPosition: 0,

  }
});

expect(songChangeReducer(initialState, { type: 'CHANGE_SONG', newSelectedSongId: 1  })).toEqual(1);

expect(rootReducer(initialState, { type: null })).toEqual(initialState);

// expect(store.getState().currentSongId).toEqual(songChangeReducer(undefined, { type: null }));
// expect(store.getState().songsById).toEqual(lyricChangeReducer(undefined, { type: null }));

// Redux Store
const { createStore } = Redux;
const store = createStore(rootReducer);

//Rendering State in DOM
const renderLyrics = () => {
  const lyricsDisplay = document.getElementById('lyrics');
  while (lyricsDisplay.firstChild) {
    lyricsDisplay.removeChild(lyricsDisplay.firstChild);
  }

  if (store.getState().currentSongId) {
    const currentLine = document.createTextNode(store.getState().songsById[store.getState().currentSongId].songArray[store.getState().songsById[store.getState().currentSongId].arrayPosition]);
    document.getElementById('lyrics').appendChild(currentLine);
  } else {
      const selectSongMessage = document.createTextNode("Select a song fron the menu above to sing along!");
      document.getElementById('lyrics').appendChild(selectSongMessage);
  }
}

const renderSongs = () => {
  console.log('renderSongs method successfully fired!');
  console.log(store.getState());
  const songsById = store.getState().songsById;
  for (const songKey in songsById) {
    const song = songsById[songKey]
    const li = document.createElement('li');
    const h3 = document.createElement('h3');
    const em = document.createElement('em');
    const songTitle = document.createTextNode(song.title);
    const songArtist = document.createTextNode(' by ' + song.artist);
    em.appendChild(songTitle);
    h3.appendChild(em);
    h3.appendChild(songArtist);
    h3.addEventListener('click', function() {
      selectSong(song.songId);
    });
    li.appendChild(h3);
    document.getElementById('songs').appendChild(li);
  }
}

window.onload = function () {
  renderSongs();
  renderLyrics();
}

// Click Listener
const userClick = () => {
  if (store.getState().songsById[store.getState().currentSongId].arrayPosition === store.getState().songsById[store.getState().currentSongId].songArray.length - 1) {
    store.dispatch({ type: 'RESTART_SONG',
                     currentSongId: store.getState().currentSongId });
  } else {
    store.dispatch({ type: 'NEXT_LYRIC',
                     currentSongId: store.getState().currentSongId });
  }
}

const selectSong = (newSongId) => {
  let action;
    if (store.getState().currentSongId) {
      action = {
        type: 'RESTART_SONG',
        currentSongId: store.getState().currentSongId
      }
      store.dispatch(action);
    }
    action = {
      type: 'CHANGE_SONG',
      newSelectedSongId: newSongId
    }
    store.dispatch(action);
  }


// Subscribe to Redux Store
store.subscribe(renderLyrics);
