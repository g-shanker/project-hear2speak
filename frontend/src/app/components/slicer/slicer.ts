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
  slicerWidth: number = 250;
  minimumSlicerWidth: number = 50;

  ngOnInit(): void {
    if (this.items.length > 0) {
      this.selectedItem = this.items[0];
    }
  }

  onSelectItem(item: SlicerItem): void {
    this.selectedItem = item;
  }

  onMouseDown(event: MouseEvent): void {
    event.preventDefault();
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseMove = (event: MouseEvent): void => {
    const newWidth = event.clientX;

    if (newWidth >= this.minimumSlicerWidth) {
      this.slicerWidth = newWidth;
    }
  }

  onMouseUp = (): void => {
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  checkTextVisibility(): boolean {
    return this.slicerWidth > 50;
  }
}
