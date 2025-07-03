import { Request, Response } from 'express';
import Note from '../models/Note';

export const createNote = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user._id;
  const { title, content } = req.body;
  try {
    const note = new Note({ title, content, owner: userId });
    await note.save();
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json({ message: 'Failed to create note.' });
  }
};
export const getNotes = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user._id;
  try {
    const notes = await Note.find({ owner: userId });
    res.json(notes);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch notes.' });
  }
};

export const deleteNote = async (req: Request, res: Response) => {
  // @ts-ignore
  const userId = req.user._id;
  const noteId = req.params.id;
  try {
    const note = await Note.findOne({ _id: noteId, owner: userId });
    if (!note) return res.status(404).json({ message: 'Note not found or not authorized.' });
    await note.deleteOne();
    res.json({ message: 'Note deleted.' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete note.' });
  }
};