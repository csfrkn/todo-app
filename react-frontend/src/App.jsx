import React, { useState, useCallback } from 'react';
import Home from './pages/Home';
import Statistics from './pages/Statistics';
import TodoList from './features/todos/components/TodoList';
import CategoryManager from './components/CategoryManager';
import TodoFormModal from './features/todos/components/TodoFormModal';
import { ThemeProvider, useTheme } from './contexts/ThemeContext';
import { ToastProvider, useToast } from './contexts/ToastContext';
import todoService from './api/todoService';

const AppContent = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [todos, setTodos] = useState([]);
  const [totalTodosCount, setTotalTodosCount] = useState(0);
  const [activeTab, setActiveTab] = useState('todos');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState(null);
  const { isDark, toggleTheme } = useTheme();
  const { addToast } = useToast();

  const updateTodos = (newTodos, totalCount) => {
    setTodos(newTodos);
    setTotalTodosCount(totalCount);
  };

  const handleOpenModal = (todo = null) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTodo(null);
  };

  const handleSubmit = useCallback(async (todoData) => {
    try {
      if (editingTodo) {
        await todoService.updateTodo(editingTodo.id, todoData);
        addToast('Görev başarıyla güncellendi.', 'success');
      } else {
        await todoService.createTodo(todoData);
        addToast('Yeni görev başarıyla oluşturuldu.', 'success');
      }
      handleCloseModal();
      // TodoList bileşenini yeniden yükle
      const todoListRef = document.querySelector('[data-component="todo-list"]');
      if (todoListRef) {
        todoListRef.dispatchEvent(new CustomEvent('reload-todos'));
      }
    } catch (error) {
      console.error('Todo kaydedilirken hata:', error);
      addToast('Görev kaydedilirken bir hata oluştu.', 'error');
    }
  }, [editingTodo, addToast]);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} transition-colors duration-200`}>
      {/* Navigation Bar */}
      <nav className={`${isDark ? 'bg-gray-900/80' : 'bg-white/80'} backdrop-blur-xl shadow-lg border-b ${isDark ? 'border-gray-800/50' : 'border-gray-200/50'} sticky top-0 z-50 transition-colors duration-200`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo ve Marka */}
            <div className="flex items-center space-x-3">
              <div 
                className="flex items-center space-x-2 cursor-pointer group"
                onClick={() => setCurrentPage('home')}
              >
                <div className="relative">
                  <span className="text-2xl group-hover:opacity-0 transition-opacity duration-200">✨</span>
                  <span className="absolute inset-0 text-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200">🌟</span>
                </div>
                <span className={`text-2xl font-bold bg-gradient-to-r ${isDark ? 'from-blue-400 via-indigo-400 to-purple-400' : 'from-blue-600 via-indigo-600 to-purple-600'} bg-clip-text text-transparent group-hover:from-blue-300 group-hover:via-indigo-300 group-hover:to-purple-300 transition-all duration-200`}>
                  TaskMaster
                </span>
              </div>
              <span className={`hidden sm:inline-flex items-center px-2.5 py-1 text-xs font-medium ${isDark ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' : 'bg-indigo-100 text-indigo-600 border-indigo-200'} rounded-full border shadow-sm transition-colors duration-200`}>
                Beta
              </span>
            </div>

            <div className="flex items-center space-x-4">
              {/* Tema Değiştirme Butonu */}
              <button
                onClick={toggleTheme}
                className={`relative group ${isDark ? 'bg-gray-800/50' : 'bg-gray-100'} p-2.5 rounded-lg ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-200'} transition-all duration-200`}
                title={isDark ? 'Açık Temaya Geç' : 'Koyu Temaya Geç'}
              >
                {isDark ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-yellow-300 group-hover:rotate-90 transition-transform duration-200">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-indigo-600 group-hover:rotate-90 transition-transform duration-200">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                  </svg>
                )}
              </button>

              {/* Sayfa Navigasyonu */}
              <div className="hidden md:flex space-x-2">
                <button
                  onClick={() => setCurrentPage('home')}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium ${
                    currentPage === 'home'
                      ? isDark
                        ? 'bg-gradient-to-r from-indigo-500/80 to-purple-500/80 text-white shadow-lg shadow-indigo-500/20'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
                      : isDark
                        ? 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg">📋</span>
                  Görevler
                </button>
                <button
                  onClick={() => setCurrentPage('statistics')}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium ${
                    currentPage === 'statistics'
                      ? isDark
                        ? 'bg-gradient-to-r from-indigo-500/80 to-purple-500/80 text-white shadow-lg shadow-indigo-500/20'
                        : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20'
                      : isDark
                        ? 'text-gray-300 hover:bg-gray-800/50 hover:text-white'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <span className="text-lg">📊</span>
                  İstatistikler
                </button>
              </div>

              {/* Bildirimler */}
              <div className="relative">
                <button 
                  className={`relative group ${isDark ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-gray-100 hover:bg-gray-200'} p-2.5 rounded-lg transition-all duration-200`}
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <span className="text-xl group-hover:opacity-0 transition-opacity duration-200">🔔</span>
                  <span className="absolute inset-0 flex items-center justify-center text-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200">🔸</span>
                  <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-5 w-5 bg-indigo-500 text-xs text-white items-center justify-center font-medium">
                      2
                    </span>
                  </span>
                </button>
                {showNotifications && (
                  <div className={`absolute right-0 mt-2 w-80 ${isDark ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-xl rounded-xl shadow-xl border ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'} p-4 z-50`}>
                    <div className={`text-sm font-medium ${isDark ? 'text-gray-200' : 'text-gray-900'} mb-3 pb-2 border-b ${isDark ? 'border-gray-700/50' : 'border-gray-200/50'}`}>Bildirimler</div>
                    <div className="space-y-2">
                      <div className={`p-2 ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'} rounded-lg cursor-pointer transition-all group`}>
                        <div className={`flex items-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          <span className="text-xl">🎯</span>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Yeni görev eklendi</p>
                            <p className="text-xs opacity-70">2 dakika önce</p>
                          </div>
                        </div>
                      </div>
                      <div className={`p-2 ${isDark ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'} rounded-lg cursor-pointer transition-all group`}>
                        <div className={`flex items-center gap-3 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                          <span className="text-xl">✅</span>
                          <div className="flex-1">
                            <p className="text-sm font-medium">Görev tamamlandı</p>
                            <p className="text-xs opacity-70">5 dakika önce</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentPage === 'home' && <TodoList onUpdateTodos={updateTodos} />}
        {currentPage === 'statistics' && <Statistics />}
      </main>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;