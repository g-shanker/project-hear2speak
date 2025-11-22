import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Component, input, output, signal } from '@angular/core';

@Component({
    selector: 'app-search-bar',
    standalone: true,
    imports: [ReactiveFormsModule],
    templateUrl: './search-bar.html',
    styleUrls: ['./search-bar.scss'],
})

export class SearchBar {
    searchForm = input.required<FormGroup>();
    placeholder = input<string>('Search...')

    search = output<void>();

    advancedSearch = signal(false);

    toggleAdvancedSearch(): void {
        this.advancedSearch.update(val => !val);
    }
}
