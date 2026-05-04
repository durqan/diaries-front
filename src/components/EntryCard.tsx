import type {Entry} from '../types';

interface Props {
  entry: Entry;
  onEdit: (entry: Entry) => void;
  onDelete: (id: number) => void;
}

export function EntryCard({ entry, onEdit, onDelete }: Props) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition">
      <h2 className="text-xl font-medium mb-1">{entry.title}</h2>
      <small className="text-gray-400 text-xs font-mono">{new Date(entry.created_at).toLocaleDateString()}</small>
      <p className="text-gray-600 mt-3 leading-relaxed">{entry.content}</p>
      <div className="flex gap-3 mt-4 pt-3 border-t border-gray-100">
        <button onClick={() => onEdit(entry)} className="text-sm text-amber-700 hover:text-amber-900">✏️ Редактировать</button>
        <button onClick={() => onDelete(entry.id)} className="text-sm text-red-500 hover:text-red-700">🗑️ Удалить</button>
      </div>
    </div>
  );
}
