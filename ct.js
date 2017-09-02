'use strict';

const
  collapseBaseClass = 'collapse-control',
  showRootBaseClass = 'show-root-control',
  collapseRegexp = new RegExp(collapseBaseClass),
  showRootRegexp = new RegExp(showRootBaseClass),
  collapsedRegexp = /collapsed/,
  toggleCollapsedDefaultClass = `${collapseBaseClass} inline-list__item inline-list__item_comment-nav js-comment_children`,
  showRootClass = `${showRootBaseClass} inline-list__item inline-list__item_comment-nav js-comment_children`,
  commentSectionClass = 'comments-section',
  collapseLiColor = 'red',
  expandLiColor = 'green',
  collapseLiText = 'Collapse',
  expandLiText = 'Expand',
  showRootText = 'Root',
  showRoorColor = 'blue'
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
    toggleCollapsed(elem, klass);
  } else if (showRootRegexp.test(klass)) {
    showRoot(elem);
  }

}

/**
 * @param {HTMLElement} elem
 * @param {string} klass
 */
function toggleCollapsed(elem, klass) {
  const root = elem.parentElement.parentElement.parentElement;
  const list = root.nextElementSibling;
  let newClass, display, text, color;

  if (!collapsedRegexp.test(klass)) {
    newClass = toggleCollapsedDefaultClass + 'collapsed';
    display = 'none';
    text = expandLiText;
    color = expandLiColor;
  } else {
    newClass = toggleCollapsedDefaultClass;
    display = '';
    text = collapseLiText;
    color = collapseLiColor;
  }

  elem.setAttribute('class', newClass);
  list.style.display = display;
  elem.textContent = text;
  elem.style.color = color;
}

/**
 * @param {HTMLElement} elem
 */
function showRoot(elem) {
  let target;
  while (elem) {
    elem = elem.parentElement || null;
    if (elem && elem.tagName === 'LI') {
      target = elem;
    } else if (elem && elem.getAttribute('class') === commentSectionClass) {
      elem = null;
    }
  }
  target && target.scrollIntoView(true);
}

/**
 * somewhat cpu intensive
 */
function addButtons() {

  const commentControlsHolders = document.querySelectorAll('.inline-list.inline-list_comment-nav') || [];

  for (let i = 0; i < commentControlsHolders.length; i++) {
    const holder = commentControlsHolders[i];

    const toggleCollapsedBtn = document.createElement('li');
    toggleCollapsedBtn.setAttribute('class', toggleCollapsedDefaultClass);
    toggleCollapsedBtn.textContent = collapseLiText;
    toggleCollapsedBtn.style.cursor = 'pointer';
    toggleCollapsedBtn.style.marginTop = '5px';
    toggleCollapsedBtn.style.color = collapseLiColor;

    const showRootBtn = document.createElement('li');
    showRootBtn.setAttribute('class', showRootClass);
    showRootBtn.textContent = showRootText;
    showRootBtn.style.cursor = 'pointer';
    showRootBtn.style.marginTop = '5px';
    showRootBtn.style.color = showRoorColor;

    holder.appendChild(toggleCollapsedBtn);
    holder.appendChild(showRootBtn);
  }

}
