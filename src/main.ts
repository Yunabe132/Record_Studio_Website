//import { initComponents } from './components/initComponents';
import { SectionModel } from './models/SectionModel';
import { View } from './views/View';
import { AppController } from './controllers/AppController';

document.addEventListener('DOMContentLoaded', () => {
  //initComponents();
  const model = new SectionModel();
  const view = new View(document.getElementById('app')!);
  const controller = new AppController(model, view);
  controller.init();
});