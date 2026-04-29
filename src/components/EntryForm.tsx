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
            setTitle(entry.title);
            setContent(entry.content);
        }
    }, [entry, mode]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim() && content.trim()) {
            onSave(title.trim(), content.trim());
        }
    };

    return (
        <div className="modal" onClick={onClose}>
            <form onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
                <h2>{mode === 'create' ? 'Новая запись' : 'Редактировать запись'}</h2>
                <input
                    type="text"
                    placeholder="Заголовок"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    autoFocus
                    required
                />
                <textarea
                    placeholder="Твои мысли..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                    required
                />
                <div className="modal-buttons">
                    <button type="submit">Сохранить</button>
                    <button type="button" onClick={onClose}>Отмена</button>
                </div>
            </form>
        </div>
    );
}