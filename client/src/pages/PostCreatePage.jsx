import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function PostCreatePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || title.length > 100) {
      alert('Title must be between 1 and 100 characters');
      return;
    }
    if (!content || content.length > 1000) {
      alert('Content must be between 1 and 1000 characters');
      return;
    }
    const res = await fetch('http://localhost:3000/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title, content })
    });
    if (res.ok) {
      navigate('/forum');
    } else {
      alert('Something went wrong');
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
      <textarea value={content} onChange={e => setContent(e.target.value)} required />
      <button type="submit">Create Post</button>
    </form>
  );
}

export default PostCreatePage;
