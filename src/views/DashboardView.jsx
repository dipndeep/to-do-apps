import { useState, useEffect, useCallback } from 'react';
import {
  LogOut,
  Plus,
  Search,
  Trash2,
  Edit,
  Calendar,
  CheckCircle,
  Clock,
  ClipboardList,
  AlertOctagon,
  Grid,
  List,
  User,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Tag,
  Timer,
  Archive,
  Settings,
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import CustomSelect from '../components/CustomSelect';
import TaskModal from '../components/TaskModal';
import { mockDb } from '../utils/mockDb';

// Import sub-tab views
import InsightsTab from '../components/tabs/InsightsTab';
import CategoriesTab from '../components/tabs/CategoriesTab';
import PomodoroTab from '../components/tabs/PomodoroTab';
import ArchiveTab from '../components/tabs/ArchiveTab';
import SettingsTab from '../components/tabs/SettingsTab';

export default function DashboardView({ 
  user, 
  onLogout, 
  showToast,
  currentTheme,
  onChangeTheme,
  onUpdateUserSession
}) {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, selesai: 0, belumSelesai: 0 });
  const [categories, setCategories] = useState([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeTab, setActiveTab] = useState('tasks'); // 'tasks', 'insights', 'categories', 'pomodoro', 'archive', 'settings'
  
  // Filtering & Sorting State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL'); // 'ALL', 'SELESAI', 'BELUM_SELESAI'
  const [priorityFilter, setPriorityFilter] = useState('ALL'); // 'ALL', 'TINGGI', 'SEDANG', 'RENDAH'
  const [sortBy, setSortBy] = useState('DUE_DATE_ASC'); // 'DUE_DATE_ASC', 'DUE_DATE_DESC', 'CREATED_DESC'
  const [isGridView, setIsGridView] = useState(true);

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Load tasks and calculations
  const loadTasksData = useCallback(() => {
    try {
      const data = mockDb.getTasks(user.id);
      setTasks(data);
      const metrics = mockDb.getStats(user.id);
      setStats(metrics);
    } catch {
      showToast('Gagal memuat data tugas.', 'error');
    }
  }, [user.id, showToast]);

  const loadCategoriesData = useCallback(() => {
    try {
      const cats = mockDb.getCategories(user.id);
      setCategories(cats);
    } catch (err) {
      console.error('Gagal memuat data kategori:', err);
    }
  }, [user.id]);

  useEffect(() => {
    Promise.resolve().then(() => {
      loadTasksData();
      loadCategoriesData();
    });
  }, [loadTasksData, loadCategoriesData]);

  // Handle CRUD
  const handleCreateOrUpdateTask = (taskData) => {
    try {
      if (editingTask) {
        mockDb.updateTask(editingTask.id, taskData);
        showToast('Tugas berhasil diperbarui!', 'success');
      } else {
        mockDb.createTask(user.id, taskData);
        showToast('Tugas baru berhasil dibuat!', 'success');
      }
      setIsModalOpen(false);
      setEditingTask(null);
      loadTasksData();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteTask = (taskId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
      try {
        mockDb.deleteTask(taskId);
        showToast('Tugas berhasil dihapus.', 'success');
        loadTasksData();
      } catch {
        showToast('Gagal menghapus tugas.', 'error');
      }
    }
  };

  const handleToggleStatus = (task) => {
    try {
      const newStatus = task.status === 'SELESAI' ? 'BELUM_SELESAI' : 'SELESAI';
      mockDb.updateTask(task.id, { status: newStatus });
      showToast(
        newStatus === 'SELESAI' 
          ? 'Tugas ditandai selesai! Bagus!' 
          : 'Tugas dikembalikan ke belum selesai.', 
        'success'
      );
      loadTasksData();
    } catch {
      showToast('Gagal mengubah status tugas.', 'error');
    }
  };

  // Filter & Sort Logic
  const filteredTasks = tasks
    .filter((task) => {
      // Search match
      const titleMatch = task.title.toLowerCase().includes(search.toLowerCase());
      const descMatch = task.description?.toLowerCase().includes(search.toLowerCase());
      const matchesSearch = titleMatch || descMatch;

      // Status match
      const matchesStatus = 
        statusFilter === 'ALL' || 
        task.status === statusFilter;

      // Priority match
      const matchesPriority = 
        priorityFilter === 'ALL' || 
        task.priority === priorityFilter;

      return matchesSearch && matchesStatus && matchesPriority;
    })
    .sort((a, b) => {
      if (sortBy === 'DUE_DATE_ASC') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      if (sortBy === 'DUE_DATE_DESC') {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(b.dueDate) - new Date(a.dueDate);
      }
      if (sortBy === 'CREATED_DESC') {
        return new Date(b.createdAt) - new Date(a.createdAt);
      }
      return 0;
    });

  const getPriorityBadgeStyle = (priority) => {
    switch (priority) {
      case 'TINGGI':
        return 'bg-punch-red-400 text-[#011c32]';
      case 'SEDANG':
        return 'bg-amber-glow-400 text-[#011c32]';
      case 'RENDAH':
        return 'bg-light-sea-green-400 text-[#011c32]';
      default:
        return 'bg-ink-black-100 text-ink-black-900';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'TINGGI': return 'Tinggi';
      case 'SEDANG': return 'Sedang';
      case 'RENDAH': return 'Rendah';
      default: return priority;
    }
  };

  const getCategoryInfo = (catId) => {
    return categories.find((c) => c.id === catId);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-body-bg">
      {/* Sidebar Navigasi */}
      <aside 
        className={`w-full ${
          isMinimized ? 'md:w-20 md:p-3' : 'md:w-64 md:p-6'
        } bg-ink-black-950 text-white flex flex-col justify-between border-b-3 md:border-b-0 md:border-r-3 border-ink-black-900 shrink-0 p-6 select-none md:sticky md:top-0 md:h-screen transition-all duration-300 z-30`}
      >
        <div>
          {/* Brand Header */}
          {isMinimized ? (
            <div className="flex flex-col items-center gap-4 pb-6 border-b-2 border-ink-black-800 mb-8">
              <img 
                src="/dipintodo-logo.png" 
                alt="Logo" 
                className="w-10 h-10 object-contain rounded-[4px] border-2 border-ink-black-800 bg-ink-black-950 p-1 invert" 
              />
              <button
                onClick={() => setIsMinimized(false)}
                className="p-1.5 bg-amber-glow-400 border-2 border-ink-black-900 rounded-[4px] text-brand-dark hover:bg-amber-glow-300 shadow-[2px_2px_0px_0px_var(--color-ink-black-900)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
                title="Expand Sidebar"
              >
                <ChevronRight className="w-4 h-4 stroke-3" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-2 pb-6 border-b-2 border-ink-black-800 mb-8">
              <div className="flex items-center gap-2.5">
                <img 
                  src="/dipintodo-logo.png" 
                  alt="Logo" 
                  className="w-10 h-10 object-contain rounded-[4px] border-2 border-ink-black-800 bg-ink-black-950 p-1 invert" 
                />
                <div>
                  <h2 className="text-lg font-black tracking-wide leading-none uppercase m-0 text-white">
                    DipInToDo
                  </h2>
                  <span className="text-[10px] uppercase font-bold text-light-sea-green-300 tracking-wider">
                    Productivity App
                  </span>
                </div>
              </div>
              <button
                onClick={() => setIsMinimized(true)}
                className="hidden md:flex p-1.5 bg-amber-glow-400 border-2 border-ink-black-900 rounded-[4px] text-brand-dark hover:bg-amber-glow-300 shadow-[2px_2px_0px_0px_var(--color-ink-black-900)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
                title="Minimize Sidebar"
              >
                <ChevronLeft className="w-4 h-4 stroke-3" />
              </button>
            </div>
          )}

          {/* User Profile Card inside Sidebar */}
          {isMinimized ? (
            <div 
              className="bg-ink-black-950 p-2 border-2 border-ink-black-800 rounded-[4px] mb-8 flex justify-center cursor-help"
              title={`${user.name} (${user.email})`}
            >
              <div className="w-10 h-10 bg-amber-glow-300 border-2 border-white rounded-full flex items-center justify-center text-brand-dark font-bold shadow-[2px_2px_0px_0px_var(--color-ink-black-900)]">
                <User className="w-5 h-5" />
              </div>
            </div>
          ) : (
            <div className="bg-ink-black-950 p-4 border-2 border-ink-black-800 rounded-[4px] mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-glow-300 border-2 border-white rounded-full flex items-center justify-center text-brand-dark font-bold shadow-[2px_2px_0px_0px_var(--color-ink-black-900)]">
                  <User className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <p className="font-extrabold text-sm uppercase tracking-wide truncate m-0 text-white">
                    {user.name}
                  </p>
                  <p className="text-xs text-ink-black-300 truncate m-0">
                    {user.email}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Quick Menu Routing Links */}
          {isMinimized ? (
            <nav className="space-y-4 flex flex-col items-center">
              {[
                { id: 'tasks', label: 'Daftar Tugas', icon: <ClipboardList className="w-5 h-5" />, activeBg: 'bg-light-sea-green-400' },
                { id: 'insights', label: 'Statistik', icon: <TrendingUp className="w-5 h-5" />, activeBg: 'bg-amber-glow-400' },
                { id: 'categories', label: 'Kategori', icon: <Tag className="w-5 h-5" />, activeBg: 'bg-porcelain-400' },
                { id: 'pomodoro', label: 'Pomodoro', icon: <Timer className="w-5 h-5" />, activeBg: 'bg-light-sea-green-400' },
                { id: 'archive', label: 'Arsip', icon: <Archive className="w-5 h-5" />, activeBg: 'bg-porcelain-400' },
                { id: 'settings', label: 'Pengaturan', icon: <Settings className="w-5 h-5" />, activeBg: 'bg-amber-glow-400' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`p-2.5 rounded-[4px] border-2 shadow-[2px_2px_0px_0px_var(--color-ink-black-900)] border-ink-black-900 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer ${
                    activeTab === item.id 
                      ? `${item.activeBg} text-brand-dark` 
                      : 'bg-white text-ink-black-700 hover:bg-ink-black-50'
                  }`}
                  title={item.label}
                >
                  {item.icon}
                </button>
              ))}
            </nav>
          ) : (
            <nav className="space-y-2.5">
              <div className="text-[10px] uppercase font-bold text-ink-black-400 tracking-widest pl-1 mb-2">
                Menu Utama
              </div>
              {[
                { id: 'tasks', label: 'Daftar Tugas', icon: <ClipboardList className="w-4 h-4" />, activeBg: 'bg-light-sea-green-600 text-[#011c32] border-ink-black-900 shadow-[2px_2px_0px_0px_var(--color-ink-black-900)]' },
                { id: 'insights', label: 'Statistik', icon: <TrendingUp className="w-4 h-4" />, activeBg: 'bg-amber-glow-500 text-[#011c32] border-ink-black-900 shadow-[2px_2px_0px_0px_var(--color-ink-black-900)]' },
                { id: 'categories', label: 'Kategori', icon: <Tag className="w-4 h-4" />, activeBg: 'bg-porcelain-500 text-[#011c32] border-ink-black-900 shadow-[2px_2px_0px_0px_var(--color-ink-black-900)]' },
                { id: 'pomodoro', label: 'Fokus Pomodoro', icon: <Timer className="w-4 h-4" />, activeBg: 'bg-light-sea-green-600 text-[#011c32] border-ink-black-900 shadow-[2px_2px_0px_0px_var(--color-ink-black-900)]' },
                { id: 'archive', label: 'Arsip Tugas', icon: <Archive className="w-4 h-4" />, activeBg: 'bg-porcelain-500 text-[#011c32] border-ink-black-900 shadow-[2px_2px_0px_0px_var(--color-ink-black-900)]' },
                { id: 'settings', label: 'Pengaturan', icon: <Settings className="w-4 h-4" />, activeBg: 'bg-amber-glow-500 text-[#011c32] border-ink-black-900 shadow-[2px_2px_0px_0px_var(--color-ink-black-900)]' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left font-bold uppercase text-xs tracking-wider px-3 py-2.5 rounded-[4px] border-2 transition-all cursor-pointer flex items-center gap-2 ${
                    activeTab === item.id 
                      ? `${item.activeBg}` 
                      : 'border-transparent text-ink-black-400 hover:text-white hover:bg-ink-black-800'
                  }`}
                >
                  {item.icon} {item.label}
                </button>
              ))}
            </nav>
          )}
        </div>

        {/* Sidebar Footer / Logout */}
        {isMinimized ? (
          <div className="pt-6 border-t-2 border-ink-black-800 mt-8 flex justify-center">
            <button
              onClick={onLogout}
              className="p-2.5 bg-punch-red-500 hover:bg-punch-red-400 border-2 border-ink-black-900 rounded-[4px] text-white shadow-[2px_2px_0px_0px_var(--color-ink-black-900)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer"
              title="Keluar Akun"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="pt-6 border-t-2 border-ink-black-800 mt-8">
            <Button
              variant="destructive"
              onClick={onLogout}
              className="w-full justify-center text-xs tracking-wider py-2"
            >
              <LogOut className="w-4 h-4" /> KELUAR AKUN
            </Button>
          </div>
        )}
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-8 overflow-y-auto">
        
        {activeTab === 'tasks' && (
          <div className="animate-[fadeIn_0.2s_ease-out]">
            {/* Header Row */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl md:text-4xl font-black uppercase tracking-wider text-ink-black-900 m-0">
                  Daftar Pekerjaan
                </h1>
                <p className="text-ink-black-700 font-medium text-sm mt-1">
                  Atur, filter, dan selesaikan tugas harian Anda secara terstruktur.
                </p>
              </div>
              
              <Button
                variant="success"
                onClick={() => {
                  setEditingTask(null);
                  setIsModalOpen(true);
                }}
                className="lg:self-center self-start text-sm px-5 py-3"
              >
                <Plus className="w-5 h-5 stroke-3" /> TAMBAH TUGAS BARU
              </Button>
            </div>

            {/* Dashboard Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 select-none">
              {/* Stats Card 1: Total */}
              <Card 
                bg="bg-light-sea-green-100" 
                className="border-[3px] border-ink-black-900 shadow-[4px_4px_0px_0px_var(--color-ink-black-900)] flex items-center justify-between relative overflow-hidden"
              >
                <div>
                  <p className="text-xs uppercase font-extrabold tracking-wider text-ink-black-800 mb-1">
                    Total Tugas
                  </p>
                  <h3 className="text-4xl font-black text-ink-black-900 m-0 leading-none">
                    {stats.total}
                  </h3>
                </div>
                <div className="p-3 bg-light-sea-green-300 border-2 border-ink-black-900 rounded-[4px] shadow-[2px_2px_0px_0px_var(--color-ink-black-900)]">
                  <ClipboardList className="w-6 h-6 text-brand-dark" />
                </div>
              </Card>

              {/* Stats Card 2: Selesai */}
              <Card 
                bg="bg-porcelain-100" 
                className="border-[3px] border-ink-black-900 shadow-[4px_4px_0px_0px_var(--color-ink-black-900)] flex items-center justify-between relative overflow-hidden"
              >
                <div>
                  <p className="text-xs uppercase font-extrabold tracking-wider text-ink-black-800 mb-1">
                    Tugas Selesai
                  </p>
                  <h3 className="text-4xl font-black text-ink-black-900 m-0 leading-none">
                    {stats.selesai}
                  </h3>
                </div>
                <div className="p-3 bg-porcelain-300 border-2 border-ink-black-900 rounded-[4px] shadow-[2px_2px_0px_0px_var(--color-ink-black-900)]">
                  <CheckCircle className="w-6 h-6 text-brand-dark" />
                </div>
              </Card>

              {/* Stats Card 3: Belum Selesai */}
              <Card 
                bg="bg-punch-red-100" 
                className="border-[3px] border-ink-black-900 shadow-[4px_4px_0px_0px_var(--color-ink-black-900)] flex items-center justify-between relative overflow-hidden"
              >
                <div>
                  <p className="text-xs uppercase font-extrabold tracking-wider text-ink-black-800 mb-1">
                    Belum Selesai
                  </p>
                  <h3 className="text-4xl font-black text-ink-black-900 m-0 leading-none">
                    {stats.belumSelesai}
                  </h3>
                </div>
                <div className="p-3 bg-punch-red-300 border-2 border-ink-black-900 rounded-[4px] shadow-[2px_2px_0px_0px_var(--color-ink-black-900)]">
                  <Clock className="w-6 h-6 text-brand-dark" />
                </div>
              </Card>
            </div>

            {/* Action Bar & Filters Section */}
            <Card bg="bg-white" className="border-[3px] border-ink-black-900 shadow-[4px_4px_0px_0px_var(--color-ink-black-900)] p-5 mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                {/* Left: Search input */}
                <div className="flex-1 relative">
                  <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-black-500" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cari tugas berdasarkan judul atau deskripsi..."
                    className="w-full pl-11 pr-4 py-2.5 border-3 border-ink-black-900 rounded-[4px] font-semibold bg-white focus:bg-light-sea-green-50 focus:outline-none transition-colors text-sm"
                  />
                </div>

                {/* Right: Specific filters and toggles */}
                <div className="flex flex-wrap items-center gap-4">
                  {/* Priority Filter */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-ink-black-700">Prioritas:</span>
                    <CustomSelect
                      value={priorityFilter}
                      onChange={setPriorityFilter}
                      options={[
                        { value: 'ALL', label: 'Semua' },
                        { value: 'TINGGI', label: 'Tinggi', colorHex: '#e71830' },
                        { value: 'SEDANG', label: 'Sedang', colorHex: '#ff9500' },
                        { value: 'RENDAH', label: 'Rendah', colorHex: '#55ff00' },
                      ]}
                      placeholder="Semua"
                      className="w-32"
                    />
                  </div>

                  {/* Sort By Filter */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider text-ink-black-700">Urutan:</span>
                    <CustomSelect
                      value={sortBy}
                      onChange={setSortBy}
                      options={[
                        { value: 'DUE_DATE_ASC', label: 'Jatuh Tempo (Dekat)', icon: '⏱️' },
                        { value: 'DUE_DATE_DESC', label: 'Jatuh Tempo (Jauh)', icon: '⏱️' },
                        { value: 'CREATED_DESC', label: 'Tanggal Dibuat (Baru)', icon: '📅' },
                      ]}
                      placeholder="Urutan"
                      className="w-48"
                    />
                  </div>

                  {/* Grid/List View Toggles */}
                  <div className="flex border-3 border-ink-black-900 rounded-[4px] overflow-hidden">
                    <button
                      onClick={() => setIsGridView(true)}
                      className={`p-2 cursor-pointer transition-colors ${
                        isGridView ? 'bg-light-sea-green-300 text-ink-black-900' : 'bg-white hover:bg-ink-black-50 text-ink-black-700'
                      }`}
                      title="Tampilan Grid"
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setIsGridView(false)}
                      className={`p-2 cursor-pointer transition-colors border-l-2 border-ink-black-900 ${
                        !isGridView ? 'bg-light-sea-green-300 text-ink-black-900' : 'bg-white hover:bg-ink-black-50 text-ink-black-700'
                      }`}
                      title="Tampilan List"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Bottom tabs inside filters area (Status tabs) */}
              <div className="flex flex-wrap border-t-2 border-ink-black-900 mt-5 pt-4 gap-2 select-none">
                {['ALL', 'BELUM_SELESAI', 'SELESAI'].map((status) => {
                  const label = status === 'ALL' ? 'Semua Tugas' : status === 'SELESAI' ? 'Selesai' : 'Belum Selesai';
                  const activeBg = 
                    status === 'ALL' 
                      ? 'bg-light-sea-green-400' 
                      : status === 'SELESAI' 
                        ? 'bg-porcelain-400' 
                        : 'bg-punch-red-400';
                  
                  const isActive = statusFilter === status;
                  return (
                    <button
                      key={status}
                      onClick={() => setStatusFilter(status)}
                      className={`px-4 py-2 border-3 border-ink-black-900 rounded-[4px] font-bold text-xs uppercase tracking-wide transition-all cursor-pointer ${
                        isActive 
                          ? `${activeBg} shadow-[2px_2px_0px_0px_var(--color-ink-black-900)] translate-y-0`
                          : 'bg-white hover:bg-ink-black-50 shadow-[0px_0px_0px_0px_var(--color-ink-black-900)]'
                      }`}
                    >
                      {label}
                    </button>
                  );
                })}
              </div>
            </Card>

            {/* Task Grid/List Area */}
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12 px-4 border-3 border-dashed border-ink-black-900 bg-white">
                <AlertOctagon className="w-12 h-12 text-ink-black-900 mx-auto mb-3" />
                <h3 className="text-lg font-black uppercase tracking-wider">Tidak Ada Tugas Ditemukan</h3>
                <p className="text-ink-black-600 font-semibold text-sm mt-1 max-w-md mx-auto">
                  Tidak ada tugas yang sesuai dengan kriteria filter Anda. Silakan ubah filter atau buat tugas baru!
                </p>
              </div>
            ) : (
              <div className={isGridView ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
                {filteredTasks.map((task) => {
                  const isDone = task.status === 'SELESAI';
                  const cardBg = isDone ? 'bg-porcelain-100' : 'bg-white';
                  return (
                    <Card
                      key={task.id}
                      bg={cardBg}
                      hoverEffect={true}
                      className={`border-[3px] border-ink-black-900 ${
                        isDone ? 'shadow-[4px_4px_0px_0px_#339900]' : 'shadow-[4px_4px_0px_0px_var(--color-ink-black-900)]'
                      } flex flex-col justify-between h-full transition-all`}
                    >
                      {/* Task Card Header */}
                      <div>
                        <div className="flex flex-wrap gap-2 items-start justify-between mb-3">
                          <div className="flex flex-wrap gap-1.5 items-center">
                            {/* Priority Badge */}
                            <span className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-[4px] border-2 border-ink-black-900 shadow-[1.5px_1.5px_0px_0px_var(--color-ink-black-900)] ${getPriorityBadgeStyle(task.priority)}`}>
                              {getPriorityLabel(task.priority)}
                            </span>
                            
                            {/* Category Badge */}
                            {task.categoryId && (() => {
                              const cat = getCategoryInfo(task.categoryId);
                              if (!cat) return null;
                              return (
                                <span 
                                  className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider rounded-[4px] border-2 border-ink-black-900 shadow-[1.5px_1.5px_0px_0px_var(--color-ink-black-900)] text-brand-dark"
                                  style={{ backgroundColor: cat.color }}
                                >
                                  {cat.name}
                                </span>
                              );
                            })()}
                          </div>
     
                          {/* Checkbox toggle status */}
                          <button
                            onClick={() => handleToggleStatus(task)}
                            className={`w-6 h-6 border-2 border-ink-black-900 rounded-[4px] flex items-center justify-center cursor-pointer transition-colors shadow-[1.5px_1.5px_0px_0px_var(--color-ink-black-900)] ${
                              isDone ? 'bg-porcelain-400' : 'bg-white hover:bg-porcelain-50'
                            }`}
                            title={isDone ? 'Tandai Belum Selesai' : 'Tandai Selesai'}
                          >
                            {isDone && <CheckCircle className="w-4 h-4 stroke-3 text-porcelain-900" />}
                          </button>
                        </div>
     
                        <h3 className={`text-lg font-extrabold tracking-tight uppercase leading-snug wrap-break-word ${
                          isDone ? 'line-through text-ink-black-700 opacity-75' : 'text-ink-black-900'
                        }`}>
                          {task.title}
                        </h3>
                        
                        <p className={`text-sm mt-2 font-medium leading-relaxed wrap-break-word text-ink-black-800 ${
                          isDone ? 'opacity-65' : ''
                        }`}>
                          {task.description || 'Tidak ada deskripsi.'}
                        </p>
                      </div>
                      
                      {/* Task Card Footer */}
                      <div className="mt-6 pt-4 border-t-2 border-ink-black-900/20 flex flex-wrap items-center justify-between gap-3 select-none">
                        {/* Due Date Indicator */}
                        <div className="flex items-center gap-1.5 text-xs font-bold text-ink-black-800">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {task.dueDate 
                              ? new Date(task.dueDate).toLocaleDateString('id-ID', {
                                  day: '2-digit',
                                  month: 'short',
                                  year: 'numeric'
                                })
                              : 'Tidak ada tenggat'
                            }
                          </span>
                        </div>
     
                        {/* Action buttons */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingTask(task);
                              setIsModalOpen(true);
                            }}
                            className="p-2 bg-white hover:bg-light-sea-green-100 border-2 border-ink-black-900 shadow-[2px_2px_0px_0px_var(--color-ink-black-900)] hover:shadow-[1.5px_1.5px_0px_0px_var(--color-ink-black-900)] transition-all cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_0px_var(--color-ink-black-900)]"
                            title="Edit Tugas"
                          >
                            <Edit className="w-3.5 h-3.5 text-ink-black-900" />
                          </button>
                          <button
                            onClick={() => handleDeleteTask(task.id)}
                            className="p-2 bg-punch-red-400 hover:bg-punch-red-500 border-2 border-ink-black-900 shadow-[2px_2px_0px_0px_var(--color-ink-black-900)] hover:shadow-[1.5px_1.5px_0px_0px_var(--color-ink-black-900)] transition-all cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-[0px_0px_0px_0px_var(--color-ink-black-900)]"
                            title="Hapus Tugas"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-white" />
                          </button>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'insights' && (
          <InsightsTab tasks={tasks} categories={categories} />
        )}

        {activeTab === 'categories' && (
          <CategoriesTab 
            userId={user.id} 
            categories={categories} 
            onUpdateCategories={loadCategoriesData} 
            showToast={showToast} 
          />
        )}

        {activeTab === 'pomodoro' && (
          <PomodoroTab tasks={tasks} showToast={showToast} />
        )}

        {activeTab === 'archive' && (
          <ArchiveTab 
            tasks={tasks} 
            onUpdateTasks={loadTasksData} 
            showToast={showToast} 
          />
        )}

        {activeTab === 'settings' && (
          <SettingsTab 
            user={user} 
            currentTheme={currentTheme} 
            onChangeTheme={onChangeTheme} 
            onUpdateUserSession={onUpdateUserSession} 
            showToast={showToast} 
          />
        )}

        {/* Task Form Modal */}
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
          onSubmit={handleCreateOrUpdateTask}
          task={editingTask}
          userId={user.id}
        />

      </main>
    </div>
  );
}
