import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchEntries, createEntry, updateEntry, deleteEntry, getMe, logout } from './api';
import { EntryList } from './components/EntryList';
import { EntryForm } from './components/EntryForm';
import { Login } from './pages/Login';
import { PrivateRoute } from './components/PrivateRoute';
import type {Entry} from './types';

function AppContent() {
    const navigate = useNavigate();
    const [user, setUser] = useState<any>(null);
    const [entries, setEntries] = useState<Entry[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingEntry, setEditingEntry] = useState<Entry | null>(null);

    useEffect(() => {
        Promise.all([getMe(), fetchEntries()])
            .then(([userData, entriesData]) => {
                setUser(userData);
                setEntries(entriesData);
            })
            .catch(() => navigate('/login'))
            .finally(() => setLoading(false));
    }, [navigate]);

    const handleCreate = async (title: string, content: string) => {
        const newEntry = await createEntry(title, content);
        setEntries([newEntry, ...entries]);
        setShowForm(false);
    };

    const handleUpdate = async (id: number, title: string, content: string) => {
        const updated = await updateEntry(id, title, content);
        setEntries(entries.map(e => e.id === id ? updated : e));
        setEditingEntry(null);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Точно удалить?')) return;
        await deleteEntry(id);
        setEntries(entries.filter(e => e.id !== id));
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (loading) return <div className="container">Загрузка...</div>;

    return (
        <div className="container">
            <header>
                <div>
                    <h1>📔 Дневник</h1>
                    <span className="user-info">{user?.username} ✨</span>
                </div>
                <div>
                    <button onClick={() => setShowForm(true)}>+ Новая запись</button>
                    <button onClick={handleLogout} className="btn-logout">🚪 Выйти</button>
                </div>
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
                <EntryList entries={entries} onEdit={setEditingEntry} onDelete={handleDelete} />
            )}
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={
                    <PrivateRoute>
                        <AppContent />
                    </PrivateRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}

export default App;