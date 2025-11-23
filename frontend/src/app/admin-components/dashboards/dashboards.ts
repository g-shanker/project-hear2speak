import { Component, computed, inject } from '@angular/core';
import { StatCard } from '../../generic-components/stat-card/stat-card';
import { BaseChartDirective } from 'ng2-charts';
import { AppointmentService } from '../../services/appointment-service';
import { ChartConfiguration, ChartData } from 'chart.js';
import { format, parseISO } from 'date-fns';

@Component({
    selector: 'app-dashboards',
    standalone: true,
    imports: [ StatCard, BaseChartDirective ],
    templateUrl: './dashboards.html',
    styleUrls: ['./dashboards.scss'],
})
export class Dashboards {
    private appointmentService = inject(AppointmentService);
    appointments = this.appointmentService.searchResults;

    // KPIs

    totalCount = computed(() => this.appointments().length);
    pendingCount = computed(() =>
        this.appointments().filter(a => a.appointmentStatus === 'REQUESTED').length
    );
    billableHours = computed(() => {
        const totalSeconds = this.appointments()
            .filter(a => a.appointmentStatus === 'COMPLETED')
            .reduce((acc, curr) => acc + curr.durationInSeconds, 0);
        return (totalSeconds / 3600).toFixed(1);
    });
    acknowledgmentRate = computed(() => {
        const total = this.appointments().length;
        if (total === 0) return '0%';
        
        const ackCount = this.appointments().filter(a => a.isAcknowledged).length;
        return Math.round((ackCount / total) * 100) + '%';
    });

    // Donut charts

    statusChartData = computed<ChartData<'doughnut'>>(() => {
        const counts: Record<string, number> = {};
        this.appointments().forEach(a => {
            const status = a.appointmentStatus;
            counts[status] = (counts[status] || 0) + 1;
        });

        return {
            labels: Object.keys(counts),
            datasets: [{
                data: Object.values(counts),
                backgroundColor: [
                    '#2196f3', // REQUESTED (Blue)
                    '#4caf50', // COMPLETED (Green)
                    '#f44336', // CANCELED (Red)
                    '#ff9800', // SCHEDULED (Orange)
                    '#9e9e9e', // NO_SHOW (Grey)
                ],
                hoverOffset: 4
            }]
        };
    });

    doughnutOptions: ChartConfiguration['options'] = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right'
            }
        }
    };

    // Volume charts

    volumeChartData = computed<ChartData<'bar'>>(() => {
        const dayMap = new Map<string, number>();
        this.appointments().forEach(a => {
            const date = parseISO(a.startDateTime);
            const key = format(date, 'MMM dd');
            dayMap.set(key, (dayMap.get(key) || 0) + 1);
        });

        const labels = Array.from(dayMap.keys());
        const data = Array.from(dayMap.values());

        return {
            labels: labels,
            datasets: [{
                label: 'Appointments',
                data: data,
                backgroundColor: '#3f51b5',
                borderRadius: 4
            }]
        };
    });

    barOptions: ChartConfiguration['options'] = {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: { 
                beginAtZero: true, 
                ticks: { stepSize: 1 } // Integers only (can't have 0.5 appointments)
            }
        },
        plugins: {
            legend: { display: false } // Hide legend for simple bar charts
        }
    };

    constructor() {
        this.appointmentService.searchAppointments({ 
            sortField: 'createdAt',
            ascending: false,
            globalText: null,
            startDateFrom: null,
            startDateTo: null,
            appointmentStatus: null
        });
    }
}
