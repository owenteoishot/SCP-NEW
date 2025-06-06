import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function StoryListPage() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    fetch('http://localhost:3000/api/stories')
      .then(res => res.json())
      .then(setStories);
  }, []);

  return (
    <div className="page">
      <h2>Stories</h2>
      <ul>
        {stories.map(story => (
          <li key={story.id}>
            <Link to={`/stories/${story.id}`}>{story.title} by {story.author}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StoryListPage;