/**
 * Crée next-build.zip pour déploiement cPanel.
 */
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.join(__dirname, '..');
const staging = path.join(root, '.deploy-staging');
const zipPath = path.join(root, 'next-build.zip');

const required = [path.join(root, '.next', 'prerender-manifest.json'), path.join(root, 'server.js')];

for (const file of required) {
  if (!fs.existsSync(file)) {
    console.error(`Manquant : ${file}`);
    console.error('Lancez : npm run build:deploy');
    process.exit(1);
  }
}

fs.rmSync(path.join(root, '.next', 'cache'), { recursive: true, force: true });

fs.rmSync(staging, { recursive: true, force: true });
fs.mkdirSync(staging, { recursive: true });

fs.cpSync(path.join(root, '.next'), path.join(staging, '.next'), { recursive: true });
if (fs.existsSync(path.join(root, 'public'))) {
  fs.cpSync(path.join(root, 'public'), path.join(staging, 'public'), { recursive: true });
}
fs.copyFileSync(path.join(root, 'server.js'), path.join(staging, 'server.js'));
if (fs.existsSync(path.join(root, '.htaccess'))) {
  fs.copyFileSync(path.join(root, '.htaccess'), path.join(staging, '.htaccess'));
}

if (fs.existsSync(zipPath)) {
  fs.rmSync(zipPath);
}

const isWin = process.platform === 'win32';
if (isWin) {
  execSync(
    `powershell -NoProfile -Command "Compress-Archive -Path '${staging}\\*' -DestinationPath '${zipPath}' -CompressionLevel Optimal"`,
    { stdio: 'inherit' },
  );
} else {
  execSync(`cd "${staging}" && zip -r "${zipPath}" .next server.js .htaccess`, { stdio: 'inherit' });
}

fs.rmSync(staging, { recursive: true, force: true });

const sizeMb = (fs.statSync(zipPath).size / (1024 * 1024)).toFixed(2);
console.log(`\nArchive prête : ${zipPath} (${sizeMb} Mo)`);
console.log('Contenu : .next/ + public/ + server.js + .htaccess');
console.log('\nSur le serveur (frontend/) :');
console.log('  rm -rf .next');
console.log('  unzip -o next-build.zip');
console.log('  (public/ est inclus dans le zip — fusionne avec le dossier existant)');
console.log('  Restart Node.js app dans cPanel');
