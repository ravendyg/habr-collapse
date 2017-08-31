'use strict';

const
  collapseRegexp = /collapse-control/,
  collapsedRegexp = /collapsed/,
  defaultClass = 'collapse-control inline-list__item inline-list__item_comment-nav js-comment_children'
  ;

if (['habrahabr.ru', 'geektimes.ru'].indexOf(location.host) !==  1) {
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
  const list = elem.parent;
console.log(list)

  if (collapseRegexp.test(klass)) {
    let newClass, visibility;
    if (!collapsedRegexp.test(klass)) {
      newClass = defaultClass + 'collapsed';
      visibility = 'hidden';
    } else {
      newClass = defaultClass;
      visibility = 'visible';
    }
    elem.setAttribute('class', newClass);


  }
}

function addButtons() {
  const commentControlsHolders = document.querySelectorAll('.inline-list.inline-list_comment-nav') || [];
  for (let i = 0; i < commentControlsHolders.length; i++) {
    const holder = commentControlsHolders[i];
    const li = document.createElement('li');
    li.setAttribute('class', defaultClass);
    li.textContent = 'Collapse';
    li.style.cursor = 'pointer';
    li.style.marginTop = '5px';
    holder.appendChild(li);
  }
}
