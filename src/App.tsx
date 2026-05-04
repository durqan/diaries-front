import { useState, useEffect } from 'react';
import { fetchEntries, createEntry, updateEntry, deleteEntry, type PaginatedResponse } from './api';
import type {Entry} from './types';
import { EntryList } from './components/EntryList';
import { EntryForm } from './components/EntryForm';

function App() {
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingEntry, setEditingEntry] = useState<Entry | null>(null);

    // Пагинация
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [total, setTotal] = useState(0);
    const pageSize = 10;

    const loadEntries = async (currentPage: number) => {
        try {
            setLoading(true);
            const response: PaginatedResponse<Entry> = await fetchEntries(currentPage, pageSize);
            setEntries(response.data);
            setTotal(response.meta.total);
            setTotalPages(response.meta.total_pages);
        } catch (error) {
            console.error('Ошибка загрузки:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadEntries(page);
    }, [page]);

    const handleCreate = async (title: string, content: string) => {
        await createEntry(title, content);
        setPage(1);
        await loadEntries(1);
        setShowForm(false);
    };

    const handleUpdate = async (id: number, title: string, content: string) => {
        await updateEntry(id, title, content);
        await loadEntries(page);
        setEditingEntry(null);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Точно удалить запись?')) return;
        await deleteEntry(id);
        // Если на текущей странице не осталось записей, переходим на предыдущую
        if (entries.length === 1 && page > 1) {
            setPage(page - 1);
        } else {
            await loadEntries(page);
        }
    };

    const goToPage = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    if (loading) return <div className="container">Загрузка...</div>;

    return (
        <div className="container">
            <header>
                <h1>📔 Дневник</h1>
                <button onClick={() => setShowForm(true)}>+ Новая запись</button>
            </header>

            {showForm && (
                <EntryForm mode="create" onSave={handleCreate} onClose={() => setShowForm(false)} />
            )}

            {editingEntry && (
                <EntryForm
                    mode="edit"
                    entry={editingEntry}
                    onSave={(t, c) => handleUpdate(editingEntry.id, t, c)}
                    onClose={() => setEditingEntry(null)}
                />
            )}

            {entries.length === 0 ? (
                <div className="empty">Пока нет записей. Напиши первую!</div>
            ) : (
                <>
                    <EntryList entries={entries} onEdit={setEditingEntry} onDelete={handleDelete} />

                    {/* Пагинация */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                onClick={() => goToPage(page - 1)}
                                disabled={page === 1}
                                className="pagination-btn"
                            >
                                ← Назад
                            </button>
                            <span className="pagination-info">
                Страница {page} из {totalPages} (всего {total} записей)
              </span>
                            <button
                                onClick={() => goToPage(page + 1)}
                                disabled={page === totalPages}
                                className="pagination-btn"
                            >
                                Вперед →
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default App;