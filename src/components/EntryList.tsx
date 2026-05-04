import type {Entry} from '../types';
import { EntryCard } from './EntryCard';

interface Props {
  entries: Entry[];
  onEdit: (entry: Entry) => void;
  onDelete: (id: number) => void;
}

export function EntryList({ entries, onEdit, onDelete }: Props) {
  return (
    <div className="space-y-4">
      {entries.map(entry => (
        <EntryCard key={entry.id} entry={entry} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
