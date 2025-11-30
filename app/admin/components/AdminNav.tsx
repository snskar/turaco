'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, Mail, LogOut } from 'lucide-react';
import { useAdminAuth } from '../lib/auth';

export default function AdminNav() {
  const pathname = usePathname();
  const { signOut } = useAdminAuth();

  const isOrdersActive =
    pathname === '/admin' || (pathname?.startsWith('/admin/orders') ?? false);
  const isEmailActive = pathname === '/admin/email-templates';

  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Navigation Tabs */}
          <div className="flex items-center gap-1">
            <Link
              href="/admin"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isOrdersActive
                  ? 'bg-pink-50 text-pink-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Package className="h-4 w-4" />
              <span>Orders</span>
            </Link>

            <Link
              href="/admin/email-templates"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isEmailActive
                  ? 'bg-pink-50 text-pink-600'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <Mail className="h-4 w-4" />
              <span>Email Templates</span>
            </Link>
          </div>

          {/* Sign Out Button */}
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-all duration-200"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
