// Client-side Database Mock using localStorage
// This simulates a full ExpressJS + PostgreSQL + Prisma Backend API

const KEYS = {
  USERS: 'neobrutal_users',
  TASKS: 'neobrutal_tasks',
  CATEGORIES: 'neobrutal_categories',
  CURRENT_USER: 'neobrutal_current_user',
};

const defaultCategories = (userId) => [
  { id: 'cat-kerja', name: 'Kerja', color: '#30cfbf', userId },
  { id: 'cat-pribadi', name: 'Pribadi', color: '#ff9500', userId },
  { id: 'cat-belajar', name: 'Belajar', color: '#55ff00', userId },
  { id: 'cat-keuangan', name: 'Keuangan', color: '#e71830', userId },
];

// Seed initial tasks if the database is brand new
const initialTasks = (userId) => [
  {
    id: 'task-1',
    title: 'Mendesain Dashboard Neobrutalism Berestetika Tinggi',
    description: 'Menyelesaikan implementasi styleguide Neobrutalism pada framework Tailwind. Pastikan border tebal border-ink-black-900 dan bayangan mekanis shadow-[4px_4px_0px_0px_#011c32] berfungsi dengan transisi aktif.',
    status: 'SELESAI',
    priority: 'TINGGI',
    categoryId: 'cat-kerja',
    dueDate: new Date().toISOString().split('T')[0],
    userId: userId,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'task-2',
    title: 'Mempelajari Arsitektur Full-Stack dengan Express.js & Prisma',
    description: 'Membaca dokumentasi Prisma ORM dan merancang skema relasi One-to-Many antara User dan Task. Siapkan migrasi awal menggunakan CLI.',
    status: 'BELUM_SELESAI',
    priority: 'TINGGI',
    categoryId: 'cat-belajar',
    dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    userId: userId,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-3',
    title: 'Konfigurasi Database PostgreSQL dan Skema Migrasi',
    description: 'Instalasi docker container PostgreSQL lokal, setup string koneksi DATABASE_URL di file .env, dan lakukan npx prisma db push.',
    status: 'BELUM_SELESAI',
    priority: 'SEDANG',
    categoryId: 'cat-kerja',
    dueDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    userId: userId,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'task-4',
    title: 'Implementasi Hashing Password Menggunakan Bcrypt & JWT',
    description: 'Mengintegrasikan middleware autentikasi Express.js dengan library bcryptjs untuk hashing password registrasi dan jsonwebtoken untuk token sign-in.',
    status: 'BELUM_SELESAI',
    priority: 'RENDAH',
    categoryId: 'cat-belajar',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString().split('T')[0],
    userId: userId,
    createdAt: new Date().toISOString(),
  }
];

