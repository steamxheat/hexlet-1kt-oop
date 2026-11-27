/*
  Задание 3. Сотрудники (наследование, super, полиморфизм)
 
  Сделайте класс Employee и наследников Manager и Intern:
 
    new Employee('Аня').salary();          // 60000
    new Employee('Аня').describe();        // 'Аня: 60000 ₽'
    new Manager('Борис', 25000).salary();  // 85000 — super.salary() + премия
    new Intern('Вика').salary();           // 20000
    totalSalary([dev, boss, intern]);      // сумма зарплат, без if и instanceof
 
  describe() пишем один раз — в Employee. Наследники пишут только salary().
 
  Запуск: node task3-employees.js — все строки должны стать ✅
 */
'use strict';

class Employee {
  constructor(name) {
    this.name = name;
  }

  salary() {
    return 60000;
  }

  describe() {
    return `${this.name}: ${this.salary()} ₽`;
  }
}

class Manager extends Employee {
  constructor(name, bonus) {
    super(name);
    this.bonus = bonus;
  }

  salary() {
    return super.salary() + this.bonus;
  }
}

class Intern extends Employee {
  salary() {
    return 20000;
  }
}

function totalSalary(employees) {
  return employees.reduce((total, employee) => total + employee.salary(), 0);
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
  'salary: сотрудник, менеджер, стажёр',
  () => [new Employee('Аня').salary(), new Manager('Борис', 25000).salary(), new Intern('Вика').salary()],
  [60000, 85000, 20000],
);

check(
  'describe',
  () => [new Employee('Аня').describe(), new Manager('Борис', 25000).describe(), new Intern('Вика').describe()],
  ['Аня: 60000 ₽', 'Борис: 85000 ₽', 'Вика: 20000 ₽'],
);

check(
  'наследуют Employee, describe написан только в базе',
  () => [
    new Manager('Борис', 1) instanceof Employee,
    new Intern('Вика') instanceof Employee,
    Object.hasOwn(Manager.prototype, 'describe'),
    Object.hasOwn(Intern.prototype, 'describe'),
  ],
  [true, true, false, false],
);

check(
  'Manager.salary() использует super.salary(), а не число 60000',
  () => {
    const original = Employee.prototype.salary;
    Employee.prototype.salary = () => 100;
    try {
      return new Manager('Борис', 5).salary();
    } finally {
      Employee.prototype.salary = original;
    }
  },
  105,
);

check('totalSalary', () => totalSalary([new Employee('Аня'), new Manager('Борис', 25000), new Intern('Вика')]), 165000);
