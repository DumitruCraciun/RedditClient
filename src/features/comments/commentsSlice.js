import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (permalink) => {
    const response = await fetch(`https://redditproxy-2ck0.onrender.com${permalink}.json`);
    const data = await response.json();
    const commentsData = data[1].data.children;
    
    return commentsData
      .filter(child => child.kind === 't1')
      .map(child => ({
        id: child.data.id,
        author: child.data.author,
        body: child.data.body,
        score: child.data.score,
        created_utc: child.data.created_utc,
      }));
  }
);

const commentsSlice = createSlice({
  name: 'comments',
  initialState: {
    comments: [],
    isLoading: false,
    hasError: false,
  },
  reducers: {
    clearComments: (state) => {
      state.comments = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.isLoading = true;
        state.hasError = false;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.isLoading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state) => {
        state.isLoading = false;
        state.hasError = true;
      });
  },
});

export const { clearComments } = commentsSlice.actions;
export const selectComments = (state) => state.comments.comments;
export const selectCommentsLoading = (state) => state.comments.isLoading;

export default commentsSlice.reducer;