import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const outDir = new URL('../artifacts/', import.meta.url);
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const results = [];

async function checkViewport(name, viewport) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });

  await page.goto('http://127.0.0.1:5173', { waitUntil: 'networkidle' });
  await page.screenshot({ path: fileURLToPath(new URL(`${name}.png`, outDir)), fullPage: true });

  const headingVisible = await page.getByText('Cinematic visuals for brands, artists, and digital campaigns.').isVisible();
  const projectCount = await page.locator('.work-card').count();
  const toolCount = await page.locator('.tool-card').count();
  const contactVisible = await page.getByText('hello@bhanu.studio').isVisible();

  results.push({
    name,
    headingVisible,
    projectCount,
    toolCount,
    contactVisible,
    errors
  });

  await page.close();
}

await checkViewport('desktop', { width: 1440, height: 1000 });
await checkViewport('mobile', { width: 390, height: 844 });
await browser.close();

console.log(JSON.stringify(results, null, 2));
