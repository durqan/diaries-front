import { useState, useEffect, useCallback } from 'react';
import { fetchEntries, createEntry, updateEntry, deleteEntry, type PaginatedResponse } from './api';
import type {Entry} from './types';
import { EntryList } from './components/EntryList';
import { EntryForm } from './components/EntryForm';

function App() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;

  const loadEntries = useCallback(async (currentPage: number) => {
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
  }, []);

  useEffect(() => {
    loadEntries(page);
  }, [page, loadEntries]);

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

  if (loading) return <div className="flex justify-center items-center h-screen text-gray-500">Загрузка...</div>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <header className="flex justify-between items-center mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-2xl font-serif text-gray-800">📔 Дневник</h1>
        <button onClick={() => setShowForm(true)} className="bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 transition">
          + Новая запись
        </button>
      </header>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <EntryForm mode="create" onSave={handleCreate} onClose={() => setShowForm(false)} />
        </div>
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
        <div className="text-center text-gray-400 py-12 italic">Пока нет записей. Напиши первую!</div>
      ) : (
        <>
          <EntryList entries={entries} onEdit={setEditingEntry} onDelete={handleDelete} />
          
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8 pt-4 border-t border-gray-200">
              <button onClick={() => goToPage(page - 1)} disabled={page === 1} className="bg-gray-800 text-white px-4 py-2 rounded-full disabled:bg-gray-300">← Назад</button>
              <span className="text-gray-500">Страница {page} из {totalPages} ({total} записей)</span>
              <button onClick={() => goToPage(page + 1)} disabled={page === totalPages} className="bg-gray-800 text-white px-4 py-2 rounded-full disabled:bg-gray-300">Вперед →</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
