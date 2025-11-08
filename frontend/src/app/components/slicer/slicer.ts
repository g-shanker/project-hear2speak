import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { SlicerItem } from './slicer-item.interface';

@Component({
  selector: 'app-slicer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slicer.html',
  styleUrl: './slicer.scss',
})
export class Slicer {
  @Input() items: SlicerItem[] = [];
  selectedItem: SlicerItem | null = null;

  ngOnInit(): void {
    if (this.items.length > 0) {
      this.selectedItem = this.items[0];
    }
  }

  onSelectItem(item: SlicerItem): void {
    this.selectedItem = item;
  }
}
