
export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  onClick,
  disabled = false,
  className = '',
  ...props
}) {
  const baseStyle = 'neobrutal-border neobrutal-shadow neobrutal-button-active font-bold px-4 py-2 text-sm tracking-wide transition-all uppercase outline-none select-none rounded-[4px] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:translate-x-[4px] active:translate-y-[4px] active:shadow-none';

  const variants = {
    primary: 'bg-light-sea-green-500 hover:bg-light-sea-green-400 text-brand-dark',
    success: 'bg-porcelain-500 hover:bg-porcelain-400 text-brand-dark',
    destructive: 'bg-punch-red-500 hover:bg-punch-red-400 text-white',
    warning: 'bg-amber-glow-500 hover:bg-amber-glow-400 text-brand-dark',
    dark: 'bg-brand-dark hover:bg-[#033863] text-white',
    secondary: 'bg-light-sea-green-100 hover:bg-light-sea-green-200 text-ink-black-900',
    outline: 'bg-card-bg hover:bg-ink-black-50 text-ink-black-900',
  };

  const selectedVariant = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${selectedVariant} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
