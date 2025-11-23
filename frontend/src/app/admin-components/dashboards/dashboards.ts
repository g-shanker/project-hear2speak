import { Component, computed, inject } from '@angular/core';
import { StatCard } from '../../generic-components/stat-card/stat-card';
import { BaseChartDirective } from 'ng2-charts';
import { AppointmentService } from '../../services/appointment-service';
import { ChartConfiguration, ChartData } from 'chart.js';
import { format, getHours, isFuture, isToday, parseISO } from 'date-fns';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'app-dashboards',
    standalone: true,
    imports: [
        StatCard,
        BaseChartDirective,
    ],
    templateUrl: './dashboards.html',
    styleUrls: ['./dashboards.scss'],
})
export class Dashboards {
    private appointmentService = inject(AppointmentService);
    appointments = this.appointmentService.searchResults;

    // KPIs

    totalCount = computed(() => this.appointments().length);

    todayCount = computed(() =>
        this.appointments().filter(a => isToday(parseISO(a.startDateTime))).length
    );

    futureCount = computed(() =>
        this.appointments().filter(a => isFuture(parseISO(a.startDateTime))).length
    );

    cancellationRate = computed(() => {
        const total = this.appointments().length;
        if(total === 0) return '0%';
        const bad = this.appointments().filter(a =>
        ['CANCELED', 'NO_SHOW'].includes(a.appointmentStatus)
        ).length

        return Math.round((bad / total) * 100) + '%';
    });

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

    hourlyChartData = computed<ChartData<'bar'>>(() => {
        const hoursMap = new Map<string, number>();
        for(let i = 9; i <= 17; i ++) {
            hoursMap.set(`${i}:00`, 0);
        }

        this.appointments().forEach(a => {
            const date = parseISO(a.startDateTime);
            const hour = getHours(date);
            if(hour >= 9 && hour <= 17) {
                const key = `${hour}:00`;
                hoursMap.set(key, (hoursMap.get(key) || 0) + 1);
            }
        });

        return {
            labels: Array.from(hoursMap.keys()),
            datasets: [{
                label: 'Appointments',
                data: Array.from(hoursMap.values()),
                backgroundColor: '#9c27b0',
                borderRadius: 4
            }]
        };
    });

    recentAppointments = computed(() => {
        return [...this.appointments()]
            .sort((a, b) => b.id - a.id)
            .slice(0, 5);
    });

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
                    '#3f51b5', // RESCHEDULED (Purple)
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
                ticks: {
                    stepSize: 1
                } // Integers only (can't have 0.5 appointments)
            }
        },
        plugins: {
            legend: {
                display: false
            } // Hide legend for simple bar charts
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
