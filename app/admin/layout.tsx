import type { ReactNode } from 'react';

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div
      className="text-gray-900 antialiased bg-white"
      style={{ colorScheme: 'light' }}
    >
      {children}
    </div>
  );
}
