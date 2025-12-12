import { Identifiable } from './identifiable';
import { CommonModule } from '@angular/common';
import { Component, input, output, TemplateRef } from '@angular/core';

@Component({
    selector: 'app-summary-list',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './summary-list.html',
    styleUrls: ['./summary-list.scss'],
})

export class SummaryList<T extends Identifiable> {
    items = input.required<T[]>();
    selectedItem = input<T | null>(null);
    itemTemplate = input.required<TemplateRef<any>>();
    select = output<T>();
}
