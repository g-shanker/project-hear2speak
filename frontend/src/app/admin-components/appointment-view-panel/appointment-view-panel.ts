import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AppointmentResponse } from '../../interfaces/appointment-response';

@Component({
    selector: 'app-appointment-view-panel',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './appointment-view-panel.html',
    styleUrl: './appointment-view-panel.scss',
})

export class AppointmentViewPanel {
    @Input() appointment: AppointmentResponse | null = null;
    editMode: boolean = false;

    toggleEditMode() {
        this.editMode = !this.editMode;
    }
}


// export class AppointmentViewPanel {

//   @Input() appointment: AppointmentResponse | null = null;
//   appointmentForm: FormGroup;
//   editMode: boolean = false;

//   constructor(
//     private fb: FormBuilder,
//     private appointmentService: AppointmentService
//   ) {
//     this.appointmentForm = this.fb.group({
//       patientFullName: ['', Validators.required],
//     });
//   }

//   ngOnChanges(changes: SimpleChanges): void {
//     if(changes['appointment'] && this.appointment != null) {
//       this.appointmentForm.patchValue(this.appointment);
//     }
//   }

//   onSubmit(): void {
//     console.log('submitted.')
//   }

//   toggleEditMode() {
//     this.editMode = !this.editMode;
//   }

//   saveEdits() {
//     console.log('Saving edits:', this.appointment);
//     this.editMode = false;
//   }

//   cancelEdit() {
//     console.log('Cancelling edits:', this.appointment);
//     this.editMode = false;
//   }

// }
