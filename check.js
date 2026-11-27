/*
 * Запускает все 4 задания и проверяет, что нет ни одного ❌.
 * Запуск: node check.js
 */
'use strict';

const { execFileSync } = require('child_process');

const files = [
  'task1-playlist.js',
  'task2-wallet.js',
  'task3-employees.js',
  'task4-proxy.js',
];

let failed = false;

for (const file of files) {
  console.log(`\n=== ${file} ===`);
  let output;
  try {
    output = execFileSync('node', [file], { encoding: 'utf8' });
  } catch (e) {
    output = `${e.stdout || ''}${e.stderr || ''}`;
    failed = true;
  }
  console.log(output.trim());
  if (output.includes('❌')) failed = true;
}

if (failed) {
  console.log('\nЕсть нерешённые проверки ❌');
  process.exit(1);
} else {
  console.log('\nВсе задания решены ✅');
}
