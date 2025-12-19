interface SectionTitleProps {
  children: React.ReactNode;
}

export function SectionTitle({ children }: SectionTitleProps) {
  return <h3 className="mb-6 text-2xl font-bold text-white">{children}</h3>;
}
