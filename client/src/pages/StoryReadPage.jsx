import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

function StoryReadPage() {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch(`http://localhost:3000/api/stories/${id}`)
      .then(res => res.json())
      .then(setStory);
    fetch(`http://localhost:3000/api/stories/${id}/chapters`)
      .then(res => res.json())
      .then(setChapters);
  }, [id]);

  return (
    <div className="page">
      {story && (
        <>
          <h2>{story.title}</h2>
          <p>by {story.author}</p>
        </>
      )}
      <h3>Chapters</h3>
      <ul>
        {chapters.map(chap => (
          <li key={chap.id}>
            <button onClick={() => setSelected(chap)}>{chap.title}</button>
          </li>
        ))}
      </ul>
      {selected && (
        <div>
          <h4>{selected.title}</h4>
          <p>{selected.content}</p>
        </div>
      )}
      <Link to="/stories">Back to Stories</Link>
    </div>
  );
}

export default StoryReadPage;