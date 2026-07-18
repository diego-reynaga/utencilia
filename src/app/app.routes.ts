import { Routes } from '@angular/router';
import { Inicio } from './inicio/inicio';
import { Categorias } from './categorias/categorias';
import { Productos } from './productos/productos';
import { Beneficios } from './beneficios/beneficios';
import { Contacto } from './contacto/contacto';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: Inicio },
  { path: 'categorias', component: Categorias },
  { path: 'productos', component: Productos },
  { path: 'beneficios', component: Beneficios },
  { path: 'contacto', component: Contacto }
];
