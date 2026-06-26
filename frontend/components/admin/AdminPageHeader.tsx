import type { ReactNode } from 'react';

interface AdminPageHeaderProps {
  label: string;
  title: string;
  lead?: string;
  actions?: ReactNode;
}

export function AdminPageHeader({ label, title, lead, actions }: AdminPageHeaderProps) {
  return (
    <header className="admin-page-header">
      <div className="admin-page-header__row">
        <div>
          <p className="admin-page-header__eyebrow">{label}</p>
          <h1 className="admin-page-header__title">{title}</h1>
          {lead ? <p className="admin-page-header__lead">{lead}</p> : null}
        </div>
        {actions ? <div className="admin-page-header__actions">{actions}</div> : null}
      </div>
    </header>
  );
}
