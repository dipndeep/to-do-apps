
export default function Card({
  children,
  className = '',
  bg = 'bg-card-bg',
  hoverEffect = false,
  ...props
}) {
  const hoverClass = hoverEffect 
    ? 'hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_0px_#011c32] transition-all duration-200' 
    : '';
  
  return (
    <div
      className={`neobrutal-border neobrutal-shadow rounded-[4px] p-6 text-ink-black-900 ${bg} ${hoverClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = '' }) {
  return (
    <div className={`mb-4 pb-4 border-b-2 border-ink-black-900 ${className}`}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={`text-xl font-bold tracking-tight text-ink-black-900 ${className}`}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className = '' }) {
  return (
    <p className={`text-sm text-ink-black-700 mt-1 font-medium ${className}`}>
      {children}
    </p>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={`mt-6 pt-4 border-t-2 border-ink-black-900 flex items-center justify-end gap-2 ${className}`}>
      {children}
    </div>
  );
}
