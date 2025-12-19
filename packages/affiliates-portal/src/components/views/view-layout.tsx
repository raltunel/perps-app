import { ReactNode } from "react";

interface ViewLayoutProps {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
}

export function ViewLayout({ title, children, actions }: ViewLayoutProps) {
  const titleId = `view-${title.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <>
      <div id={titleId} className="mb-6 flex items-center justify-between sm:mb-8">
        <h2 className="text-1xl font-bold text-white sm:text-2xl">{title}</h2>
        {actions && <div>{actions}</div>}
      </div>
      {children}
    </>
  );
}
