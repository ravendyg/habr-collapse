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
    collapse: `${baseClasses.collapse} tm-comment-thread__button`,
    expand: `${baseClasses.expand} tm-comment-thread__button`,
    root: `${baseClasses.root} tm-comment-thread__button`,
    previous: `${baseClasses.previous} tm-comment-thread__button`,
    collapsedComment: 'ext-collapsed',
    contentList: 'content-list',
    comment: 'tm-comment-thread__comment',
    commentLi: 'content-list__item',
    votingSpan: 'voting-wjt__counter',
    postHeader: 'post__meta',
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
  const thread = root.nextElementSibling;
  if (!thread) {
    return;
  }
  thread.setAttribute(commentData, classes.collapsedComment);
  addBtn(root, btnTypes.expand);
  const collapseBtn = root.querySelector('.' + baseClasses.collapse);
  if (collapseBtn) {
    collapseBtn.remove();
  }
}

function expand(el) {
  const root = getWrapping(el, classes.comment);
  if (!root) {
    return;
  }
  const thread = root.nextElementSibling;
  if (!thread) {
    return;
  }
  thread.setAttribute(commentData, '');
  addBtn(root, btnTypes.collapse);
  const expandBtn = root.querySelector('.' + baseClasses.expand);
  if (expandBtn) {
    expandBtn.remove();
  }
}

function showPrevious(elem) {
  try {
    const wrapper = getWrapping(getWrapping(elem, 'tm-comment-thread__children'), 'tm-comment-thread__children');
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

function addBtns(content) {
  const _types = [];

  if (content.children[1]) {
    if (!content.children[1].dataset.extClass) {
      _types.push(btnTypes.collapse);
    } else {
      _types.push(btnTypes.expand);
    }
  }
  _types.push(btnTypes.previous);
  _types.push(btnTypes.root);

  for (const type of _types) {
    addBtn(content, type);
  }
}

/**
 * @param {HTMLDivElement} content
 */
function removeBtns(content) {
  if (!content) return;
  const btns = content.querySelectorAll('.' + classes.btn) || [];
  btns.forEach(btn => btn.remove());
}

/**
 *
 * @param {HTMLDivElement} content
 * @param {string} type
 */
function addBtn(content, type) {
  const btnHolder = content.querySelector('.tm-comment-footer');
  const btn = createBtn(type);
  if (type !== btnTypes.expand && type !== btnTypes.collapse) {
    btn.classList.add(classes.btn);
    btnHolder.appendChild(btn);
  } else {
    const btns = btnHolder.querySelectorAll('.' + classes.btn) || [];
    if (btns[0]) {
      btnHolder.insertBefore(btn, btns[0]);
    } else {
      btnHolder.appendChild(btn);
    }
  }
}

/**
 * @param {string} type
 */
function createBtn(type) {
  const btn = document.createElement('button');

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
  [${commentData}="${classes.collapsedComment}"] {
    display: none;
  }
  `;
  document.querySelector('body').appendChild(st);


  let currentComment;
  window.addEventListener('pointerover', (ee) => {
    const el = ee.target;
    const commentWrapper = getWrapping(el, 'tm-comment-thread');
    if (!commentWrapper || commentWrapper === currentComment) {
      return;
    }

    removeBtns(currentComment);
    currentComment = commentWrapper;

    addBtns(commentWrapper);

    const handleLeave = () => {
      commentWrapper.removeEventListener('pointerleave', handleLeave);
      removeBtns(commentWrapper);
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
  if (el.classList.contains('tm-comment-thread')) {
    // Comment which header was clicked.
    return getRootComment(el.parentElement, el);
  }
  if (el.classList.contains(classes.contentList)) {
    const sib = el.previousElementSibling;
    if (sib.classList.contains('tm-comment-thread')) {
      return getRootComment(el.parentElement, sib);
    }
  }
  return getRootComment(el.parentElement, root);
}
