// @ts-check
'use strict';

const
  btnTypes = {
    collapse: 'collapse',
    expand: 'expand',
    root: 'root',
    previous: 'previous',
  },
  baseClasses = {
    collapse: 'collapse-control',
    expand: 'expand-control',
    root: 'show-root-control',
    previous: 'previous-control',
  },
  classes = {
    btn: 'ext-btn',
    tmpBtn: 'ext-btn-tmp',
    collapse: `${baseClasses.collapse} inline-list__item inline-list__item_comment-nav js-comment_children`,
    expand: `${baseClasses.expand} inline-list__item inline-list__item_comment-nav js-comment_children`,
    root: `${baseClasses.root} inline-list__item inline-list__item_comment-nav js-comment_children`,
    previous: `${baseClasses.previous} inline-list__item inline-list__item_comment-nav js-comment_children`,
    collapsedComment: 'ext-collapsed',
    contentList: 'content-list',
    comment: 'comment',
    commentLi: 'content-list__item',
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
  },
  commentData = 'data-ext-class'
  ;

if (['habrahabr.ru', 'geektimes.ru', 'habr.com', 'geektimes.com'].indexOf(location.host) !== -1) {
  init();
  document.addEventListener('click', clickHandler);
}


function clickHandler(ev) {
  const elem = ev.target;
  if (!elem) return;

  if (elem.classList.contains(baseClasses.collapse)) {
    collapse(elem);
  } else if (elem.classList.contains(baseClasses.expand)) {
    expand(elem);
  } else if (elem.classList.contains(baseClasses.root)) {
    showRoot(elem);
  } else if (elem.classList.contains(baseClasses.previous)) {
    showPrevious(elem);
  }
}

function collapse(el) {
  const root = getWrapping(el, classes.comment);
  if (!root) {
    return;
  }
  root.setAttribute(commentData, classes.collapsedComment);
  addBtn(root, btnTypes.expand);
}

function expand(el) {
  const root = getWrapping(el, classes.comment);
  if (!root) {
    return;
  }
  root.setAttribute(commentData, '');
  const expandBtn = root.querySelector('.' + baseClasses.expand);
  if (expandBtn) {
    expandBtn.remove();
  }
}

function showPrevious(elem) {
  try {
    const wrapper = getWrapping(elem, classes.commentLi);
    scrollToWithHeader(wrapper.previousElementSibling);
  } catch {}
}

function showRoot(el) {
  const root = getRootComment(el, null);
  scrollToWithHeader(root);
}

function scrollToWithHeader(el) {
  try {
    const { top } = el.getBoundingClientRect();
    const newTop = top + window.pageYOffset - 75;
    window.scrollTo({
      top: newTop,
      behavior: 'smooth',
    });
  } catch { }
}

/**
 * @param {HTMLDivElement} content
 */
function addTmpBtns(content) {
  const _types = [];

  if (!content.classList.contains(classes.collapsedComment)) {
    _types.push(btnTypes.collapse);
  }
  _types.push(btnTypes.previous);
  _types.push(btnTypes.root);

  for (const type of _types) {
    addBtn(content, type);
  }
}

/**
 *
 * @param {HTMLDivElement} content
 * @param {string} type
 */
function addBtn(content, type) {
  const btnHolder = content.querySelector('.inline-list.inline-list_comment-nav');
  const btn = createBtn(type);
  if (type !== btnTypes.expand) {
    btn.classList.add(classes.tmpBtn);
    btnHolder.appendChild(btn);
  } else {
    const tmpBtns = btnHolder.querySelectorAll('.' + classes.tmpBtn) || [];
    if (tmpBtns[0]) {
      btnHolder.insertBefore(btn, tmpBtns[0]);
    } else {
      btnHolder.appendChild(btn);
    }
  }
}

/**
 * @param {string} type
 */
function createBtn(type) {
  const btn = document.createElement('li');

  btn.setAttribute('class', classes[type]);
  btn.classList.add(classes.btn);
  btn.textContent = texts[type];
  btn.style.color = colors[type];
  btn.style.cursor = 'pointer';
  btn.style.marginTop = '5px';

  return btn;
}

function init() {
  const st = document.createElement('style');
  st.innerHTML = `
  .comment .${baseClasses.expand} {
    display: none;
  }
  .comment .${baseClasses.collapse} {
    display: list-item;
  }
  [${commentData}="${classes.collapsedComment}"] .${baseClasses.expand} {
    display: list-item;
  }
  [${commentData}="${classes.collapsedComment}"] .${baseClasses.collapse} {
    display: none;
  }
  [${commentData}="${classes.collapsedComment}"] + ul {
    display: none;
  }
  `;
  document.querySelector('.layout').appendChild(st);


  let currentComment;
  window.addEventListener('pointerover', (ee) => {
    const el = ee.target;
    const commentWrapper = getWrapping(el, classes.comment);
    if (!commentWrapper || commentWrapper === currentComment) {
      return;
    }

    currentComment = commentWrapper;

    addTmpBtns(commentWrapper);

    const handleLeave = () => {
      commentWrapper.removeEventListener('pointerleave', handleLeave);
      const btns = commentWrapper.querySelectorAll('.' + classes.tmpBtn) || [];
      btns.forEach(btn => btn.remove());
      currentComment = null;
    };
    commentWrapper.addEventListener('pointerleave', handleLeave);
  }, true);
}

function getWrapping(el, klass) {
  if (!el || !el.classList) {
    return el;
  }
  if (el.classList.contains(klass)) {
    return el;
  }
  return getWrapping(el.parentElement, klass);
}

function getRootComment(el, root) {
  if (!el || !el.classList) {
    return root;
  }
  if (el.classList.contains(classes.comment)) {
    // Comment which header was clicked.
    return getRootComment(el.parentElement, el);
  }
  if (el.classList.contains(classes.contentList)) {
    const sib = el.previousElementSibling;
    if (sib.classList.contains(classes.comment)) {
      return getRootComment(el.parentElement, sib);
    }
  }
  return getRootComment(el.parentElement, root);
}
