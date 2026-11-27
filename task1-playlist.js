/*
  Задание 1. Плейлист (объект, методы, this)
 
  Сделайте объект playlist:
 
    playlist.add('Моя волна', 'Кино');  // добавить трек
    playlist.tracks;                    // [{ title: 'Моя волна', artist: 'Кино' }]
    playlist.count();                   // 1 — сколько треков
    playlist.byArtist('Кино');          // ['Моя волна'] — названия треков исполнителя
    playlist.byArtist('ABBA');          // [] — такого исполнителя нет
    playlist.clear();                   // очистить плейлист
 
  Внутри методов пишите this.tracks, а не playlist.tracks.
 
  Запуск: node task1-playlist.js — все строки должны стать ✅
 */
'use strict';

const playlist = {
  tracks: [],

  add(title, artist) {
    this.tracks.push({ title, artist });
  },

  count() {
    return this.tracks.length;
  },

  byArtist(artist) {
    return this.tracks.filter(track => track.artist === artist).map(track => track.title);
  },

  clear() {
    this.tracks.length = 0;
  },
};

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
  'add, tracks, count',
  () => {
    playlist.clear();
    playlist.add('Моя волна', 'Кино');
    playlist.add('Поезда', 'Любэ');
    return [playlist.tracks, playlist.count()];
  },
  [
    [
      { title: 'Моя волна', artist: 'Кино' },
      { title: 'Поезда', artist: 'Любэ' },
    ],
    2,
  ],
);

check(
  'byArtist: названия треков, нет исполнителя — пустой массив',
  () => {
    playlist.clear();
    playlist.add('Моя волна', 'Кино');
    playlist.add('Группа крови', 'Кино');
    playlist.add('Поезда', 'Любэ');
    return [playlist.byArtist('Кино'), playlist.byArtist('ABBA')];
  },
  [['Моя волна', 'Группа крови'], []],
);

check(
  'clear очищает плейлист',
  () => {
    playlist.add('Моя волна', 'Кино');
    playlist.clear();
    return playlist.tracks;
  },
  [],
);

check(
  'методы работают через this, а не через playlist',
  () => {
    const other = { tracks: [{ title: 'X', artist: 'Y' }], count: playlist.count, byArtist: playlist.byArtist };
    return [other.count(), other.byArtist('Y')];
  },
  [1, ['X']],
);
