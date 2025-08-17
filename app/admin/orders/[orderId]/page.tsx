import { prisma } from '@/lib/prisma';

export default async function OrderDetail({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const heartlinks = await prisma.heartlink.findMany({
    where: { shopifyOrderId: orderId },
    orderBy: { createdAt: 'asc' },
  });

  if (heartlinks.length === 0) {
    return <div>No records for order {orderId}</div>;
  }

  const any = heartlinks[0];

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 12 }}>
        Order {any.shopifyOrderNumber} ({any.shopifyOrderId})
      </h2>

      <div style={{ marginBottom: 16 }}>
        <div>
          <strong>Email:</strong> {any.customerEmail || '-'}
        </div>
        <div>
          <strong>Phone:</strong> {any.customerPhone || '-'}
        </div>
        <div>
          <strong>Shipping:</strong>{' '}
          {[
            any.shippingName,
            any.shippingAddress1,
            any.shippingAddress2,
            any.shippingCity,
            any.shippingProvince,
            any.shippingZip,
            any.shippingCountry,
          ]
            .filter(Boolean)
            .join(', ') || '-'}
        </div>
      </div>

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
                Slug
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
                SKU
              </th>
            </tr>
          </thead>
          <tbody>
            {heartlinks.map(h => (
              <tr key={h.id}>
                <td style={{ padding: 8, borderBottom: '1px solid #f0f0f0' }}>
                  {h.slug}
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
                  {h.variantSku || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
