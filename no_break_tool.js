$(document).ready(function () {

  function addSymbol (text) {
    /*Regular expressions s*/
    var wholeMatch = '$&';
    var space = '\\s';
    var wordSymbol = '\\w*';
    var edgeOfWord = '\\b';
    var digital = '\\d';
    var dots = '[.?!]\\s';
    /*Regular expressions e*/

    var wordsAfter = $('#wordsAfter').val().split(', ');
    var wordsBefore = $('#wordsBefore').val().split(', ');
    var wordsBetween = $('#wordsBetween').val().split(', ');
    var months = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december'];
    var marks = ['。', '，', '、', '！', '？', '：', '）'];
    var supSymbols = ['®', '&reg;'];
    var pureText = $('#inputText').val().replace(/(\<(\/?[^>]+)>)/g, '').replace(/\s+/g, ' ').replace(/^\s+/gm, '');
    var sentences = pureText.split(new RegExp(dots, 'gi'));

    /*For special characters s*/
    function makeEscaped(str) {
     return (str +'').replace( /[.?*+^$[\]\\(){}|-]/g, '\\$&' );
   };
   /*For special characters e*/


   /*add ZWJ s*/
   if ($('#marks').prop('checked')) {
     for (i=0; i<marks.length; i++) {
      text = text.replace(new RegExp(marks[i], 'g'), '&zwj;' + wholeMatch);
    }
    text = text.replace(new RegExp('（', 'g'), wholeMatch + '&zwj;');
  }
  /*add ZWJ e*/

  /*create regular expression s */
  function getRegEx(arg1, arg2, arg3) {
    var regEx = '(' + arg1 + ')(' + arg2 + ')(' + arg3 + ')';
    regEx = new RegExp(regEx, 'gi');
    return regEx;
  }
  /*create regular expression e */

  /*add NBSP after the word s*/
  if ($('#wordsAfter').val()) {
    for (i=0; i<wordsAfter.length; i++) {
      text = text.replace(getRegEx(space, wordsAfter[i], space), '$1$2&nbsp;');
      text = text.replace(getRegEx('&nbsp;', wordsAfter[i], space), '$1$2&nbsp;');
      text = text.replace(getRegEx(wordSymbol + '>', wordsAfter[i], space), '$1$2&nbsp;');
    }
  }

  if ($('#months').prop('checked')) {
   for (i=0; i<months.length; i++) {
    text = text.replace(getRegEx(months[i], space, digital), '$1&nbsp;$3');
  }
}
/*add NBSP after the word e*/

/*add NBSP after the first word of every sentence s*/
if ($('#firstWord').prop('checked')) {
  for (i=0; i<sentences.length; i++) {
    var words = sentences[i].split(' ');
    if (words[0].length <= 5 && words[0]) {
      text = text.replace(getRegEx(dots, words[0], space), '$1$2&nbsp;');
    }
  }
}
/*add NBSP after the first word of every sentence e*/

/*add NBSP before the word s*/
if ($('#wordsBefore').val()) {
  for (i=0; i<wordsBefore.length; i++) {
    text = text.replace(getRegEx(wordSymbol, space, makeEscaped(wordsBefore[i])), '$1&nbsp;$3');
  }
}
/*add NBSP before the word e*/

/*add NBSP between s*/
if ($('#wordsBetween').val()) {
  for (i=0; i<wordsBetween.length; i++) {
    var newWordsBetween = wordsBetween[i].replace(new RegExp(space, 'gi'), '&nbsp;');
    text = text.replace(new RegExp(wordsBetween[i], 'gi'), newWordsBetween);
  }
}
/*add NBSP between e*/

/*change hyphens to &#8209; s*/
if ($('#hyphenWords').prop('checked')) {
  var hyphenWords = pureText.match(getRegEx(edgeOfWord + wordSymbol, '-', wordSymbol + edgeOfWord));
  if (hyphenWords !== null) {
    for (i=0; i<hyphenWords.length; i++) {
      var newHyphenWords = hyphenWords[i].replace(/-/gi, '&#8209;');
      text = text.replace(new RegExp(hyphenWords[i], 'gi'), newHyphenWords);
    }
  }
}
/*change hyphens to &#8209; e*/

/*add <sup> s*/
if ($('#superscript').prop('checked')) {
  for (i=0; i<supSymbols.length; i++) {
    text = text.replace(new RegExp(supSymbols[i], 'g'), '<sup>' + supSymbols[i] + '</sup>');
    text = text.replace(new RegExp('<sup><sup>' + supSymbols[i] + '</sup></sup>', 'g'), '<sup>' + supSymbols[i] + '</sup>');
  }
}
/*add <sup> e*/

/*FIXING: remove extra symbols s*/
text = text.replace(new RegExp('&zwj;&zwj;', 'g'), '&zwj;');
text = text.replace(new RegExp('([^|])(&nbsp;)(\\s+)', 'g'), '$1$2');
text = text.replace(new RegExp('&amp;nbsp;', 'g'), '&nbsp;');

/*Find value wrapped into the certain tag s*/
function getValsWrappedIn(str, s1, s2){
  var regEx = new RegExp('(?<=\\' + s1 + ')(.?|\n?)*?(?=\\' + s2 + ')', 'gim'); 
  return str.match(regEx);
}
/*Find value wrapped into the certain tag e*/

function makePure(str){
  if (str !== null){
    for (i=0; i<str.length; i++) {
      var pureString = str[i].replace(new RegExp('&nbsp;', 'gim'), ' ');
      pureString = pureString.replace(new RegExp('&#8209;', 'gim'), '-');
      pureString = pureString.replace(/\$/g, '$$$');
      text = text.replace(new RegExp(makeEscaped(str[i]), 'gim'), pureString);
    }
  }
}

var tags = text.match(/(\<(\/?[^>]+)>)/g);
makePure(tags);

var pageTitle =  getValsWrappedIn(text,'<title','/title>');
makePure(pageTitle);

var mktoTokens =  getValsWrappedIn(text,'{{','}}');
makePure(mktoTokens);

var pageStyles =  getValsWrappedIn(text,'<style','/style>');
makePure(pageStyles);


var pageScripts =  getValsWrappedIn(text,'<script','/script>');
makePure(pageScripts);

var pageComments =  getValsWrappedIn(text,'<!--','-->');
makePure(pageComments);

/*FIXING: remove extra symbols e*/

return text;
}

/* Launching s*/ 
function makeUnbreakable() {
  var getInput = $('#inputText').val();
  var output = $('#outputText');
  output.val(addSymbol(getInput));
};

$('#btnUnbreak').click(function () {
  makeUnbreakable();
  return false;
});
/* Launching e*/ 

/*Configuration form s*/ 
function toggleForm() {
  $('.configuration').fadeToggle();
  $('#layer').fadeToggle();
  $('body').toggleClass('hideScroll');
};

$('.settings').click(function () {
  toggleForm();
});

$('.configuration__close').click(function () {
  toggleForm();
});

$('#layer').click(function () {
  toggleForm();
});

$('.settings').mouseover(function(){
  $('.tooltip').show();
});

$('.settings').mouseout(function(){
  $('.tooltip').hide();
});

$('#btnConfigure').click(function () {
  toggleForm();
  makeUnbreakable();
  return false;
});
/*Configuration form e*/ 

});