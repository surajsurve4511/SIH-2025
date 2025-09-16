import React from 'react';
import { ConsultantNote } from '../types';
import { PencilIcon, CalendarIcon } from './icons';

interface NoteCardProps {
  note: ConsultantNote;
}

const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  return (
    <div className="bg-brand-yellow/10 p-4 rounded-lg shadow border border-brand-yellow/30 mb-4">
      <div className="flex items-start space-x-3">
        <PencilIcon className="w-5 h-5 text-brand-yellow mt-1" />
        <div className="flex-1">
          <div className="flex justify-between items-center mb-1">
            <h4 className="text-md font-semibold text-brand-yellow/90">Consultant Note</h4>
            <span className="text-xs text-brand-yellow/80 flex items-center">
              <CalendarIcon className="w-3.5 h-3.5 mr-1" />
              {new Date(note.timestamp).toLocaleString()}
            </span>
          </div>
          <p className="text-sm text-neutral-700">{note.text}</p>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;