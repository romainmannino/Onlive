const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const root = path.resolve(__dirname, '..');
const publicIndex = path.join(root, 'public', 'index.html');
const backupIndex = path.join(root, '.ipad-preview-index.html');

let restored = false;

function restore() {
  if (restored) return;
  restored = true;
  try {
    if (fs.existsSync(backupIndex)) {
      fs.copyFileSync(backupIndex, publicIndex);
      fs.unlinkSync(backupIndex);
      console.log('\n✓ Landing web restaurée.');
    }
  } catch (error) {
    console.error('\nImpossible de restaurer public/index.html automatiquement:', error.message);
  }
}

// If a previous preview was interrupted, the landing can remain in the backup file.
// Recover it automatically before starting a new preview.
if (!fs.existsSync(publicIndex) && fs.existsSync(backupIndex)) {
  try {
    fs.copyFileSync(backupIndex, publicIndex);
    fs.unlinkSync(backupIndex);
    console.log('✓ Ancienne session iPad détectée : landing restaurée automatiquement.');
  } catch (error) {
    console.error('Impossible de récupérer la landing précédente:', error.message);
    process.exit(1);
  }
}

if (!fs.existsSync(publicIndex)) {
  console.error('public/index.html introuvable et aucune sauvegarde iPad disponible. Abandon.');
  process.exit(1);
}

fs.copyFileSync(publicIndex, backupIndex);
fs.unlinkSync(publicIndex);

console.log('✓ Landing mise de côté temporairement.');
console.log('✓ Démarrage de la vraie app Expo Web pour prévisualisation iPad...');
console.log('  Ouvre le port indiqué par Expo, puis utilise 1366 × 1024 en paysage.\n');

const child = spawn('npx', ['expo', 'start', '--web', '--port', '8082'], {
  cwd: root,
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

const stop = (signal) => {
  if (!child.killed) child.kill(signal);
  restore();
};

process.on('SIGINT', () => stop('SIGINT'));
process.on('SIGTERM', () => stop('SIGTERM'));
process.on('exit', restore);

child.on('exit', (code) => {
  restore();
  process.exit(code ?? 0);
});
