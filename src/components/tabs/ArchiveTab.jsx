import { Archive, RotateCcw, Trash2, Calendar } from 'lucide-react';
import Card from '../Card';
import { mockDb } from '../../utils/mockDb';

export default function ArchiveTab({ tasks, onUpdateTasks, showToast }) {
  // Filter only completed tasks for the archive
  const completedTasks = tasks.filter((t) => t.status === 'SELESAI');

  const handleRestoreTask = (task) => {
    try {
      mockDb.updateTask(task.id, { status: 'BELUM_SELESAI' });
      showToast('Tugas dikembalikan ke daftar aktif!', 'success');
      onUpdateTasks();
    } catch {
      showToast('Gagal memulihkan tugas.', 'error');
    }
  };

  const handlePermanentDelete = (taskId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus tugas ini secara permanen? Tindakan ini tidak dapat dibatalkan.')) {
      try {
        mockDb.deleteTask(taskId);
        showToast('Tugas dihapus secara permanen.', 'success');
        onUpdateTasks();
      } catch {
        showToast('Gagal menghapus tugas.', 'error');
      }
    }
  };

  return (
    <div className="space-y-6 animate-[fadeIn_0.2s_ease-out] select-none">
      
      <div className="flex items-center justify-between pb-4 border-b-2 border-ink-black-900">
        <div>
          <h2 className="text-2xl font-black uppercase tracking-wide text-ink-black-900 m-0">Arsip Pekerjaan Selesai</h2>
          <p className="text-xs font-semibold text-ink-black-700 mt-1">Daftar semua tugas yang telah Anda selesaikan dengan sukses.</p>
        </div>
        <div className="bg-porcelain-100 border-2 border-ink-black-900 px-3 py-1 rounded-[4px] font-black text-xs uppercase shadow-[2px_2px_0px_0px_var(--color-ink-black-900)]">
          🏆 Total Selesai: {completedTasks.length}
        </div>
      </div>

      {completedTasks.length === 0 ? (
        <Card bg="bg-white" className="border-3 border-ink-black-900 shadow-[4px_4px_0px_0px_var(--color-ink-black-900)] text-center py-16">
          <Archive className="w-12 h-12 text-ink-black-600 mx-auto mb-3" />
          <h3 className="text-lg font-black uppercase tracking-wider">Arsip Masih Kosong</h3>
          <p className="text-ink-black-600 font-semibold text-sm mt-1 max-w-sm mx-auto">
            Selesaikan beberapa tugas dari daftar aktif Anda untuk mempopulasikan arsip prestasi produktivitas Anda!
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {completedTasks.map((task) => (
            <Card
              key={task.id}
              bg="bg-porcelain-50"
              className="border-3 border-ink-black-900 shadow-[4px_4px_0px_0px_var(--color-ink-black-900)] py-4 px-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              {/* Task Details */}
              <div className="flex-1 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="bg-porcelain-400 text-ink-black-900 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-[4px] border border-ink-black-900">
                    Selesai
                  </span>
                  <span className="text-[10px] font-bold text-ink-black-600 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Pembaruan: {new Date(task.updatedAt).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                
                <h3 className="font-extrabold text-ink-black-900 uppercase tracking-wide leading-snug line-through opacity-70 wrap-break-word text-sm sm:text-base">
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-xs text-ink-black-700 truncate max-w-xl font-medium">
                    {task.description}
                  </p>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => handleRestoreTask(task)}
                  className="px-3 py-1.5 bg-white hover:bg-light-sea-green-100 border-2 border-ink-black-900 rounded-[4px] font-bold text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_var(--color-ink-black-900)] hover:shadow-[1.5px_1.5px_0px_0px_var(--color-ink-black-900)] transition-all cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none flex items-center gap-1.5"
                  title="Kembalikan ke Daftar Aktif"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> PULIHKAN
                </button>
                
                <button
                  onClick={() => handlePermanentDelete(task.id)}
                  className="p-2 bg-punch-red-400 hover:bg-punch-red-500 border-2 border-ink-black-900 rounded-[4px] text-white shadow-[2px_2px_0px_0px_var(--color-ink-black-900)] hover:shadow-[1.5px_1.5px_0px_0px_var(--color-ink-black-900)] transition-all cursor-pointer active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                  title="Hapus Permanen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

    </div>
  );
}
