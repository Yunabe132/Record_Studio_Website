import { SectionItem } from '../models/SectionModel';

export function displayItems(container:HTMLElement, items:SectionItem[]) {
  container.innerHTML = '';
  items.forEach(item => {
    let el: HTMLElement;
    switch(item.type) {
      case 'art': el = document.createElement('art-item'); break;
      case 'animation': el = document.createElement('animation-item'); break;
      case 'page': el = document.createElement('webtoon-page'); break;
      case 'game': el = document.createElement('game-link'); break;
    }
    el.setAttribute('data-url', item.url);
    el.setAttribute('data-title', item.title);
    container.appendChild(el);
  });
}