const { sampleGift: giftData } = require('../app/mock/sampleGift') as { sampleGift: any };

async function testGiftAPI() {
  try {
    console.log('\n🎁 Creating test gift...');
    console.log('\nGift data:', JSON.stringify(giftData, null, 2));
    
    const createResponse = await fetch('http://localhost:3001/api/gift', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(giftData),
    });

    const createResult = await createResponse.json();
    
    if (!createResult.success) {
      throw new Error(`Failed to create gift: ${createResult.error}\nDetails: ${createResult.details}`);
    }

    const { slug } = createResult;
    console.log('\n✨ Gift created successfully!');
    console.log('\n📝 Gift Details:');
    console.log(`- Gifter: ${giftData.gifterName}`);
    console.log(`- Giftee: ${giftData.gifteeName}`);
    console.log(`- Occasion: ${giftData.occasion}`);
    console.log(`- Slug: ${slug}`);

    console.log('\n🔍 Verifying gift data...');
    const getResponse = await fetch(`http://localhost:3001/api/gift?slug=${slug}`);
    const getResult = await getResponse.json();

    if (!getResult.success) {
      throw new Error(`Failed to fetch gift: ${getResult.error}\nDetails: ${getResult.details}`);
    }

    console.log('✅ Gift data verified successfully!');
    
    console.log('\n🌐 You can view your gift at:');
    console.log(`http://localhost:3001/gift/${slug}`);
    console.log('\nPress Ctrl+C to stop the server when done.\n');

  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('\n❌ Error:', error.message);
    } else {
      console.error('\n❌ Error:', error);
    }
    process.exit(1);
  }
}

testGiftAPI(); 