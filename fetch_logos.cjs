const fs = require('fs');
const https = require('https');

const brands = [
  { name: 'sprintray', url: 'https://sprintray.com' },
  { name: 'asiga', url: 'https://asiga.com' },
  { name: 'nextdent', url: 'https://nextdent.com' },
  { name: 'bego', url: 'https://www.bego.com' }
];

async function fetchHomepages() {
  for (const brand of brands) {
    try {
      const resp = await fetch(brand.url);
      const html = await resp.text();
      // Look for any string that ends in .svg and has "logo" in it
      const match = html.match(/[\w\:\/\-\.\_]+logo[\w\-\.\_]*\.svg/i);
      console.log(`[${brand.name}] Logo found:`, match ? match[0] : 'None');
    } catch (e) {
      console.log(`[${brand.name}] Error fetching:`, e.message);
    }
  }
}

fetchHomepages();
