import sharp from 'sharp';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = new URL('../public/images/partenaires', import.meta.url).pathname
  .replace(/^\/([A-Za-z]:)/, '$1');

const SLUGS = ['herjimar', 'horiwon', 'sadv'];

async function toMonoWhite(slug) {
  const input = join(ROOT, `${slug}.png`);
  const output = join(ROOT, 'mono', `${slug}.png`);

  if (!existsSync(input)) {
    throw new Error(`Missing source logo: ${input}`);
  }

  const { data, info } = await sharp(input).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  const pixels = Buffer.from(data);
  const { width, height, channels } = info;

  for (let i = 0; i < pixels.length; i += channels) {
    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const saturation = max === 0 ? 0 : (max - min) / max;

    // Drop near-white backgrounds and very light neutrals.
    if (max > 232 && saturation < 0.12) {
      pixels[i + 3] = 0;
      continue;
    }

    // Keep logo shapes as soft white mono marks.
    const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
    const alpha = Math.min(255, Math.round(255 - luminance * 0.92));
    pixels[i] = 255;
    pixels[i + 1] = 255;
    pixels[i + 2] = 255;
    pixels[i + 3] = alpha;
  }

  await sharp(pixels, { raw: { width, height, channels: 4 } }).png().toFile(output);
  console.log(`Created ${output}`);
}

for (const slug of SLUGS) {
  await toMonoWhite(slug);
}
