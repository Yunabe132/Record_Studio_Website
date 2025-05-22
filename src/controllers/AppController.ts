import { SectionModel } from '../models/SectionModel';
import { View } from '../views/View';

export class AppController {
  constructor(private model:SectionModel, private view:View) {}

  public init(): void {
    document.querySelectorAll('nav a').forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault();
        const section = (link as HTMLElement).dataset.section!;
        this.view.render(section, this.model);
      });
    });
    // initial display
    this.view.render('art', this.model);
  }
}