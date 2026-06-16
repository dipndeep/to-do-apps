import Card, { CardTitle, CardDescription } from '../Card';
import { Zap } from 'lucide-react';

export default function InsightsTab({ tasks, categories }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'SELESAI').length;
  const incomplete = total - completed;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Priority count
  const highTasks = tasks.filter((t) => t.priority === 'TINGGI');
  const highCompleted = highTasks.filter((t) => t.status === 'SELESAI').length;
  
  const medTasks = tasks.filter((t) => t.priority === 'SEDANG');
  const medCompleted = medTasks.filter((t) => t.status === 'SELESAI').length;
  
  const lowTasks = tasks.filter((t) => t.priority === 'RENDAH');
  const lowCompleted = lowTasks.filter((t) => t.status === 'SELESAI').length;

  // Helper to draw horizontal custom bar chart
  const renderBar = (label, completedCount, totalCount, colorClass) => {
    const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
    return (
      <div className="space-y-1.5 select-none">
        <div className="flex justify-between text-xs font-black uppercase tracking-wider">
          <span>{label}</span>
          <span>{completedCount}/{totalCount} ({percent}%)</span>
        </div>
        <div className="w-full h-7 bg-white border-3 border-ink-black-900 rounded-[4px] overflow-hidden flex shadow-[2px_2px_0px_0px_var(--color-ink-black-900)]">
          <div 
            className={`h-full ${colorClass} border-r-3 border-ink-black-900 transition-all duration-500`}
            style={{ width: `${percent || 1}%` }}
          />
        </div>
      </div>
    );
  };

  // Get advice description
  const getAdvice = () => {
    if (total === 0) return 'Tambahkan beberapa tugas untuk memulai pelacakan analitik produktivitas Anda!';
    if (rate === 100) return 'Luar biasa! Semua tugas Anda telah diselesaikan. Anda adalah juara produktivitas!';
    if (rate >= 75) return 'Hebat sekali! Anda hampir menyelesaikan seluruh tugas Anda. Teruskan kerja keras Anda!';
    if (highTasks.length > 0 && highCompleted < highTasks.length) {
      return 'Fokus: Selesaikan tugas dengan prioritas TINGGI terlebih dahulu untuk meringankan beban kerja terberat Anda hari ini.';
    }
    return 'Lacak tugas-tugas kecil dan pertahankan ritme harian Anda untuk meningkatkan tingkat penyelesaian.';
  };

  return (
    <div className="space-y-8 animate-[fadeIn_0.2s_ease-out]">
      {/* Top Banner Advice Card */}
      <Card bg="bg-amber-glow-100" className="border-3 border-ink-black-900 shadow-[4px_4px_0px_0px_var(--color-ink-black-900)]">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-amber-glow-400 border-2 border-ink-black-900 rounded-[4px] shadow-[2px_2px_0px_0px_var(--color-ink-black-900)]">
            <Zap className="w-6 h-6 text-ink-black-900 stroke-[2.5]" />
          </div>
          <div>
            <CardTitle className="text-xl uppercase tracking-wide">Analisis Produktivitas Anda</CardTitle>
            <CardDescription className="text-ink-black-800 font-bold mt-1 text-sm md:text-base leading-snug">
              {getAdvice()}
            </CardDescription>
          </div>
        </div>
      </Card>

      {/* Grid of stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
        <Card bg="bg-white" className="border-3 border-ink-black-900 shadow-[4px_4px_0px_0px_var(--color-ink-black-900)]">
          <p className="text-xs uppercase font-black tracking-wider text-ink-black-700">Rasio Selesai</p>
          <div className="flex items-center gap-3 mt-2">
            <h3 className="text-4xl font-black">{rate}%</h3>
            <span className="text-xs font-bold bg-porcelain-100 border-2 border-ink-black-900 px-2 py-0.5 rounded-[4px]">
              {rate >= 70 ? '📈 Stabil' : '📉 Butuh Fokus'}
            </span>
          </div>
        </Card>

        <Card bg="bg-white" className="border-3 border-ink-black-900 shadow-[4px_4px_0px_0px_var(--color-ink-black-900)]">
          <p className="text-xs uppercase font-black tracking-wider text-ink-black-700">Tugas Diselesaikan</p>
          <h3 className="text-4xl font-black mt-2">{completed} / {total}</h3>
        </Card>

        <Card bg="bg-white" className="border-3 border-ink-black-900 shadow-[4px_4px_0px_0px_var(--color-ink-black-900)]">
          <p className="text-xs uppercase font-black tracking-wider text-ink-black-700">Tugas Belum Selesai</p>
          <h3 className="text-4xl font-black mt-2 text-punch-red-500">{incomplete}</h3>
        </Card>

        <Card bg="bg-white" className="border-3 border-ink-black-900 shadow-[4px_4px_0px_0px_var(--color-ink-black-900)]">
          <p className="text-xs uppercase font-black tracking-wider text-ink-black-700">Prioritas Tinggi Tersisa</p>
          <h3 className="text-4xl font-black mt-2 text-amber-glow-500">
            {highTasks.length - highCompleted}
          </h3>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Priority Distributions */}
        <Card bg="bg-white" className="border-3 border-ink-black-900 shadow-[4px_4px_0px_0px_var(--color-ink-black-900)]">
          <CardTitle className="uppercase tracking-wide mb-6">Penyelesaian Berdasarkan Prioritas</CardTitle>
          <div className="space-y-5">
            {renderBar('Prioritas Tinggi', highCompleted, highTasks.length, 'bg-punch-red-400')}
            {renderBar('Prioritas Sedang', medCompleted, medTasks.length, 'bg-amber-glow-400')}
            {renderBar('Prioritas Rendah', lowCompleted, lowTasks.length, 'bg-light-sea-green-400')}
          </div>
        </Card>

        {/* Right: Category Distributions */}
        <Card bg="bg-white" className="border-3 border-ink-black-900 shadow-[4px_4px_0px_0px_var(--color-ink-black-900)]">
          <CardTitle className="uppercase tracking-wide mb-6">Penyelesaian Berdasarkan Kategori</CardTitle>
          <div className="space-y-5">
            {categories.length === 0 ? (
              <p className="text-sm font-bold text-ink-black-600 uppercase tracking-wide">Belum ada kategori terdaftar.</p>
            ) : (
              categories.map((cat) => {
                const catTasks = tasks.filter((t) => t.categoryId === cat.id);
                const catCompleted = catTasks.filter((t) => t.status === 'SELESAI').length;
                const catPercent = catTasks.length > 0 ? Math.round((catCompleted / catTasks.length) * 100) : 0;
                
                // Color configuration mapping directly to hex/classes
                return (
                  <div key={cat.id} className="space-y-1.5 select-none">
                    <div className="flex justify-between text-xs font-black uppercase tracking-wider">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 border border-ink-black-900 rounded-full" style={{ backgroundColor: cat.color }} />
                        {cat.name}
                      </span>
                      <span>{catCompleted}/{catTasks.length}</span>
                    </div>
                    <div className="w-full h-5 bg-white border-3 border-ink-black-900 rounded-[4px] overflow-hidden flex shadow-[2px_2px_0px_0px_var(--color-ink-black-900)]">
                      <div 
                        className="h-full border-r-3 border-ink-black-900 transition-all duration-500"
                        style={{ 
                          width: `${catPercent || 1}%`,
                          backgroundColor: cat.color 
                        }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
