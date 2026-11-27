/*
  Задание 4. Proxy (ловушки get и set)
 
  А. withDefaults(target, defaults) — при чтении: если свойство есть в target,
     вернуть его, если нет — вернуть значение из defaults.
 
       const config = withDefaults({ host: 'localhost' }, { host: '0.0.0.0', port: 3000 });
       config.host;  // 'localhost'
       config.port;  // 3000
 
  Б. onlyPositive(target) — записывать можно только положительные числа:
 
       const proxy = onlyPositive({});
       proxy.visits = 10;   // записалось
       proxy.visits = -5;   // TypeError (ловушка set вернула false)
 
  Подсказки: prop in target; typeof value === 'number' && value > 0; set возвращает true/false.
 
  Запуск: node task4-proxy.js — все строки должны стать ✅
 */
'use strict';

function withDefaults(target, defaults) {
  return new Proxy(target, {
    get(target, prop, receiver) {
      return prop in target ? Reflect.get(target, prop, receiver) : defaults[prop];
    },
  });
}

function onlyPositive(target) {
  return new Proxy(target, {
    set(target, prop, value, receiver) {
      return typeof value === 'number' && value > 0 && Reflect.set(target, prop, value, receiver);
    },
  });
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
  'withDefaults: своё значение и значение по умолчанию',
  () => {
    const config = withDefaults({ host: 'localhost' }, { host: '0.0.0.0', port: 3000 });
    return [config.host, config.port];
  },
  ['localhost', 3000],
);

check(
  'onlyPositive: положительное число записывается',
  () => {
    const stats = {};
    onlyPositive(stats).visits = 10;
    return stats.visits;
  },
  10,
);

check(
  'onlyPositive: отказ для отрицательного числа и строки',
  () => {
    const proxy = onlyPositive({});
    const results = [];
    try {
      proxy.visits = -5;
    } catch (e) {
      results.push(e.name);
    }
    try {
      proxy.visits = 'много';
    } catch (e) {
      results.push(e.name);
    }
    return results;
  },
  ['TypeError', 'TypeError'],
);

check(
  'после отказа остаётся старое значение',
  () => {
    const stats = {};
    const proxy = onlyPositive(stats);
    proxy.visits = 10;
    try {
      proxy.visits = -5;
    } catch {
      /* ожидаемо */
    }
    return stats.visits;
  },
  10,
);
