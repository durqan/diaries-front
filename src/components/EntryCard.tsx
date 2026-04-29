import type {Entry} from '../types';

interface Props {
    entry: Entry;
    onEdit: (entry: Entry) => void;
    onDelete: (id: number) => void;
}

export function EntryCard({ entry, onEdit, onDelete }: Props) {
    return (
        <div className="entry">
            <h2>{entry.title}</h2>
            <small>{new Date(entry.created_at).toLocaleDateString()}</small>
            <p>{entry.content}</p>
            <div className="entry-actions">
                <button className="btn-edit" onClick={() => onEdit(entry)}>
                    ✏️ Редактировать
                </button>
                <button className="btn-delete" onClick={() => onDelete(entry.id)}>
                    🗑️ Удалить
                </button>
            </div>
        </div>
    );
}