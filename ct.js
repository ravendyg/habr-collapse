'use strict';

const
  btnTypes = ['collapse', 'root', 'previous'],
  baseClasses = {
    collapse: 'collapse-control',
    root: 'show-root-control',
    previous: 'previous-control',
  },
  classes = {
    collapse: `${baseClasses.collapse} inline-list__item inline-list__item_comment-nav js-comment_children`,
    root: `${baseClasses.root} inline-list__item inline-list__item_comment-nav js-comment_children`,
    previous: `${baseClasses.previous} inline-list__item inline-list__item_comment-nav js-comment_children`,
    comment: 'comments-section',
  },
  regexps = {
    collapse: new RegExp(baseClasses.collapse),
    root: new RegExp(baseClasses.root),
    previous: new RegExp(baseClasses.previous),
    collapsed: /collapsed/,
  },
  colors = {
    collapse: 'red',
    expand: 'green',
    root: 'darkblue',
    previous: 'blue'
  },
  texts = {
    collapse: 'Collapse',
    expand: 'Expand',
    previous: 'Previous',
    root: 'Root'
  }
  ;

if (['habrahabr.ru', 'geektimes.ru', 'habr.com', 'geektimes.com'].indexOf(location.host) !==  -1) {
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

  if (regexps.collapse.test(klass)) {
    toggleCollapsed(elem, klass);
  } else if (regexps.root.test(klass)) {
    showRoot(elem);
  } else if (regexps.previous.test(klass)) {
    showPrevious(elem);
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

  if (!regexps.collapsed.test(klass)) {
    newClass = classes.collapse + 'collapsed';
    display = 'none';
    text = texts.expand;
    color = colors.expand;
  } else {
    newClass = classes.collapse;
    display = '';
    text = texts.collapse;
    color = colors.collapse;
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
    } else if (elem && elem.getAttribute('class') === classes.comment) {
      elem = null;
    }
  }
  target && target.scrollIntoView(true);
}

/**
 * @param {HTMLElement} elem
 */
function showPrevious(elem) {
  try {
    const wrapper = elem.parentElement.parentElement.parentElement.parentElement;
    const target = wrapper.previousElementSibling;
    target && target.scrollIntoView(true);
  } catch (err) {
    console.error(err);
  }
}

/**
 * @param {string} type
 */
function createBtn(type) {
  const btn = document.createElement('li');
  btn.setAttribute('class', classes[type]);
  btn.textContent = texts[type];
  btn.style.cursor = 'pointer';
  btn.style.marginTop = '5px';
  btn.style.color = colors[type];

  return btn;
}

/**
 * somewhat cpu intensive
 */
function addButtons() {

  const commentControlsHolders = [...document.querySelectorAll('.inline-list.inline-list_comment-nav')];

  for (let i = 0; i < commentControlsHolders.length; i++) {
    const holder = commentControlsHolders[i];

    for (let type of btnTypes) {
      const btn = createBtn(type);
      holder.appendChild(btn);
    }
  }

}
