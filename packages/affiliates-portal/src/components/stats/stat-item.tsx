interface StatItemProps {
  label: string;
  value: string | number;
  lighter?: boolean;
}

export function StatItem({ label, value, lighter = false }: StatItemProps) {
  const valueClasses = lighter
    ? 'text-lg sm:text-xl font-semibold text-white'
    : 'text-2xl sm:text-3xl font-bold text-white';

  const containerClasses = lighter
    ? 'space-y-1 md:px-3 first:md:pl-0 min-w-[150px]'
    : 'space-y-2';

  return (
    <div className={containerClasses}>
      <p className="text-sm text-text-muted font-medium">{label}</p>
      <p className={valueClasses}>{value}</p>
    </div>
  );
}
