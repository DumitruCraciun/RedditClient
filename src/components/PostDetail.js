import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchComments, selectComments, selectCommentsLoading, clearComments } from '../features/comments/commentsSlice';
import { selectPosts } from '../features/posts/postsSlice';

export default function PostDetail() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const posts = useSelector(selectPosts);
  const comments = useSelector(selectComments);
  const commentsLoading = useSelector(selectCommentsLoading);
  
  const post = posts.find(p => p.id === postId);
  
  useEffect(() => {
    if (post && post.permalink) {
      dispatch(fetchComments(post.permalink));
    }
    return () => {
      dispatch(clearComments());
    };
  }, [dispatch, post]);
  
  if (!post) {
    return (
      <div className="post-detail">
        <h2>Post not found</h2>
        <button onClick={() => navigate('/')}>Back to Home</button>
      </div>
    );
  }
  
  // Format date
  const date = new Date(post.created_utc * 1000).toLocaleDateString();
  
  return (
    <div className="post-detail">
      <button className="back-button" onClick={() => navigate('/')}>← Back to posts</button>
      
      <div className="detail-card">
        <h2>{post.title}</h2>
        <div className="post-meta">
          <span>by {post.author}</span>
          <span>👍 {post.score}</span>
          <span>💬 {post.num_comments}</span>
          <span>{date}</span>
        </div>
        
        {post.selftext && (
          <div className="post-content">
            <p>{post.selftext}</p>
          </div>
        )}
        
        {post.url && post.url.match(/\.(jpeg|jpg|gif|png)$/) && (
          <img src={post.url} alt={post.title} className="post-image" />
        )}
      </div>
      
      <div className="comments-section">
        <h3>Comments ({comments.length})</h3>
        
        {commentsLoading && <div className="loading">Loading comments...</div>}
        
        {!commentsLoading && comments.length === 0 && (
          <p className="no-comments">No comments yet.</p>
        )}
        
        <div className="comments-list">
          {comments.map((comment) => (
            <div key={comment.id} className="comment-card">
              <div className="comment-header">
                <strong>{comment.author}</strong>
                <span>👍 {comment.score}</span>
              </div>
              <div className="comment-body" dangerouslySetInnerHTML={{ __html: comment.body }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}