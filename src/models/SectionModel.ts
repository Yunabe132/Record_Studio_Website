export interface SectionItem { title:string; url:string; type:'art'|'animation'|'page'|'game'; }

export class SectionModel {
  private data: Record<string, SectionItem[]> = {
    art: [ /* load from assets/art */ ],
    animations: [ /* assets/animations */ ],
    webtoon: [ /* assets/webtoon */ ],
    games: [ /* static URLs or thumbnails */ ],
  };

  public getItems(section:string): SectionItem[] {
    return this.data[section] || [];
  }
}