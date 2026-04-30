import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import SearchBar from './components/SearchBar';
import SubredditList from './components/SubredditList';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="app-header">
          <Link to="/" style={{ textDecoration: 'none', color: 'white' }}>
            <h1>Reddit Client</h1>
          </Link>
          <SearchBar />
        </header>
        <div className="app-content">
          <aside className="sidebar">
            <SubredditList />
          </aside>
          <main className="main-content">
            <Routes>
              <Route path="/" element={<PostList />} />
              <Route path="/post/:postId" element={<PostDetail />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;