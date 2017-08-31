'use strict';

const
  collapseRegexp = /collapse-control/,
  collapsedRegexp = /collapsed/,
  defaultClass = 'collapse-control inline-list__item inline-list__item_comment-nav js-comment_children',
  collapseLiColor = 'red',
  expandLiColor = 'green',
  collapseLiText = 'Collapse',
  expandLiText = 'Expand'
  ;

if (['habrahabr.ru', 'geektimes.ru'].indexOf(location.host) !==  -1) {
  addButtons();
  document.addEventListener('click', clickHandler);
}

/**
 * @param {MouseEvent} ev
 */
function clickHandler(ev) {

  const elem = ev.target;
  if (!elem) return;

  const klass = elem.getAttribute('class') || '';

  if (collapseRegexp.test(klass)) {

    const root = elem.parentElement.parentElement.parentElement;
    const list = root.nextElementSibling;
    let newClass, display, text, color;

    if (!collapsedRegexp.test(klass)) {
      newClass = defaultClass + 'collapsed';
      display = 'none';
      text = expandLiText;
      color = expandLiColor;
    } else {
      newClass = defaultClass;
      display = '';
      text = collapseLiText;
      color = collapseLiColor;
    }

    elem.setAttribute('class', newClass);
    list.style.display = display;
    elem.textContent = text;
    elem.style.color = color;

  }

}

function addButtons() {

  const commentControlsHolders = document.querySelectorAll('.inline-list.inline-list_comment-nav') || [];

  for (let i = 0; i < commentControlsHolders.length; i++) {
    const holder = commentControlsHolders[i];
    const li = document.createElement('li');
    li.setAttribute('class', defaultClass);
    li.textContent = collapseLiText;
    li.style.cursor = 'pointer';
    li.style.marginTop = '5px';
    li.style.color = collapseLiColor;
    holder.appendChild(li);
  }

}
