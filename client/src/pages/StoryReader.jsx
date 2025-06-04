import React, { useEffect, useState } from 'react';
import api from '../utils/api';

const StoryReader = () => {
  const [books, setBooks] = useState([]);
  const [chapters, setChapters] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await api.get('/story/books');
      setBooks(res.data.books);
    } catch {
      setMessage('Failed to load books');
    }
  };

  const unlockBook = async () => {
    try {
      const res = await api.post('/story/unlock', {
        bookId: selectedBook.id,
        password
      });
      setMessage(res.data.message);
      setPassword('');
      fetchBooks(); // Refresh lock status
    } catch (err) {
      setMessage(err.response?.data?.error || 'Unlock failed');
    }
  };

  const loadChapters = async (bookId) => {
    try {
      const res = await api.get(`/story/${bookId}/chapters`);
      setChapters(res.data.chapters);
      setSelectedBook(books.find(b => b.id === bookId));
    } catch (err) {
      setMessage(err.response?.data?.error || 'Could not load chapters');
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>📘 Background Story Reader</h2>
      {message && <p><strong>{message}</strong></p>}
      <ul>
        {books.map(book => (
          <li key={book.id} style={{ marginBottom: '1rem' }}>
            <strong>{book.title}</strong> — {book.description}
            {book.unlocked ? (
              <button onClick={() => loadChapters(book.id)}>Read</button>
            ) : (
              <>
                <input
                  type="text"
                  placeholder="Enter password"
                  value={selectedBook?.id === book.id ? password : ''}
                  onChange={(e) => {
                    setSelectedBook(book);
                    setPassword(e.target.value);
                  }}
                />
                <button onClick={unlockBook}>Unlock</button>
              </>
            )}
          </li>
        ))}
      </ul>

      {chapters.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3>📖 {selectedBook.title}</h3>
          {chapters.map(chap => (
            <div key={chap.chapter_number}>
              <h4>Chapter {chap.chapter_number}: {chap.title}</h4>
              <p>{chap.content}</p>
              <hr />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StoryReader;
