let $hiddenItems = $();
let activeFn = () => {};
let active = false;
let selector;
let loaded = false;

checkUrl();

chrome.runtime.sendMessage({
  active: '?'
}, (request) => {
  active = request.active;

  let timer = setInterval(() => {
    if (active) {
      checkElements($(selector));
      $hiddenItems.hide();
    }
  }, 500);

  $(() => {
    loaded = true;
    clearInterval(timer);
    checkElements($(selector));

    if (active) {
      $hiddenItems.hide();
      activeFn();
    }
  });
});

chrome.runtime.onMessage.addListener((request) => {
  if ('active' in request) {
    active = request.active;
    if (request.active) {
      $hiddenItems.hide();
      activeFn();
    } else {
      $hiddenItems.show();
    }
  }
});

function checkElements(selector) {
  selector.each((i, element) => {
    let $element = $(element);
    let html = $element.html();
    if (html.match(/vero|tulo|mätky|tiena/)) {
      $hiddenItems = $hiddenItems.add($element);
    }
  });
}

function checkUrl() {
  let url = window.location.toString();

  if (url.match(/iltasanomat/)) {
    selector = 'a';
  } else if (url.match(/iltalehti/)) {
    selector = '.df-article, .df-container';
    activeFn = () => {
      var script = document.createElement('script');
      script.appendChild(document.createTextNode('ILlazyImageHandler.recalculate();'));
      (document.body || document.head).appendChild(script);
      document.body.scrollTop++;
    };
  } else if (url.match(/hs/)) {
    selector = '.articlegroup__article-hs46, .module li';
    $hiddenItems = $hiddenItems.add($('#breaking-news-block'));
  }
}
