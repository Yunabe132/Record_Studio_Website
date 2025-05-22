import { displayItems } from './displayMethods';
import { SectionModel, SectionItem } from '../models/SectionModel';

export class View {
  constructor(private container:HTMLElement) {}

  public render(section:string, model:SectionModel) {
    const items = model.getItems(section);
    this.container.className = 'section-grid';
    displayItems(this.container, items);
  }
}