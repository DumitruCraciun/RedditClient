import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk pentru a încărca postările de la Reddit
export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (subreddit = 'popular') => {
    // URL-ul original către API-ul Reddit
    const redditUrl = `https://www.reddit.com/r/${subreddit}.json`;
    // Folosește corsproxy.io în loc de allorigins
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(redditUrl)}`;

    console.log("Fetching:", proxyUrl); // Pentru debugging
    
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // data e deja obiectul de la Reddit, nu mai trebuie să parsam
    return data.data.children.map(child => ({
      id: child.data.id,
      title: child.data.title,
      author: child.data.author,
      score: child.data.score,
      num_comments: child.data.num_comments,
      created_utc: child.data.created_utc,
      permalink: child.data.permalink,
      thumbnail: child.data.thumbnail,
      url: child.data.url,
      selftext: child.data.selftext,
    }));
  }
);

// Restul codului rămâne la fel
const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    isLoading: false,
    hasError: false,
    currentSubreddit: 'popular',
  },
  reducers: {
    setCurrentSubreddit: (state, action) => {
      state.currentSubreddit = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      });
  },
});

export const { setCurrentSubreddit } = postsSlice.actions;
export const selectPosts = (state) => state.posts.posts;
export const selectIsLoading = (state) => state.posts.isLoading;
export const selectHasError = (state) => state.posts.hasError;
export const selectCurrentSubreddit = (state) => state.posts.currentSubreddit;

export default postsSlice.reducer;