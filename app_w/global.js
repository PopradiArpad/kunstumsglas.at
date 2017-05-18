/**
*  Copyright (c) 2017, Árpád Poprádi
*  All rights reserved.
*
*  This source code is licensed under the BSD-style license found in the
*  LICENSE file in the root directory of this source tree.
*/

 

//The Piwik tracking starter code
//Included into the app to get rid of the unsafe inline script tags

//The original inline version:
//----------------------------
// (function() {
//   console.log('global is running 22');
//   debugger;
//   var u="//analytics.kunstumsglas.at/";
//   _paq.push(['setTrackerUrl', u+'piwik.php']);
//   _paq.push(['setSiteId', '1']);
//   var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
//   g.type='text/javascript'; g.async=true; g.defer=true; g.src=u+'piwik.js'; s.parentNode.insertBefore(g,s);
// })();

//configure piwik client
window._paq = window._paq || [];
// tracker methods like "setCustomDimension" should be called before "trackPageView"
window._paq.push(['trackPageView']);
window._paq.push(['enableLinkTracking']);
var u="https://analytics.kunstumsglas.at/";
window._paq.push(['setTrackerUrl', u+'piwik.php']);
window._paq.push(['setSiteId', '1']);


var xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
  if (this.readyState == 4 && this.status == 200) {
    var globalScopedEval = eval;
    globalScopedEval(xhr.responseText);
  }
};
xhr.open("GET", u+'piwik.js', true);
xhr.send();
