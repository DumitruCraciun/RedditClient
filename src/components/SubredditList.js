import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSubreddits, selectSubreddits } from '../features/subreddits/subredditsSlice';
import { fetchPosts, setCurrentSubreddit } from '../features/posts/postsSlice';

export default function SubredditList() {
  const dispatch = useDispatch();
  const subreddits = useSelector(selectSubreddits);

  useEffect(() => {
    dispatch(fetchSubreddits());
  }, [dispatch]);

  const handleClick = (subredditName) => {
    dispatch(setCurrentSubreddit(subredditName));
    dispatch(fetchPosts(subredditName));
  };

  return (
    <div className="subreddit-list">
      <h3>Popular Subreddits</h3>
      <ul>
        {subreddits.map((sub) => (
          <li key={sub.id} onClick={() => handleClick(sub.name)}>
            {sub.icon && <img src={sub.icon} alt={sub.name} width="24" />}
            <span>r/{sub.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}