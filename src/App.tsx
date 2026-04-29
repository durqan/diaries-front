import { useState, useEffect } from 'react';
import type {Entry} from './types';
import { fetchEntries, createEntry, updateEntry, deleteEntry } from './api';
import { EntryList } from './components/EntryList';
import { EntryForm } from './components/EntryForm';

function App() {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingEntry, setEditingEntry] = useState<Entry | null>(null);

    useEffect(() => {
        let isMounted = true;

        const loadEntries = async () => {
            try {
                const data = await fetchEntries();
                if (isMounted) setEntries(data);
            } catch (error) {
                console.error('Ошибка загрузки:', error);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        loadEntries();

        return () => {
            isMounted = false;
        };
    }, []);

    // Создание
    const handleCreate = async (title: string, content: string) => {
        try {
            const newEntry = await createEntry(title, content);
            setEntries([newEntry, ...entries]);
            setShowForm(false);
        } catch (error) {
            console.error('Ошибка создания:', error);
        }
    };

    // Обновление
    const handleUpdate = async (id: number, title: string, content: string) => {
        try {
            const updated = await updateEntry(id, title, content);
            setEntries(entries.map(e => e.id === id ? updated : e));
            setEditingEntry(null);
        } catch (error) {
            console.error('Ошибка обновления:', error);
        }
    };

    // Удаление
    const handleDelete = async (id: number) => {
        if (!confirm('Точно удалить запись?')) return;
        try {
            await deleteEntry(id);
            setEntries(entries.filter(e => e.id !== id));
        } catch (error) {
            console.error('Ошибка удаления:', error);
        }
    };

    if (loading) {
        return <div className="container"><div className="loading">Загрузка...</div></div>;
    }

    return (
        <div className="container">
            <header>
                <h1>📔 Дневник</h1>
                <button onClick={() => setShowForm(true)}>+ Новая запись</button>
            </header>

            {/* Форма создания */}
            {showForm && (
                <EntryForm
                    mode="create"
                    onSave={handleCreate}
                    onClose={() => setShowForm(false)}
                />
            )}

            {/* Форма редактирования */}
            {editingEntry && (
                <EntryForm
                    mode="edit"
                    entry={editingEntry}
                    onSave={(title, content) => handleUpdate(editingEntry.id, title, content)}
                    onClose={() => setEditingEntry(null)}
                />
            )}

            {/* Список записей */}
            {entries.length === 0 ? (
                <div className="empty">Пока нет записей. Напиши первую!</div>
            ) : (
                <EntryList
                    entries={entries}
                    onEdit={setEditingEntry}
                    onDelete={handleDelete}
                />
            )}
        </div>
    );
}

export default App;