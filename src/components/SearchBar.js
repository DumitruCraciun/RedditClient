import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { fetchPosts, setCurrentSubreddit } from '../features/posts/postsSlice';

export default function SearchBar() {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      dispatch(setCurrentSubreddit(searchTerm));
      dispatch(fetchPosts(searchTerm));
      setSearchTerm('');
    }
  };

  return (
    <form onSubmit={handleSearch} className="search-bar">
      <input
        type="text"
        placeholder="Search subreddit (e.g., reactjs, javascript)"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button type="submit">Search</button>
    </form>
  );
}