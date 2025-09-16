
import React, { useState } from 'react';
import { PlusCircleIcon, AIServiceIcon } from './icons';
import { useData } from '../contexts/DataContext';
import { ConsultantNote } from '../types';

interface AddNoteFormProps {
  farmerId: string;
  farmerName: string;
  onNoteAdded: () => void;
}

const AddNoteForm: React.FC<AddNoteFormProps> = ({ farmerId, farmerName, onNoteAdded }) => {
  const [noteText, setNoteText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNote } = useData();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    setIsSubmitting(true);
    try {
      const newNote: Omit<ConsultantNote, 'id'> = {
        farmerId: farmerId,
        timestamp: new Date().toISOString(),
        text: noteText.trim(),
      };
      await addNote(newNote);
      setNoteText('');
      onNoteAdded();
    } catch (error) {
      console.error("Failed to add note:", error);
      // Future: show notification from props
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 p-4 bg-white rounded-lg shadow border border-neutral-200">
      <h3 className="text-lg font-semibold text-neutral-700 mb-2">Add Note for {farmerName}</h3>
      <textarea
        value={noteText}
        onChange={(e) => setNoteText(e.target.value)}
        placeholder="Type your note here..."
        className="w-full p-2 border border-neutral-300 rounded-md focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition duration-150 ease-in-out"
        rows={3}
        aria-label={`Note for ${farmerName}`}
        disabled={isSubmitting}
      ></textarea>
      <button
        type="submit"
        className="mt-3 px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue/90 focus:outline-none focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 transition flex items-center disabled:opacity-50"
        disabled={!noteText.trim() || isSubmitting}
      >
        {isSubmitting ? (
          <>
            <AIServiceIcon className="w-5 h-5 mr-2 animate-spin" />
            Adding...
          </>
        ) : (
          <>
            <PlusCircleIcon className="w-5 h-5 mr-2" />
            Add Note
          </>
        )}
      </button>
    </form>
  );
};

export default AddNoteForm;
