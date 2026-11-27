/*
  Задание 2. Кошелёк (class, приватное поле, геттер)
 
  Сделайте класс Wallet:
 
    const wallet = new Wallet('Аня');
    wallet.owner;           // 'Аня'
    wallet.money;           // 0
    wallet.add(100);        // 100 — метод возвращает новую сумму
    wallet.spend(30);       // 70
    wallet.money = 1000000; // не работает: #money приватный, снаружи только чтение
    wallet.add(-5);         // ошибка: 'Сумма должна быть положительной'
    wallet.spend(1000);     // ошибка: 'Не хватает денег'
 
  Запуск: node task2-wallet.js — все строки должны стать ✅
 */
'use strict';

class Wallet {
  #money = 0;

  constructor(owner) {
    this.owner = owner;
  }

  get money() {
    return this.#money;
  }

  add(amount) {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Сумма должна быть положительной');
    }
    this.#money += amount;
    return this.#money;
  }

  spend(amount) {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Сумма должна быть положительной');
    }
    if (amount > this.#money) {
      throw new Error('Не хватает денег');
    }
    this.#money -= amount;
    return this.#money;
  }
}

// ===== Проверки — не меняйте код ниже =====
const show = v => JSON.stringify(v, (k, x) => (x === undefined ? 'undefined' : x));

function check(title, fn, expected) {
  let actual;
  try {
    actual = fn();
  } catch (e) {
    actual = `ошибка: ${e.message}`;
  }
  if (show(actual) === show(expected)) {
    console.log(`✅ ${title}`);
  } else {
    console.log(`❌ ${title}`);
    console.log(`     ждали:    ${show(expected)}`);
    console.log(`     получили: ${show(actual)}`);
  }
}

check(
  'owner, add, у каждого кошелька своя сумма',
  () => {
    const a = new Wallet('Аня');
    const b = new Wallet('Борис');
    return [a.owner, a.money, a.add(100), a.add(50), a.money, b.money];
  },
  ['Аня', 0, 100, 150, 150, 0],
);

check(
  'spend уменьшает сумму и возвращает её',
  () => {
    const w = new Wallet('Аня');
    w.add(100);
    return [w.spend(30), w.money];
  },
  [70, 70],
);

check(
  'ошибки: отрицательная сумма и «не хватает денег»',
  () => {
    const w = new Wallet('Аня');
    w.add(10);
    const results = [];
    try {
      w.add(-5);
    } catch (e) {
      results.push(e.message);
    }
    try {
      w.spend(1000);
    } catch (e) {
      results.push(e.message);
    }
    return [results, w.money];
  },
  [['Сумма должна быть положительной', 'Не хватает денег'], 10],
);

check(
  'сумму нельзя изменить снаружи',
  () => {
    const w = new Wallet('Аня');
    w.add(100);
    try {
      w.money = 1000000;
    } catch {
      /* в строгом режиме — ошибка, это нормально */
    }
    return w.money;
  },
  100,
);
