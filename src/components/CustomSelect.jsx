import { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

export default function CustomSelect({
  value,
  onChange,
  options = [],
  placeholder = 'Pilih Opsi',
  className = '',
  dropdownClassName = '',
  position = 'bottom',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (val) => {
    onChange(val);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={`relative select-none ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full min-h-[42px] px-3.5 py-2 border-3 border-ink-black-900 rounded-[4px] bg-white text-ink-black-900 font-bold text-xs uppercase tracking-wider flex items-center justify-between gap-2.5 shadow-[2px_2px_0px_0px_var(--color-ink-black-900)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all cursor-pointer focus:outline-none"
      >
        <span className="flex items-center gap-2 truncate">
          {selectedOption ? (
            <>
              {selectedOption.colorHex && (
                <span 
                  className="w-3.5 h-3.5 rounded-full border border-ink-black-900 shrink-0" 
                  style={{ backgroundColor: selectedOption.colorHex }}
                />
              )}
              {selectedOption.icon && <span className="shrink-0">{selectedOption.icon}</span>}
              <span className="truncate">{selectedOption.label}</span>
            </>
          ) : (
            <span className="opacity-50 lowercase first-letter:uppercase">{placeholder}</span>
          )}
        </span>
        <ChevronDown className={`w-4 h-4 text-ink-black-900 shrink-0 transition-transform duration-150 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Options List */}
      {isOpen && (
        <div 
          className={`absolute left-0 right-0 border-3 border-ink-black-900 bg-white shadow-[4px_4px_0px_0px_var(--color-ink-black-900)] rounded-[4px] z-50 overflow-hidden flex flex-col max-h-60 overflow-y-auto ${dropdownClassName} ${
            position === 'top' ? 'bottom-full mb-2' : 'mt-2'
          }`}
        >
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => handleSelect(opt.value)}
                className={`w-full text-left font-bold text-xs uppercase tracking-wider px-3.5 py-2.5 cursor-pointer transition-colors flex items-center gap-2.5 ${
                  isSelected 
                    ? 'bg-light-sea-green-100 text-brand-dark border-b-2 last:border-b-0 border-ink-black-900' 
                    : 'bg-white hover:bg-light-sea-green-50 text-ink-black-900 border-b last:border-b-0 border-ink-black-100'
                }`}
              >
                {opt.colorHex && (
                  <span 
                    className="w-3.5 h-3.5 rounded-full border border-ink-black-900 shrink-0" 
                    style={{ backgroundColor: opt.colorHex }}
                  />
                )}
                {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                <span className="truncate flex-1">{opt.label}</span>
                {isSelected && (
                  <span className="w-1.5 h-1.5 rounded-full bg-light-sea-green-500 border border-ink-black-900" />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
