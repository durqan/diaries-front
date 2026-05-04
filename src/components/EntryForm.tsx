import { useState, useEffect } from 'react';
import type {Entry} from '../types';

interface Props {
  mode: 'create' | 'edit';
  entry?: Entry;
  onSave: (title: string, content: string) => void;
  onClose: () => void;
}

export function EntryForm({ mode, entry, onSave, onClose }: Props) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (entry && mode === 'edit') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(entry.title);
      setContent(entry.content);
    }
  }, [entry, mode]);

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (title.trim() && content.trim()) {
      onSave(title.trim(), content.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()} className="bg-white rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-serif mb-4">{mode === 'create' ? 'Новая запись' : 'Редактировать'}</h2>
        <input
          type="text"
          placeholder="Заголовок"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border border-gray-200 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-gray-300"
          autoFocus
          required
        />
        <textarea
          placeholder="Твои мысли..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
          className="w-full p-3 border border-gray-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-gray-300"
          required
        />
        <div className="flex gap-3 justify-end">
          <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700">Сохранить</button>
          <button type="button" onClick={onClose} className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full hover:bg-gray-300">Отмена</button>
        </div>
      </form>
    </div>
  );
}
