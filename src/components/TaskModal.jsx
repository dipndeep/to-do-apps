import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from './Button';
import Card, { CardTitle } from './Card';
import CustomSelect from './CustomSelect';
import CustomDatePicker from './CustomDatePicker';
import { mockDb } from '../utils/mockDb';

export default function TaskModal({
  isOpen,
  onClose,
  onSubmit,
  userId,
  task = null, // If editing, task object is passed
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('SEDANG');
  const [status, setStatus] = useState('BELUM_SELESAI');
  const [dueDate, setDueDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen && userId) {
      try {
        const cats = mockDb.getCategories(userId);
        Promise.resolve().then(() => {
          setCategories(cats);
        });
      } catch (err) {
        console.error('Gagal mengambil kategori:', err);
      }
    }
  }, [isOpen, userId]);

  useEffect(() => {
    Promise.resolve().then(() => {
      if (task) {
        setTitle(task.title || '');
        setDescription(task.description || '');
        setPriority(task.priority || 'SEDANG');
        setStatus(task.status || 'BELUM_SELESAI');
        setDueDate(task.dueDate || '');
        setCategoryId(task.categoryId || '');
      } else {
        setTitle('');
        setDescription('');
        setPriority('SEDANG');
        setStatus('BELUM_SELESAI');
        setDueDate('');
        setCategoryId('');
      }
      setErrors({});
    });
  }, [task, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    // Simulated Zod validations
    if (!title.trim()) {
      newErrors.title = 'Judul tugas wajib diisi.';
    } else if (title.trim().length < 3) {
      newErrors.title = 'Judul tugas minimal 3 karakter.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSubmit({
      title,
      description,
      priority,
      status,
      dueDate: dueDate || null,
      categoryId: categoryId || null,
    });
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-ink-black-900/40 backdrop-blur-xs transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <Card 
        className="w-full max-w-lg relative z-50 animate-[slideIn_0.15s_ease-out] bg-white border-[3px] border-ink-black-900 shadow-[8px_8px_0px_0px_var(--color-ink-black-900)]"
        p={0}
      >
        <div className="flex items-center justify-between border-b-3 border-ink-black-900 pb-4 mb-6">
          <CardTitle className="text-2xl uppercase tracking-wide">
            {task ? 'Perbarui Tugas' : 'Tambah Tugas Baru'}
          </CardTitle>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-ink-black-100 border-2 border-transparent hover:border-ink-black-900 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 text-ink-black-900" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wide mb-2">
              Judul Tugas <span className="text-punch-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Belajar ExpressJS Middleware"
              className={`w-full px-3 py-2.5 rounded-[4px] border-[3px] border-ink-black-900 bg-white font-medium focus:bg-light-sea-green-50 focus:outline-none transition-colors ${
                errors.title ? 'border-punch-red-500 bg-punch-red-50' : 'border-ink-black-900'
              }`}
            />
            {errors.title && (
              <p className="text-punch-red-500 text-xs font-bold mt-1 uppercase tracking-wide">
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold uppercase tracking-wide mb-2">
              Deskripsi
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tambahkan detail tugas di sini..."
              rows={3}
              className="w-full px-3 py-2.5 rounded-[4px] border-[3px] border-ink-black-900 bg-white font-medium focus:bg-light-sea-green-50 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Grid fields for Priority, Category, Due Date */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Priority */}
            <div>
              <label className="block text-sm font-bold uppercase tracking-wide mb-2">
                Prioritas
              </label>
              <CustomSelect
                value={priority}
                onChange={setPriority}
                options={[
                  { value: 'RENDAH', label: 'Rendah', colorHex: '#55ff00' },
                  { value: 'SEDANG', label: 'Sedang', colorHex: '#ff9500' },
                  { value: 'TINGGI', label: 'Tinggi', colorHex: '#e71830' },
                ]}
                placeholder="Pilih Prioritas"
                position="top"
              />
            </div>

            {/* Category select */}
            <div>
              <label className="block text-sm font-bold uppercase tracking-wide mb-2">
                Kategori
              </label>
              <CustomSelect
                value={categoryId}
                onChange={setCategoryId}
                options={[
                  { value: '', label: 'Tanpa Kategori' },
                  ...categories.map((cat) => ({
                    value: cat.id,
                    label: cat.name,
                    colorHex: cat.color,
                  })),
                ]}
                placeholder="Pilih Kategori"
                position="top"
              />
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-bold uppercase tracking-wide mb-2">
                Jatuh Tempo
              </label>
              <CustomDatePicker
                value={dueDate}
                onChange={setDueDate}
                placeholder="Tenggat Waktu"
                position="top"
              />
            </div>
          </div>

          {/* Status (Only show when editing) */}
          {task && (
            <div>
              <label className="block text-sm font-bold uppercase tracking-wide mb-2">
                Status Tugas
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer font-bold select-none text-sm uppercase">
                  <input
                    type="radio"
                    name="status"
                    value="BELUM_SELESAI"
                    checked={status === 'BELUM_SELESAI'}
                    onChange={() => setStatus('BELUM_SELESAI')}
                    className="w-4 h-4 accent-ink-black-900 cursor-pointer"
                  />
                  Belum Selesai
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold select-none text-sm uppercase">
                  <input
                    type="radio"
                    name="status"
                    value="SELESAI"
                    checked={status === 'SELESAI'}
                    onChange={() => setStatus('SELESAI')}
                    className="w-4 h-4 accent-porcelain-500 cursor-pointer"
                  />
                  Selesai
                </label>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t-3 border-ink-black-900 mt-6">
            <Button variant="outline" onClick={onClose} type="button">
              Batal
            </Button>
            <Button variant="success" type="submit">
              {task ? 'Simpan Perubahan' : 'Tambah Tugas'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
