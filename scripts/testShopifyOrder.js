// scripts/testShopifyOrder.js

// Node ≥18 has global fetch. If you are on ≤16, `npm i node-fetch@2` and
// uncomment the following line:
// global.fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

const SHOPIFY_WEBHOOK_SECRET =
  process.env.SHOPIFY_WEBHOOK_SECRET || 'whsec_test';
const HEARTLINK_PRODUCT_ID =
  process.env.SHOPIFY_HEARTLINK_PRODUCT_ID || '1234567890';

async function main() {
  // ----- 1. Build a fake Shopify order payload -------------
  const body = {
    id: 555222111, // order id
    order_number: 1001,
    line_items: [
      {
        id: 'line-1',
        product_id: HEARTLINK_PRODUCT_ID,
        properties: [
          { name: 'Gifter Name', value: 'Alice' },
          { name: 'Giftee Name', value: 'Bob' },
          { name: 'Relation', value: 'FRIEND' },
          { name: 'Occasion', value: 'BIRTHDAY' },
          { name: 'Message', value: 'Party time! 🎉' },
          { name: 'Compliments', value: 'Smart,Funny' },
          { name: 'Spin the Wheel Ideas', value: 'Karaoke,Movie night' },
          { name: 'Scratch Card Coupons', value: 'Free Pizza' },
          { name: 'Photos', value: 'https://picsum.photos/400' },
        ],
      },
      // add another Heartlink item to prove multiple-item handling
      {
        id: 'line-2',
        product_id: HEARTLINK_PRODUCT_ID,
        properties: [
          { name: 'Gifter Name', value: 'Charlie' },
          { name: 'Giftee Name', value: 'Dana' },
          { name: 'Relation', value: 'SISTER' },
          { name: 'Occasion', value: 'ANNIVERSARY' },
        ],
      },
      // some unrelated product
      { id: 'line-3', product_id: 987654321, quantity: 1, properties: [] },
    ],
  };

  // ----- 2. Sign it like Shopify does ----------------------
  const crypto = await import('node:crypto');
  const rawBody = JSON.stringify(body);
  const hmac = crypto
    .createHmac('sha256', SHOPIFY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('base64');

  // ----- 3. Fire it at your local Next.js API --------------
  const res = await fetch('http://localhost:3000/api/shopify/webhook/order', {
    method: 'POST',
    body: rawBody,
    headers: {
      'Content-Type': 'application/json',
      'x-shopify-hmac-sha256': hmac,
    },
  });

  console.log('Status:', res.status);

  let out;
  const contentType = res.headers.get('content-type') || '';
  if (contentType.includes('application/json')) {
    out = await res.json();
  } else {
    out = await res.text();
  }

  if (res.status >= 400) {
    console.error('🛑 Error response from API');
  }

  console.log(out);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
