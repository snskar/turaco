'use client';

import { useEffect, useMemo, useState } from 'react';

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

  const searchUrl = useMemo(() => {
    const base = '/admin/api/heartlink';
    if (!query.trim()) return '';
    const params = new URLSearchParams();
    if (by === 'orderId') params.set('orderId', query.trim());
    if (by === 'orderNumber') params.set('orderNumber', query.trim());
    if (by === 'slug') params.set('slug', query.trim());
    return `${base}?${params.toString()}`;
  }, [by, query]);

  useEffect(() => {
    setResults(null);
    setError(null);
  }, [by]);

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchUrl) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(searchUrl);
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

  return (
    <div>
      <form
        onSubmit={handleSearch}
        style={{ display: 'flex', gap: 8, marginBottom: 16 }}
      >
        <select
          value={by}
          onChange={e =>
            setBy(e.target.value as 'orderId' | 'orderNumber' | 'slug')
          }
        >
          <option value="orderNumber">Order Number</option>
          <option value="orderId">Order ID</option>
          <option value="slug">Slug</option>
        </select>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={
            by === 'orderId'
              ? 'e.g. 1234567890'
              : by === 'orderNumber'
                ? 'e.g. 1001'
                : 'e.g. 1001-1-abc123'
          }
          style={{ flex: 1, padding: 8 }}
        />
        <button type="submit" disabled={loading || !query.trim()}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error ? (
        <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>
      ) : null}

      {results && results.length > 0 ? (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th
                  style={{
                    textAlign: 'left',
                    padding: 8,
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  Order ID
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: 8,
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  Order Number
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: 8,
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  Heartlink URL
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: 8,
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  Variant
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: 8,
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  Email
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: 8,
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  Phone
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: 8,
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  Shipping
                </th>
                <th
                  style={{
                    textAlign: 'left',
                    padding: 8,
                    borderBottom: '1px solid #ddd',
                  }}
                >
                  View
                </th>
              </tr>
            </thead>
            <tbody>
              {results.map(h => (
                <tr key={h.id}>
                  <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>
                    {h.shopifyOrderId}
                  </td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>
                    {h.shopifyOrderNumber}
                  </td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>
                    <a
                      href={`/heartlink/${h.slug}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {`heartlink.turaco.com/heartlink/${h.slug}`}
                    </a>
                  </td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>
                    {h.variantTitle || '-'}
                  </td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>
                    {h.customerEmail || '-'}
                  </td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>
                    {h.customerPhone || '-'}
                  </td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>
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
                  </td>
                  <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>
                    {h.shopifyOrderId ? (
                      <a href={`/admin/orders/${h.shopifyOrderId}`}>Open</a>
                    ) : (
                      '-'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div style={{ color: '#666' }}>
          Search by Order Number, Order ID or Slug to view entries.
        </div>
      )}
    </div>
  );
}
