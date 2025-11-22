import { NgComponentOutlet } from '@angular/common';
import { SlicerItem } from './slicer-item.interface';
import { Component, input, OnInit, signal } from '@angular/core';

@Component({
    selector: 'app-slicer',
    standalone: true,
    imports: [NgComponentOutlet],
    templateUrl: './slicer.html',
    styleUrls: ['./slicer.scss'],
})

export class Slicer implements OnInit {
    items = input.required<SlicerItem[]>();
    selectedItem = signal<SlicerItem | null>(null);

    ngOnInit(): void {
        if (this.items().length > 0) {
            this.selectedItem.set(this.items()[0]);
        }
    }

    onItemClick(item: SlicerItem): void {
        this.selectedItem.set(item);
    }
}
