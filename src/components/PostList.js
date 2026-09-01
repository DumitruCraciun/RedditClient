// reddit-client/src/components/PostList.js
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchPosts, 
  selectPosts, 
  selectIsLoading, 
  selectHasError, 
  selectCurrentSubreddit,
  selectErrorMessage 
} from '../features/posts/postsSlice';

export default function PostList() {
  const dispatch = useDispatch();
  const posts = useSelector(selectPosts);
  const isLoading = useSelector(selectIsLoading);
  const hasError = useSelector(selectHasError);
  const currentSubreddit = useSelector(selectCurrentSubreddit);
  const errorMessage = useSelector(selectErrorMessage);

  useEffect(() => {
    dispatch(fetchPosts(currentSubreddit));
  }, [dispatch, currentSubreddit]);

  if (isLoading) {
    return <div className="loading">Loading posts from r/{currentSubreddit}...</div>;
  }

  if (hasError) {
    return (
      <div className="error">
        <h3>Error loading posts</h3>
        <p>{errorMessage || 'Something went wrong. Please try again.'}</p>
        <button onClick={() => dispatch(fetchPosts(currentSubreddit))}>
          Retry
        </button>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return <div className="no-posts">No posts found in r/{currentSubreddit}</div>;
  }

  return (
    <div className="post-list">
      <h2>r/{currentSubreddit}</h2>
      <p>{posts.length} posts loaded</p>
      {posts.map((post) => (
        <div key={post.id} className="post-card">
          <h3>{post.title}</h3>
          <p>by {post.author} | 👍 {post.score} | 💬 {post.num_comments}</p>
          {post.thumbnail && post.thumbnail.startsWith('http') && (
            <img src={post.thumbnail} alt={post.title} />
          )}
        </div>
      ))}
    </div>
  );
}