let $hiddenItems = $();
let activeFn = () => {};

chrome.runtime.sendMessage({
  active: '?'
}, ({ active }) => {
  if (url.match(/iltasanomat/)) {
    remove($('a'), active);
  } else if (url.match(/iltalehti/)) {
    remove($('.df-article, .df-container'), active);

    activeFn = () => {
      var script = document.createElement('script');
      script.appendChild(document.createTextNode('ILlazyImageHandler.recalculate();'));
      (document.body || document.head).appendChild(script);
      document.body.scrollTop++;
    };
  } else if (url.match(/hs/)) {
    remove($('.articlegroup__article-hs46, .module li'), active);

    $hiddenItems = $hiddenItems.add($('#breaking-news-block'));
  }

  if (active) {
    activeFn();
  }
});

var url = window.location.toString();

chrome.runtime.onMessage.addListener(function (request) {
  if ('active' in request) {
    if (request.active) {
      $hiddenItems.hide();
      activeFn();
    } else {
      $hiddenItems.show();
    }
  }
});

function remove(selector, active) {
  selector.each(function () {
    var $element = $(this);
    var html = $element.html();
    if (html.match(/vero|tulo|mätky|tiena/)) {
      if (active) {
        $element.hide();
      }
      $hiddenItems = $hiddenItems.add($element);
    }
  });
}
