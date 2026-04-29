const API_URL = '/api';

// Хранение токена
let authToken: string | null = null;

export function setAuthToken(token: string | null) {
    authToken = token;
    if (token) {
        localStorage.setItem('token', token);
    } else {
        localStorage.removeItem('token');
    }
}

export function getAuthToken(): string | null {
    if (authToken) return authToken;
    const token = localStorage.getItem('token');
    if (token) authToken = token;
    return token;
}

// Базовый fetch с авторизацией
async function fetchWithAuth(url: string, options: RequestInit = {}) {
    const token = getAuthToken();
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Merge with existing headers
    if (options.headers) {
        const existingHeaders = options.headers as Record<string, string>;
        Object.keys(existingHeaders).forEach(key => {
            headers[key] = existingHeaders[key];
        });
    }

    const response = await fetch(url, { ...options, headers });

    if (response.status === 401) {
        // Токен протух
        setAuthToken(null);
        window.location.href = '/login';
        throw new Error('Unauthorized');
    }

    return response;
}

// Аутентификация
export async function register(username: string, email: string, password: string): Promise<{ token: string; user: any }> {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
    });
    if (!res.ok) throw new Error('Registration failed');
    const data = await res.json();
    setAuthToken(data.token);
    return data;
}

export async function login(email: string, password: string): Promise<{ token: string; user: any }> {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Login failed');
    const data = await res.json();
    setAuthToken(data.token);
    return data;
}

export async function logout() {
    setAuthToken(null);
    window.location.href = '/login';
}

export async function getMe(): Promise<any> {
    const res = await fetchWithAuth(`${API_URL}/me`);
    if (!res.ok) throw new Error('Failed to get user');
    return res.json();
}

// Записи
export async function fetchEntries(): Promise<any[]> {
    const res = await fetchWithAuth(`${API_URL}/entries`);
    if (!res.ok) throw new Error('Failed to fetch entries');
    return res.json();
}

export async function createEntry(title: string, content: string): Promise<any> {
    const res = await fetchWithAuth(`${API_URL}/entries`, {
        method: 'POST',
        body: JSON.stringify({ title, content }),
    });
    if (!res.ok) throw new Error('Failed to create entry');
    return res.json();
}

export async function updateEntry(id: number, title: string, content: string): Promise<any> {
    const res = await fetchWithAuth(`${API_URL}/entries/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ title, content }),
    });
    if (!res.ok) throw new Error('Failed to update entry');
    return res.json();
}

export async function deleteEntry(id: number): Promise<void> {
    const res = await fetchWithAuth(`${API_URL}/entries/${id}`, {
        method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete entry');
}