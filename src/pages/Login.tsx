import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, register } from '../api';

export function Login() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!isLogin && password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    setLoading(true);
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(username, email, password);
      }
      navigate('/');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-serif text-center mb-6">{isLogin ? 'Вход' : 'Регистрация'}</h1>
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <input
              type="text"
              placeholder="Имя пользователя"
              className="w-full p-3 border border-gray-200 rounded-xl mb-3"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border border-gray-200 rounded-xl mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Пароль"
            className="w-full p-3 border border-gray-200 rounded-xl mb-3"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {!isLogin && (
            <input
              type="password"
              placeholder="Подтвердите пароль"
              className="w-full p-3 border border-gray-200 rounded-xl mb-3"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          )}
          <button type="submit" disabled={loading} className="w-full bg-gray-800 text-white py-3 rounded-full hover:bg-gray-700">
            {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-gray-500">
          {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}
          <button onClick={() => setIsLogin(!isLogin)} className="ml-1 text-amber-700 hover:underline">
            {isLogin ? 'Зарегистрироваться' : 'Войти'}
          </button>
        </p>
      </div>
    </div>
  );
}
