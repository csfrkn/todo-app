import React, { useState, useEffect } from 'react';
import { getTodoStats } from '../api/todoApi';
import todoService from '../api/todoService';
import { useTheme } from '../contexts/ThemeContext';

const Statistics = () => {
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [todos, setTodos] = useState([]);
  const [totalTodosCount, setTotalTodosCount] = useState(0);
  const [stats, setStats] = useState({
    statusCounts: {
      pending: 0,
      in_progress: 0,
      completed: 0
    },
    priorityCounts: {
      high: 0,
      medium: 0,
      low: 0
    }
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all todos without filters for statistics
        const todosResponse = await todoService.getAllTodos({
          limit: 1000, // Large limit to get all todos
          page: 1
        });
        
        if (todosResponse?.status === 'success') {
          setTodos(todosResponse.data);
          setTotalTodosCount(todosResponse.meta?.pagination?.total || 0);
        }

        // Fetch statistics
        const statsResponse = await getTodoStats();
        if (statsResponse?.status === 'success' && statsResponse.data) {
          setStats(statsResponse.data);
        }
      } catch (error) {
        console.error('İstatistikler alınamadı:', error);
        setError('İstatistikler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Yaklaşan bitiş tarihi olan todoları bul (3 gün içinde)
  const upcomingDeadlines = todos.filter(todo => {
    if (!todo.due_date || todo.status === 'completed') return false;
    const dueDate = new Date(todo.due_date);
    const today = new Date();
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 3;
  });

  // Gecikmiş todoları bul
  const overdueTodos = todos.filter(todo => {
    if (!todo.due_date || todo.status === 'completed') return false;
    const dueDate = new Date(todo.due_date);
    const today = new Date();
    return dueDate < today;
  });

  // Tamamlanma oranını hesapla
  const completionRate = totalTodosCount > 0 
    ? Math.round((stats.statusCounts.completed / totalTodosCount) * 100) 
    : 0;

  // Yüzdeleri hesapla
  const calculatePercentage = (count) => {
    return totalTodosCount > 0 ? (count / totalTodosCount) * 100 : 0;
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <p className="text-red-400 mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
        >
          Sayfayı Yenile
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${isDark ? 'text-gray-100' : 'text-gray-900'}`}>İstatistikler</h1>
        <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
          Görevlerinizin genel durumu ve analizi
        </p>
      </div>

      {/* Ana Metrikler */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Toplam Görev */}
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border transition-colors duration-200`}>
          <div className="text-4xl font-bold text-indigo-400 mb-2">
            {totalTodosCount}
          </div>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Toplam Görev</div>
        </div>

        {/* Tamamlanma Oranı */}
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border transition-colors duration-200`}>
          <div className="text-4xl font-bold text-green-400 mb-2">
            %{completionRate}
          </div>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Tamamlanma Oranı</div>
        </div>

        {/* Yaklaşan Bitiş Tarihleri */}
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border transition-colors duration-200`}>
          <div className="text-4xl font-bold text-orange-400 mb-2">
            {upcomingDeadlines.length}
          </div>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Yaklaşan Bitiş Tarihi</div>
        </div>

        {/* Gecikmiş Görevler */}
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border transition-colors duration-200`}>
          <div className="text-4xl font-bold text-red-400 mb-2">
            {overdueTodos.length}
          </div>
          <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Gecikmiş Görev</div>
        </div>
      </div>

      {/* Detaylı İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Durum Dağılımı */}
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border transition-colors duration-200`}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'} mb-4`}>Durum Dağılımı</h3>
          <div className="space-y-4">
            {/* Bekleyen */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Bekleyen</span>
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{stats.statusCounts.pending}</span>
              </div>
              <div className={`w-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                <div
                  className="bg-yellow-400 h-2 rounded-full"
                  style={{ width: `${calculatePercentage(stats.statusCounts.pending)}%` }}
                />
              </div>
            </div>
            {/* Devam Eden */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Devam Eden</span>
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{stats.statusCounts.in_progress}</span>
              </div>
              <div className={`w-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                <div
                  className="bg-blue-400 h-2 rounded-full"
                  style={{ width: `${calculatePercentage(stats.statusCounts.in_progress)}%` }}
                />
              </div>
            </div>
            {/* Tamamlanan */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Tamamlanan</span>
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{stats.statusCounts.completed}</span>
              </div>
              <div className={`w-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                <div
                  className="bg-green-400 h-2 rounded-full"
                  style={{ width: `${calculatePercentage(stats.statusCounts.completed)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Öncelik Dağılımı */}
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border transition-colors duration-200`}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'} mb-4`}>Öncelik Dağılımı</h3>
          <div className="space-y-4">
            {/* Yüksek */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Yüksek</span>
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{stats.priorityCounts.high}</span>
              </div>
              <div className={`w-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                <div
                  className="bg-red-400 h-2 rounded-full"
                  style={{ width: `${calculatePercentage(stats.priorityCounts.high)}%` }}
                />
              </div>
            </div>
            {/* Orta */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Orta</span>
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{stats.priorityCounts.medium}</span>
              </div>
              <div className={`w-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                <div
                  className="bg-orange-400 h-2 rounded-full"
                  style={{ width: `${calculatePercentage(stats.priorityCounts.medium)}%` }}
                />
              </div>
            </div>
            {/* Düşük */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Düşük</span>
                <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>{stats.priorityCounts.low}</span>
              </div>
              <div className={`w-full ${isDark ? 'bg-gray-700' : 'bg-gray-200'} rounded-full h-2`}>
                <div
                  className="bg-green-400 h-2 rounded-full"
                  style={{ width: `${calculatePercentage(stats.priorityCounts.low)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Yaklaşan Görevler Listesi */}
      {upcomingDeadlines.length > 0 && (
        <div className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl p-6 border transition-colors duration-200`}>
          <h3 className={`text-lg font-semibold ${isDark ? 'text-gray-100' : 'text-gray-900'} mb-4`}>Yaklaşan Görevler</h3>
          <div className="space-y-3">
            {upcomingDeadlines.map(todo => (
              <div
                key={todo.id}
                className={`flex items-center justify-between p-3 ${
                  isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50 border-gray-200'
                } rounded-lg border transition-colors duration-200`}
              >
                <div>
                  <div className={`font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'}`}>{todo.title}</div>
                  <div className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Bitiş: {new Date(todo.due_date).toLocaleDateString('tr-TR')}
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  todo.priority === 'high' 
                    ? isDark ? 'bg-red-900/30 text-red-200' : 'bg-red-100 text-red-800'
                    : todo.priority === 'medium'
                    ? isDark ? 'bg-orange-900/30 text-orange-200' : 'bg-orange-100 text-orange-800'
                    : isDark ? 'bg-green-900/30 text-green-200' : 'bg-green-100 text-green-800'
                }`}>
                  {todo.priority === 'high' ? '🔴 Yüksek' : todo.priority === 'medium' ? '🟡 Orta' : '🟢 Düşük'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Statistics; 