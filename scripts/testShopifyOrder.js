/* eslint-disable @typescript-eslint/no-require-imports */
// scripts/testShopifyOrder.js

// Node ≥18 has global fetch. If you are on ≤16, `npm i node-fetch@2` and
// uncomment the following line:
// global.fetch = (...args) => import('node-fetch').then(({ default: f }) => f(...args));

const fs = require('fs');
const path = require('path');

// Match the server default unless you override via env
const SHOPIFY_WEBHOOK_SECRET =
  process.env.SHOPIFY_WEBHOOK_SECRET || 'placeholder_secret';

const ENDPOINT =
  process.env.WEBHOOK_URL || 'http://localhost:3000/api/shopify/webhook/order';

// Optional: If your server filters by product_id, set these IDs
// Supports both single and multiple IDs via env
const HEARTLINK_PRODUCT_IDS = (process.env.SHOPIFY_HEARTLINK_PRODUCT_IDS || '')
  .split(',')
  .map(v => v.trim())
  .filter(Boolean);
const FALLBACK_SINGLE_ID =
  process.env.SHOPIFY_HEARTLINK_PRODUCT_ID || '1234567890';
const IDS =
  HEARTLINK_PRODUCT_IDS.length > 0
    ? HEARTLINK_PRODUCT_IDS
    : [FALLBACK_SINGLE_ID];

function buildDefaultBody() {
  const now = Date.now();
  return {
    id: 555222111, // order id
    order_number: 1001,
    email: 'test@example.com',
    phone: null,
    shipping_address: {
      name: 'Test User',
      address1: '123 Test Street',
      address2: 'Apt 4',
      city: 'Gurugram',
      province: 'Haryana',
      zip: '122018',
      country: 'India',
      phone: '+911234567890',
    },
    line_items: [
      {
        id: `line-${now}-1`,
        product_id: IDS[0],
        variant_id: 46718886871266,
        variant_title: 'Standard',
        sku: 'HL-001',
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
          {
            name: 'Cover Photo',
            value: 'https://picsum.photos/seed/cover/800/600',
          },
        ],
      },
      // add another Heartlink item to prove multiple-item handling
      {
        id: `line-${now}-2`,
        product_id: IDS[IDS.length - 1],
        variant_id: 46718886871266,
        variant_title: null,
        sku: null,
        properties: [
          { name: 'Gifter Name', value: 'Charlie' },
          { name: 'Giftee Name', value: 'Dana' },
          { name: 'Relation', value: 'SISTER' },
          { name: 'Occasion', value: 'ANNIVERSARY' },
        ],
      },
      // some unrelated product (will be ignored by fallback properties check)
      {
        id: `line-${now}-3`,
        product_id: 987654321,
        quantity: 1,
        properties: [],
      },
    ],
  };
}

async function main() {
  // Support: node scripts/testShopifyOrder.js --file app/mock/shopify-requests/t-shirt-and-two-heartlinks.json
  const args = process.argv.slice(2);
  const fileIdx = args.indexOf('--file');

  let rawBody;
  if (fileIdx !== -1 && args[fileIdx + 1]) {
    const filePath = path.resolve(process.cwd(), args[fileIdx + 1]);
    rawBody = fs.readFileSync(filePath, 'utf8');
    console.log(`Using mock file: ${filePath}`);
  } else {
    rawBody = JSON.stringify(buildDefaultBody());
    console.log('Using generated default payload');
  }

  // ----- 2. Sign it like Shopify does ----------------------
  const crypto = await import('node:crypto');
  const hmac = crypto
    .createHmac('sha256', SHOPIFY_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('base64');

  // ----- 3. Send to the API --------------------------------
  const res = await fetch(ENDPOINT, {
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
