import { useEffect, useState } from 'react';
import './Notes.css';
import axios from '../api/axios';

interface Note {
  _id: string;
  title: string;
  content: string;
}

export default function Notes({ user, onSignOut }: { user: any; onSignOut: () => void }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [showInput, setShowInput] = useState(false);
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/notes');
      setNotes(res.data);
    } catch (err) {
      console.error('Failed to fetch notes', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async () => {
    if (!noteTitle.trim() || !noteContent.trim()) return;
    try {
      const res = await axios.post('/notes', { title: noteTitle, content: noteContent });
      setNotes([...notes, res.data]);
      setNoteTitle('');
      setNoteContent('');
      setShowInput(false);
    } catch (err) {
      console.error('Failed to create note', err);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await axios.delete(`/notes/${id}`);
      setNotes(notes.filter(note => note._id !== id));
    } catch (err) {
      console.error('Failed to delete note', err);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="notes-container">
      <div className="header">
        <img src="/icon.png" alt="Logo" className="logo-icon" />
        <span className="logo-text">Dashboard</span>
        <button className="signout-btn" onClick={onSignOut}>Sign Out</button>
      </div>

      <div className="welcome-card">
        <h2>Welcome, {user.name}!</h2>
        <p>Email: {user.email.replace(/(.{3}).+(@.+)/, '$1xxxxx$2')}</p>
      </div>

      <button className="primary-btn" onClick={() => setShowInput(true)}>Create Note</button>

      {showInput && (
        <div style={{ margin: '1rem 0', display: 'flex', gap: '0.5rem', flexDirection: 'column' }}>
          <input
            className="input-field"
            style={{ flex: 1 }}
            placeholder="Enter note title"
            value={noteTitle}
            onChange={e => setNoteTitle(e.target.value)}
            autoFocus
          />
          <input
            className="input-field"
            style={{ flex: 1 }}
            placeholder="Enter note content"
            value={noteContent}
            onChange={e => setNoteContent(e.target.value)}
          />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="primary-btn" style={{ width: 'auto', padding: '0 1rem' }} onClick={handleCreateNote}>
              Add
            </button>
            <button className="signout-btn" style={{ color: '#f43f5e' }} onClick={() => setShowInput(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      <h3 className="notes-heading">Notes</h3>
      {loading ? (
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <span className="logo-text">Loading...</span>
        </div>
      ) : (
        <div className="notes-list">
          {notes.map(note => (
            <div className="note-item" key={note._id}>
              <span>
                <strong>{note.title}</strong>: {note.content}
              </span>
              <button className="delete-btn" onClick={() => deleteNote(note._id)}>🗑️</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}