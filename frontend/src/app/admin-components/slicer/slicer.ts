import { CommonModule } from '@angular/common';
import { SlicerItem } from './slicer-item.interface';
import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-slicer',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './slicer.html',
    styleUrl: './slicer.scss',
})
export class Slicer implements OnInit {
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
