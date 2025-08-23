'use client';

import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  Search,
  ExternalLink,
  Package,
  Mail,
  Phone,
  MapPin,
  Eye,
  LogOut,
} from 'lucide-react';
import { useAdminAuth, authenticatedFetch } from './lib/auth';

type Heartlink = {
  id: string;
  slug: string;
  shopifyOrderId: string | null;
  shopifyOrderNumber: number | null;
  variantTitle: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  shippingName: string | null;
  shippingAddress1: string | null;
  shippingAddress2: string | null;
  shippingCity: string | null;
  shippingProvince: string | null;
  shippingZip: string | null;
  shippingCountry: string | null;
};

export default function AdminHome() {
  const [query, setQuery] = useState('');
  const [by, setBy] = useState<'orderId' | 'orderNumber' | 'slug'>(
    'orderNumber'
  );
  const [results, setResults] = useState<Heartlink[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAll, setShowAll] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [serverAuthValid, setServerAuthValid] = useState(false);
  const { signOut, isAuthenticated, checkServerAuth } = useAdminAuth();

  const searchUrl = useMemo(() => {
    const base = '/admin/api/heartlink';
    if (!query.trim()) return base; // Return base URL to fetch all when query is empty
    const params = new URLSearchParams();
    if (by === 'orderId') params.set('orderId', query.trim());
    if (by === 'orderNumber') params.set('orderNumber', query.trim());
    if (by === 'slug') params.set('slug', query.trim());
    return `${base}?${params.toString()}`;
  }, [by, query]);

  const handleLoadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    setShowAll(true);
    try {
      const res = await authenticatedFetch('/admin/api/heartlink');
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to load orders');
      }
      const data = Array.isArray(json.data) ? json.data : [];
      setResults(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) {
      handleLoadAll();
      return;
    }
    setLoading(true);
    setError(null);
    setShowAll(false);
    try {
      const res = await authenticatedFetch(searchUrl);
      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Search failed');
      }
      const data = Array.isArray(json.data)
        ? json.data
        : json.data
          ? [json.data]
          : [];
      setResults(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Search failed');
    } finally {
      setLoading(false);
    }
  }

  // Handle component mounting to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check authentication after mounting
  useEffect(() => {
    async function verifyAuth() {
      if (!mounted) return;

      const clientAuth = isAuthenticated();
      if (!clientAuth) {
        // No client credentials; redirect immediately
        sessionStorage.removeItem('admin-auth');
        window.location.href = '/admin/signin';
        return;
      }

      // Check if server-side auth is also valid
      const serverAuth = await checkServerAuth();
      setServerAuthValid(serverAuth);
      setAuthChecked(true);

      if (!serverAuth) {
        // Server auth failed, clear client auth and redirect
        sessionStorage.removeItem('admin-auth');
        setTimeout(() => {
          window.location.href = '/admin/signin';
        }, 1000);
      }
    }

    verifyAuth();
  }, [mounted, isAuthenticated, checkServerAuth]);

  // Load all orders once authentication is verified
  useEffect(() => {
    if (authChecked && serverAuthValid && showAll) {
      handleLoadAll();
    }
  }, [authChecked, serverAuthValid, showAll, handleLoadAll]);

  useEffect(() => {
    setResults(null);
    setError(null);
  }, [by]);

  // Show loading state until authentication is verified
  if (!mounted || !authChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            {!mounted ? 'Loading...' : 'Verifying authentication...'}
          </p>
        </div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (!serverAuthValid) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">
            Authentication expired. Redirecting to signin...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50/30 via-white to-cyan-50/30 relative">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-100/20 via-transparent to-cyan-100/20 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Package className="h-8 w-8 text-pink-500" />
              <h1 className="text-3xl font-bold text-gray-900">
                Orders Dashboard
              </h1>
            </div>
            <button
              onClick={signOut}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-white/50 rounded-lg transition-all duration-200"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
          <p className="text-gray-600">Manage and view all heartlink orders</p>
        </div>

        {/* Search and Controls */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <select
                  value={by}
                  onChange={e =>
                    setBy(e.target.value as 'orderId' | 'orderNumber' | 'slug')
                  }
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-3 pr-10 text-gray-700 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="orderNumber">Order Number</option>
                  <option value="orderId">Order ID</option>
                  <option value="slug">Slug</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder={
                    by === 'orderId'
                      ? 'Search by Order ID (e.g. 1234567890)'
                      : by === 'orderNumber'
                        ? 'Search by Order Number (e.g. 1001)'
                        : 'Search by Slug (e.g. 1001-1-abc123)'
                  }
                  className="w-full bg-white border border-gray-300 rounded-lg pl-10 pr-4 py-3 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-gradient-to-r from-pink-500 to-cyan-500 text-white px-6 py-3 rounded-lg font-medium hover:from-pink-600 hover:to-cyan-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  {loading ? 'Searching...' : 'Search'}
                </button>

                <button
                  type="button"
                  onClick={handleLoadAll}
                  disabled={loading}
                  className="bg-white border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                >
                  Show All
                </button>
              </div>
            </div>
          </form>

          {error && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-2">
              <svg
                className="h-5 w-5 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {error}
            </div>
          )}
        </div>

        {/* Results */}
        {loading ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-pink-500 to-cyan-500 rounded-full animate-spin mb-4">
              <div className="w-8 h-8 bg-white rounded-full"></div>
            </div>
            <p className="text-gray-600">Loading orders...</p>
          </div>
        ) : results && results.length > 0 ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 overflow-hidden">
            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-pink-50 to-cyan-50">
                  <tr>
                    <th className="text-left px-6 py-4 font-semibold text-gray-900 border-b border-gray-200">
                      Order Details
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-900 border-b border-gray-200">
                      Heartlink
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-900 border-b border-gray-200">
                      Product
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-900 border-b border-gray-200">
                      Customer
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-900 border-b border-gray-200">
                      Shipping
                    </th>
                    <th className="text-left px-6 py-4 font-semibold text-gray-900 border-b border-gray-200">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((h, index) => (
                    <tr
                      key={h.id}
                      className={
                        index % 2 === 0 ? 'bg-white/50' : 'bg-gray-50/50'
                      }
                    >
                      <td className="px-6 py-4 border-b border-gray-100">
                        <div>
                          <div className="font-medium text-gray-900">
                            #{h.shopifyOrderNumber}
                          </div>
                          <div className="text-sm text-gray-500 font-mono">
                            {h.shopifyOrderId}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 border-b border-gray-100">
                        <a
                          href={`/heartlink/${h.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-pink-600 hover:text-pink-700 flex items-center gap-1 transition-colors duration-200"
                        >
                          <span className="font-mono text-sm">{h.slug}</span>
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </td>
                      <td className="px-6 py-4 border-b border-gray-100">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-gray-400" />
                          <span className="text-gray-900">
                            {h.variantTitle || '-'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 border-b border-gray-100">
                        <div className="space-y-1">
                          {h.customerEmail && (
                            <div className="flex items-center gap-2 text-sm">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-700">
                                {h.customerEmail}
                              </span>
                            </div>
                          )}
                          {h.customerPhone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-700">
                                {h.customerPhone}
                              </span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 border-b border-gray-100">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-gray-700 max-w-xs">
                            {[
                              h.shippingName,
                              h.shippingAddress1,
                              h.shippingAddress2,
                              h.shippingCity,
                              h.shippingProvince,
                              h.shippingZip,
                              h.shippingCountry,
                            ]
                              .filter(Boolean)
                              .join(', ') || '-'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 border-b border-gray-100">
                        {h.shopifyOrderId ? (
                          <a
                            href={`/admin/orders/${h.shopifyOrderId}`}
                            className="inline-flex items-center gap-2 text-cyan-600 hover:text-cyan-700 transition-colors duration-200"
                          >
                            <Eye className="h-4 w-4" />
                            View
                          </a>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="lg:hidden space-y-4 p-4">
              {results.map(h => (
                <div
                  key={h.id}
                  className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-pink-500" />
                      <span className="font-semibold text-gray-900">
                        #{h.shopifyOrderNumber}
                      </span>
                    </div>
                    {h.shopifyOrderId && (
                      <a
                        href={`/admin/orders/${h.shopifyOrderId}`}
                        className="inline-flex items-center gap-1 text-cyan-600 hover:text-cyan-700 text-sm"
                      >
                        <Eye className="h-4 w-4" />
                        View
                      </a>
                    )}
                  </div>

                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500">Order ID:</span>
                      <span className="ml-2 font-mono text-gray-900">
                        {h.shopifyOrderId}
                      </span>
                    </div>

                    <div>
                      <span className="text-gray-500">Heartlink:</span>
                      <a
                        href={`/heartlink/${h.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="ml-2 text-pink-600 hover:text-pink-700 font-mono"
                      >
                        {h.slug}
                      </a>
                    </div>

                    {h.variantTitle && (
                      <div>
                        <span className="text-gray-500">Product:</span>
                        <span className="ml-2 text-gray-900">
                          {h.variantTitle}
                        </span>
                      </div>
                    )}

                    {h.customerEmail && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700">{h.customerEmail}</span>
                      </div>
                    )}

                    {h.customerPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700">{h.customerPhone}</span>
                      </div>
                    )}

                    {[
                      h.shippingName,
                      h.shippingAddress1,
                      h.shippingCity,
                    ].filter(Boolean).length > 0 && (
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">
                          {[
                            h.shippingName,
                            h.shippingAddress1,
                            h.shippingAddress2,
                            h.shippingCity,
                            h.shippingProvince,
                            h.shippingZip,
                            h.shippingCountry,
                          ]
                            .filter(Boolean)
                            .join(', ')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Results count */}
            <div className="bg-gray-50/50 px-6 py-3 border-t border-gray-200 text-sm text-gray-600">
              Showing {results.length} order{results.length !== 1 ? 's' : ''}
              {showAll &&
                results.length === 100 &&
                ' (limited to 100 most recent)'}
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-pink-100 to-cyan-100 rounded-full mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {query.trim() ? 'No orders found' : 'Ready to search'}
            </h3>
            <p className="text-gray-600">
              {query.trim()
                ? 'Try adjusting your search criteria or browse all orders.'
                : 'Search by Order Number, Order ID, or Slug to find specific entries, or click "Show All" to view all orders.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
