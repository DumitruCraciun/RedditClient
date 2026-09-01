// reddit-client/src/features/posts/postsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// 🔥 SCHIMBĂ asta - nu mai folosim proxy-ul
// const API_BASE = process.env.REACT_APP_API_URL || 'https://redditproxy-2ck0.onrender.com';

// Inlocuiește cu URL-ul direct al Reddit
const API_BASE = 'https://www.reddit.com';

export const fetchPosts = createAsyncThunk(
  'posts/fetchPosts',
  async (subreddit = 'popular') => {
    // 🔥 Modifică și URL-ul - folosește /r/subreddit/.json în loc de /r/subreddit.json
    const response = await fetch(`${API_BASE}/r/${subreddit}/.json?limit=20`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.data || !data.data.children) {
      throw new Error('Invalid response from Reddit');
    }
    
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

// Restul codului rămâne EXACT la fel
const postsSlice = createSlice({
  name: 'posts',
  initialState: {
    posts: [],
    isLoading: false,
    hasError: false,
    currentSubreddit: 'popular',
    errorMessage: '',
  },
  reducers: {
    setCurrentSubreddit: (state, action) => {
      state.currentSubreddit = action.payload;
      state.hasError = false;
      state.errorMessage = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
        state.errorMessage = '';
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.posts = action.payload;
        state.hasError = false;
        state.errorMessage = '';
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.hasError = true;
        state.errorMessage = action.error.message || 'Failed to fetch posts';
        state.posts = [];
      });
  },
});

export const { setCurrentSubreddit } = postsSlice.actions;
export const selectPosts = (state) => state.posts.posts;
export const selectIsLoading = (state) => state.posts.isLoading;
export const selectHasError = (state) => state.posts.hasError;
export const selectCurrentSubreddit = (state) => state.posts.currentSubreddit;
export const selectErrorMessage = (state) => state.posts.errorMessage;

export default postsSlice.reducer;