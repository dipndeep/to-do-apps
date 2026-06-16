import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Card, { CardTitle, CardDescription } from '../Card';
import Button from '../Button';
import { mockDb } from '../../utils/mockDb';

export default function CategoriesTab({ userId, categories, onUpdateCategories, showToast }) {
  const [newCatName, setNewCatName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#30cfbf');

  // Predefined color choices matching Neobrutalist vibrant aesthetics
  const colors = [
    '#30cfbf', // Light Sea Green
    '#ff9500', // Amber Glow
    '#55ff00', // Porcelain Green
    '#e71830', // Punch Red
    '#9b51e0', // Lavender Purple
    '#ff00ff', // Fuchsia Magenta
    '#ffaa33', // Golden Amber
    '#00f0ff', // Cyber Cyan
  ];

  const handleCreateCategory = (e) => {
    e.preventDefault();
    if (!newCatName.trim()) {
      showToast('Nama kategori tidak boleh kosong!', 'error');
      return;
    }

    try {
      mockDb.createCategory(userId, newCatName, selectedColor);
      showToast('Kategori baru berhasil dibuat!', 'success');
      setNewCatName('');
      onUpdateCategories();
    } catch (err) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteCategory = (catId) => {
    // Prevent deleting seeded categories that might break core task associations easily or let them delete but warn
    if (window.confirm('Menghapus kategori ini akan membebaskan semua tugas di dalamnya. Lanjutkan?')) {
      try {
        mockDb.deleteCategory(catId);
        showToast('Kategori berhasil dihapus.', 'success');
        onUpdateCategories();
      } catch {
        showToast('Gagal menghapus kategori.', 'error');
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-[fadeIn_0.2s_ease-out]">
      
      {/* Left: Form Card */}
      <div className="lg:col-span-1">
        <Card bg="bg-[#eafaf9]" className="border-3 border-ink-black-900 shadow-[4px_4px_0px_0px_var(--color-ink-black-900)]">
          <CardTitle className="text-xl uppercase tracking-wide mb-1">Buat Kategori</CardTitle>
          <CardDescription className="mb-4">Tambahkan kategori kustom Anda sendiri.</CardDescription>
          
          <form onSubmit={handleCreateCategory} className="space-y-5">
            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2">Nama Kategori</label>
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="Contoh: Belanja Bulanan"
                className="w-full px-3 py-2 border-[3px] rounded-[4px] border-ink-black-900 bg-white font-semibold focus:bg-light-sea-green-50 focus:outline-none transition-colors text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-black uppercase tracking-wider mb-2">Pilih Warna</label>
              <div className="flex flex-wrap gap-2.5">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`w-8 h-8 rounded-full border-2 border-ink-black-900 cursor-pointer transition-all ${
                      selectedColor === c 
                        ? 'scale-110 ring-3 ring-ink-black-900 shadow-[2px_2px_0px_0px_var(--color-ink-black-900)]' 
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c }}
                    title={c}
                  />
                ))}
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full py-2.5">
              <Plus className="w-4 h-4 stroke-3" /> TAMBAH KATEGORI
            </Button>
          </form>
        </Card>
      </div>

      {/* Right: List Categories Card */}
      <div className="lg:col-span-2">
        <Card bg="bg-white" className="border-3 border-ink-black-900 shadow-[4px_4px_0px_0px_var(--color-ink-black-900)] h-full">
          <CardTitle className="text-2xl uppercase tracking-wide mb-6">Daftar Kategori Anda</CardTitle>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div
                key={cat.id}
                className="neobrutal-border p-4 rounded-[4px] bg-white shadow-[3px_3px_0px_0px_var(--color-ink-black-900)] hover:-translate-x-px hover:-translate-y-px hover:shadow-[4px_4px_0px_0px_var(--color-ink-black-900)] transition-all flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-full border-2 border-ink-black-900 shadow-[1px_1px_0px_0px_var(--color-ink-black-900)] shrink-0"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-extrabold uppercase text-xs tracking-wider text-ink-black-900 truncate max-w-[150px]">
                    {cat.name}
                  </span>
                </div>
                
                <button
                  onClick={() => handleDeleteCategory(cat.id)}
                  className="p-1.5 bg-punch-red-100 hover:bg-punch-red-400 border-2 border-ink-black-900 text-punch-red-600 hover:text-white rounded-[4px] shadow-[1.5px_1.5px_0px_0px_var(--color-ink-black-900)] active:translate-x-[1.5px] active:translate-y-[1.5px] active:shadow-none transition-all cursor-pointer"
                  title="Hapus Kategori"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      </div>

    </div>
  );
}
