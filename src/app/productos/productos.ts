import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-productos',
  imports: [CommonModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {
  activeFilter = 'todos';
  visibleCount = 8;

  private readonly products = [
    { id: 1, category: 'cocina' },
    { id: 2, category: 'cocina' },
    { id: 3, category: 'mesa' },
    { id: 4, category: 'mesa' },
    { id: 5, category: 'cubiertos' },
    { id: 6, category: 'cocina' },
    { id: 7, category: 'organizacion' },
    { id: 8, category: 'restaurante' },
  ];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['filter']) {
        this.filterProducts(params['filter']);
      } else {
        this.filterProducts('todos');
      }
    });
  }

  filterProducts(category: string): void {
    this.activeFilter = category;
    this.visibleCount = this.products.filter(
      p => category === 'todos' || p.category === category
    ).length;
  }

  isVisible(productCategory: string): boolean {
    return this.activeFilter === 'todos' || this.activeFilter === productCategory;
  }
}
