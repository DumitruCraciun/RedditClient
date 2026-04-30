import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, selectPosts, selectIsLoading, selectHasError, selectCurrentSubreddit } from '../features/posts/postsSlice';
import { Link } from 'react-router-dom';

export default function PostList() {
  const dispatch = useDispatch();
  const posts = useSelector(selectPosts);
  const isLoading = useSelector(selectIsLoading);
  const hasError = useSelector(selectHasError);
  const currentSubreddit = useSelector(selectCurrentSubreddit);

  useEffect(() => {
    dispatch(fetchPosts(currentSubreddit));
  }, [dispatch, currentSubreddit]);

  if (isLoading) return <div>Loading posts...</div>;
  if (hasError) return <div>Error loading posts. Please try again.</div>;

  return (
    <div className="post-list">
      <h2>r/{currentSubreddit}</h2>
      {posts.map((post) => (
        <div key={post.id} className="post-card">
		  <Link to={`/post/${post.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
			<h3>{post.title}</h3>
		  </Link>
		  <p>by {post.author} | 👍 {post.score} | 💬 {post.num_comments}</p>
		  {post.thumbnail && post.thumbnail.startsWith('http') && (
			<img src={post.thumbnail} alt={post.title} />
		  )}
		</div>
      ))}
    </div>
  );
}