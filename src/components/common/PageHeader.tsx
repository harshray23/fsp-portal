import type { ReactNode } from 'react';
import React from 'react'; // Import React for React.memo

interface PageHeaderProps {
  title: string;
  description?: string | ReactNode;
  actions?: ReactNode;
}

const PageHeader = React.memo(function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="mb-6 border-b pb-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {actions && <div className="mt-4 sm:mt-0">{actions}</div>}
      </div>
    </div>
  );
});
PageHeader.displayName = 'PageHeader';

export { PageHeader };