export const mockDb = {
  // Helper to read raw keys from local storage
  _get(key, defaultValue = []) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  },

  // Helper to write raw keys to local storage
  _set(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
  },

  // User auth methods
  register(email, name, password) {
    const users = this._get(KEYS.USERS);
    
    // Check if email already exists
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
      throw new Error('Email sudah terdaftar. Silakan gunakan email lain.');
    }

    const newUser = {
      id: 'user-' + Math.random().toString(36).substr(2, 9),
      email: email.toLowerCase(),
      name,
      password: btoa(password), // Simple base64 encode for mockup hashing security
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    this._set(KEYS.USERS, users);

    // Seed default categories
    const categories = this._get(KEYS.CATEGORIES);
    const defaults = defaultCategories(newUser.id);
    this._set(KEYS.CATEGORIES, [...categories, ...defaults]);

    // Seed initial tasks for this new user to make the UI populated
    const tasks = this._get(KEYS.TASKS);
    const seededTasks = initialTasks(newUser.id);
    this._set(KEYS.TASKS, [...tasks, ...seededTasks]);

    return { id: newUser.id, email: newUser.email, name: newUser.name };
  },

  login(email, password) {
    const users = this._get(KEYS.USERS);
    const user = users.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.password === btoa(password)
    );

    if (!user) {
      throw new Error('Email atau password salah.');
    }

    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      token: 'mock-jwt-token-' + Math.random().toString(36).substr(2, 16),
    };

    this._set(KEYS.CURRENT_USER, sessionUser);
    return sessionUser;
  },

  logout() {
    localStorage.removeItem(KEYS.CURRENT_USER);
  },

  getCurrentUser() {
    const user = localStorage.getItem(KEYS.CURRENT_USER);
    return user ? JSON.parse(user) : null;
  },

  updateProfile(userId, data) {
    const users = this._get(KEYS.USERS);
    const idx = users.findIndex(u => u.id === userId);
    if (idx === -1) throw new Error('User tidak ditemukan.');

    if (data.email && data.email !== users[idx].email) {
      const emailExists = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
      if (emailExists) throw new Error('Email sudah digunakan.');
    }

    users[idx] = {
      ...users[idx],
      name: data.name || users[idx].name,
      email: data.email || users[idx].email,
      password: data.password ? btoa(data.password) : users[idx].password,
    };
    this._set(KEYS.USERS, users);

    // Update session
    const current = this.getCurrentUser();
    if (current && current.id === userId) {
      const updated = {
        ...current,
        name: users[idx].name,
        email: users[idx].email,
      };
      this._set(KEYS.CURRENT_USER, updated);
      return updated;
    }
    return current;
  },

  // Category management
  getCategories(userId) {
    const categories = this._get(KEYS.CATEGORIES);
    const userCategories = categories.filter(c => c.userId === userId);
    if (userCategories.length === 0) {
      // Seed default categories
      const defaults = defaultCategories(userId);
      this._set(KEYS.CATEGORIES, [...categories, ...defaults]);
      return defaults;
    }
    return userCategories;
  },
  
  createCategory(userId, name, color) {
    const categories = this._get(KEYS.CATEGORIES);
    if (!name.trim()) throw new Error('Nama kategori wajib diisi.');
    
    // Check duplication
    const userCategories = categories.filter(c => c.userId === userId);
    if (userCategories.find(c => c.name.toLowerCase() === name.trim().toLowerCase())) {
      throw new Error('Kategori dengan nama ini sudah ada.');
    }

    const newCat = {
      id: 'cat-' + Math.random().toString(36).substr(2, 9),
      name: name.trim(),
      color: color || '#30cfbf',
      userId,
    };
    categories.push(newCat);
    this._set(KEYS.CATEGORIES, categories);
    return newCat;
  },

  deleteCategory(categoryId) {
    const categories = this._get(KEYS.CATEGORIES);
    this._set(KEYS.CATEGORIES, categories.filter(c => c.id !== categoryId));
    
    // Set categoryId of all tasks in this category to null
    const tasks = this._get(KEYS.TASKS);
    const updatedTasks = tasks.map(t => t.categoryId === categoryId ? { ...t, categoryId: null } : t);
    this._set(KEYS.TASKS, updatedTasks);
    return true;
  },

  // Tasks CRUD methods
  getTasks(userId) {
    const tasks = this._get(KEYS.TASKS);
    return tasks.filter(t => t.userId === userId);
  },

  createTask(userId, taskData) {
    const tasks = this._get(KEYS.TASKS);
    
    if (!taskData.title || taskData.title.trim() === '') {
      throw new Error('Judul tugas wajib diisi.');
    }

    const newTask = {
      id: 'task-' + Math.random().toString(36).substr(2, 9),
      title: taskData.title.trim(),
      description: taskData.description ? taskData.description.trim() : '',
      status: taskData.status || 'BELUM_SELESAI',
      priority: taskData.priority || 'SEDANG',
      categoryId: taskData.categoryId || null,
      dueDate: taskData.dueDate || null,
      userId: userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    tasks.push(newTask);
    this._set(KEYS.TASKS, tasks);
    return newTask;
  },

  updateTask(taskId, taskData) {
    const tasks = this._get(KEYS.TASKS);
    const idx = tasks.findIndex(t => t.id === taskId);
    
    if (idx === -1) {
      throw new Error('Tugas tidak ditemukan.');
    }

    if (taskData.title !== undefined && taskData.title.trim() === '') {
      throw new Error('Judul tugas tidak boleh kosong.');
    }

    const updatedTask = {
      ...tasks[idx],
      ...taskData,
      title: taskData.title !== undefined ? taskData.title.trim() : tasks[idx].title,
      description: taskData.description !== undefined ? taskData.description.trim() : tasks[idx].description,
      categoryId: taskData.categoryId !== undefined ? taskData.categoryId : tasks[idx].categoryId,
      updatedAt: new Date().toISOString(),
    };

    tasks[idx] = updatedTask;
    this._set(KEYS.TASKS, tasks);
    return updatedTask;
  },

  deleteTask(taskId) {
    const tasks = this._get(KEYS.TASKS);
    const updatedTasks = tasks.filter(t => t.id !== taskId);
    this._set(KEYS.TASKS, updatedTasks);
    return true;
  },

  // Dashboard Stats Calculations
  getStats(userId) {
    const tasks = this.getTasks(userId);
    const total = tasks.length;
    const selesai = tasks.filter(t => t.status === 'SELESAI').length;
    const belumSelesai = total - selesai;

    return {
      total,
      selesai,
      belumSelesai,
    };
  }
};
