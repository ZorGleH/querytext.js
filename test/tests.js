test('highlight', function () {

  'use strict';

  var text, qt;

  qt = querytext();

/*1*/

  qt.parse('foo OR bar');
  text = 'foo bar';
  equal(
    qt.highlight(text, '<i>', '</i>'),
    '<i>foo</i> <i>bar</i>',
    'should highlight "foo" and "bar"'
  );

/*2*/

  qt.parse('bar');
  text = 'foo bar bart';
  equal(
    qt.highlight(text, '<i>', '</i>'),
    'foo <i>bar</i> bart',
    'should highlight "bar" only'
  );

/*3*/

  // Right truncature
  qt.parse('bar*');
  text = 'foo bar bart abar abart';
  equal(
    qt.highlight(text, '<i>', '</i>'),
    'foo <i>bar</i> <i>bar</i>t abar abart',
    'should highlight words starting with "bar"'
  );

/*4*/

  // Left truncature
  qt.parse('*bar');
  text = 'foo bar bart abar abart';
  equal(
    qt.highlight(text, '<i>', '</i>'),
    'foo <i>bar</i> bart a<i>bar</i> abart',
    'should highlight words ending with "bar"'
  );

/*5*/

  // Left and right truncature
  qt.parse('*bar*');
  text = 'foo bar bart abar abart';
  equal(
    qt.highlight(text, '<i>', '</i>'),
    'foo <i>bar</i> <i>bar</i>t a<i>bar</i> a<i>bar</i>t',
    'should highlight words starting or ending with "bar"'
  );

/*6*/

  // Complex query
  qt.parse(
    '("ABUS") AND ("Fahrrad" OR "Helm" OR "Fahrradschloss" OR ' +
      '"Hill Bill" OR "S-Force Peak" OR "S-Force Road" OR ' +
      '"Tec-Tical Pro" OR "Bügelschloss" OR "Faltschloss" OR ' +
      '"Kabelschloss" OR "Rahmenschloss" OR "Fahrradtasche" OR ' +
      '"bike bag" OR "Helmet" OR "lock" OR "cable lock")'
  );
  text = 'Abus Winner 885 Bike / Cycle Bicycle Keyed Cable Lock 185cm ' +
    'Black: £18.98 End Date: Thursday… http://t.co/RQVYhHTB9Z';
  equal(
    qt.highlight(text, '<i>', '</i>'),
    '<i>Abus</i> Winner 885 Bike / Cycle Bicycle Keyed <i>Cable Lock</i> ' +
      '185cm Black: £18.98 End Date: Thursday… http://t.co/RQVYhHTB9Z',
    'should highlight "Abus" and "Cable Lock" only'
  );

/*7*/

  // Accents
  qt.parse(
    'aaaaaa OR ' +
    'c OR ' +
    'eeee OR ' +
    'iiii OR ' +
    'n OR ' +
    'oooooo OR ' +
    'uuuu OR ' +
    'yy OR ' +
    'y'
  );
  text =
    'ÁÂÀÅÃÄ ' +
    'áâàåãä ' +
    'Ç ' +
    'ç ' +
    'ÉÊÈË ' +
    'éêèë ' +
    'ÍÎÌÏ ' +
    'íîìï ' +
    'Ñ ' +
    'ñ ' +
    'ÓÔÒØÕÖ ' +
    'óôòøõö ' +
    'ÚÛÙÜ ' +
    'úûùü ' +
    'ýÿ ' +
    'Ý';
  equal(
    qt.highlight(text, '<i>', '</i>'),
    '<i>ÁÂÀÅÃÄ</i> ' +
    '<i>áâàåãä</i> ' +
    '<i>Ç</i> ' +
    '<i>ç</i> ' +
    '<i>ÉÊÈË</i> ' +
    '<i>éêèë</i> ' +
    '<i>ÍÎÌÏ</i> ' +
    '<i>íîìï</i> ' +
    '<i>Ñ</i> ' +
    '<i>ñ</i> ' +
    '<i>ÓÔÒØÕÖ</i> ' +
    '<i>óôòøõö</i> ' +
    '<i>ÚÛÙÜ</i> ' +
    '<i>úûùü</i> ' +
    '<i>ýÿ</i> ' +
    '<i>Ý</i>',
    'should highlight all words with accents'
  );

/*8*/

  // Chinese
  qt = querytext({
    wholeword: false,
    query: '转发'
  });
  text = '央广网北京10月14日消息(记者马文佳)据中国之声《新闻晚高峰》报道，《光明日报》昨天刊发了中国科学院院士、北京大学神经科学研究所名誉所长韩济生的文章名字叫做《在过度医疗背后》。这篇文章引起了各大媒体的相继转发。';
  equal(
    qt.highlight(text, '<i>', '</i>'),
    '央广网北京10月14日消息(记者马文佳)据中国之声《新闻晚高峰》报道，《光明日报》昨天刊发了中国科学院院士、北京大学神经科学研究所名誉所长韩济生的文章名字叫做《在过度医疗背后》。这篇文章引起了各大媒体的相继<i>转发</i>。',
    'should highlight "转发"'
  );

/*9*/

  // NEAR operator
  qt = querytext('"Chapelle-en-Serval Chantilly"~1');
  text = 'Tiara Chateau Hotel Mont Royal Chantilly, La Chapelle-en-Serval : Consultez les 464 avis de voyageurs, 232 photos, et les meilleures offres pour Tiara...';
  equal(
    qt.highlight(text, '<i>', '</i>'),
    'Tiara Chateau Hotel Mont Royal <i>Chantilly</i>, La <i>Chapelle-en-Serval</i> : Consultez les 464 avis de voyageurs, 232 photos, et les meilleures offres pour Tiara...',
    'should highlight 2 close words to a distance of 1'
  );

/*10*/

  qt = querytext('"coeur français pouvoir"~5');
  text = 'i à pénétrer au coeur même du pouvoir politique français, mais qu';
  equal(
    qt.highlight(text, '<i>', '</i>'),
    'i à pénétrer au <i>coeur</i> même du <i>pouvoir</i> politique <i>français</i>, mais qu',
    'should highlight 3 close words to a distance of 5'
  );

/*11*/

  qt = querytext({
    query: '"prout pouet"~0'
  });
  text = '.prout pouet beurp .pouet prout. beurp prout pouet.';
  equal(
    qt.highlight(text, '<i>', '</i>'),
    '.<i>prout</i> <i>pouet</i> beurp .<i>pouet</i> <i>prout</i>. beurp <i>prout</i> <i>pouet</i>.',
    'should highlight 2 close words to a distance of 0'
  );

/*12*/

  qt = querytext('"seulement"~5');
  equal(
    qt.error,
    '2 words expected at least for near operator',
    'should not highlight a word alone'
  );

/*13*/

  qt = querytext('"le le"~100');
  text = 'la catastrophe. ,le,le,le Tout a c';
  equal(
    qt.highlight(text, '<i>', '</i>'),
    'la catastrophe. ,<i>le</i>,<i>le</i>,<i>le</i> Tout a c',
    'should highlight 2 same words to a distance of 100'
  );

/*14*/

  qt = querytext('"le le"~0');
  text = 'e. ,le:le\'le des saints.lelelelelele a infecté que quelques machines. Et pas n\'importe lesquelles : celles des co';
  equal(
    qt.highlight(text, '<i>', '</i>'),
    'e. ,<i>le</i>:<i>le</i>\'<i>le</i> des saints.lelelelelele a infecté que quelques machines. Et pas n\'importe lesquelles : celles des co',
    'should highlight 2 same words to a distance of 0'
  );

/*15*/

  // Double UTF chars
  // Not ready yet, one day maybe...
  //
  // qt.parse('a OR o OR ss');
  // text = 'Æ æ Œ œ ß';
  // equal(
  //   qt.highlight(text, '<i>', '</i>'),
  //  '<strong>Æ</strong> <strong>æ</strong> <strong>Œ</strong> ' +
  //    '<strong>œ</strong> <strong>ß</strong>',
  //   'should highlight all words with double chars'
  // );

});
