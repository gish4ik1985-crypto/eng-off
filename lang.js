/* Языки изучения. Английский и итальянский работают на одном движке: слова, уроки, диалоги, песенки и аудирование
   лежат в наборах (пакетах), а игра на лету подменяет глобальные данные на нужный язык (функция langUse в game.js).
   Данные итальянского — файлы it_*.js (подключаются до этого файла). Пакет английского снимается здесь «снимком» из уже загруженных данных. */
const LANGINFO = {
  en: { tts: 'en-US', re: /^en/i, adj: 'английский', gen: 'английского', adv: 'по-английски', chrome: 'Google US English', win: 'English (United States)', short: 'English' },
  it: { tts: 'it-IT', re: /^it/i, adj: 'итальянский', gen: 'итальянского', adv: 'по-итальянски', chrome: 'Google italiano', win: 'Italiano (Italia)', short: 'Italiano' }
};
const EN_PACK = { WORDS: Object.assign({}, WORDS), WORLDS: WORLDS.slice(), DIALOGS: DIALOGS.slice(), SONGS: SONGS.slice(), AUDIOS: AUDIOS.slice(), TALES: TALES.slice() };
const IT_PACK = {
  WORDS: typeof IT_WORDS !== 'undefined' ? IT_WORDS : {}, WORLDS: typeof IT_WORLDS !== 'undefined' ? IT_WORLDS : [], DIALOGS: typeof IT_DIALOGS !== 'undefined' ? IT_DIALOGS : [],
  SONGS: typeof IT_SONGS !== 'undefined' ? IT_SONGS : [], AUDIOS: typeof IT_AUDIOS !== 'undefined' ? IT_AUDIOS : [], TALES: []
};
