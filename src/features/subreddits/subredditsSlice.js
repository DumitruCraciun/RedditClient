import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchSubreddits = createAsyncThunk(
  'subreddits/fetchSubreddits',
  async () => {
    const response = await fetch(`https://redditproxy-2ck0.onrender.com/subreddits/popular.json?limit=20`);
    const data = await response.json();
    
    return data.data.children.map(child => ({
      id: child.data.id,
      name: child.data.display_name,
      title: child.data.title,
      icon: child.data.icon_img,
    }));
  }
);

const subredditsSlice = createSlice({
  name: 'subreddits',
  initialState: {
    subreddits: [],
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubreddits.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSubreddits.fulfilled, (state, action) => {
        state.isLoading = false;
        state.subreddits = action.payload;
      })
      .addCase(fetchSubreddits.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const selectSubreddits = (state) => state.subreddits.subreddits;
export default subredditsSlice.reducer;