// src/api.ts
// src/api.ts
import type {Entry} from './types';

const API_URL = import.meta.env.VITE_API_URL;

// GET все записи
export async function fetchEntries(): Promise<Entry[]> {
    const res = await fetch(`${API_URL}/entries`);
    if (!res.ok) throw new Error('Ошибка загрузки');
    return res.json();
}

// GET одну запись
export async function fetchEntry(id: number): Promise<Entry> {
    const res = await fetch(`${API_URL}/entries/${id}`);
    if (!res.ok) throw new Error('Ошибка загрузки записи');
    return res.json();
}

// POST создать запись
export async function createEntry(title: string, content: string): Promise<Entry> {
    const res = await fetch(`${API_URL}/entries`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
    });
    if (!res.ok) throw new Error('Ошибка создания');
    return res.json();
}

// PUT обновить запись
export async function updateEntry(id: number, title: string, content: string): Promise<Entry> {
    const res = await fetch(`${API_URL}/entries/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, content }),
    });
    if (!res.ok) throw new Error('Ошибка обновления');
    return res.json();
}

// DELETE удалить запись
export async function deleteEntry(id: number): Promise<void> {
    const res = await fetch(`${API_URL}/entries/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Ошибка удаления');
}