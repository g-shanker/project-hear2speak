package com.hear2speak.schedulers;

import java.time.LocalDateTime;
import java.util.List;
import org.jboss.logging.Logger;

import com.hear2speak.entities.appointment.AppointmentEntity;
import com.hear2speak.repositories.AppointmentRepository;
import com.hear2speak.services.EmailService;

import io.quarkus.scheduler.Scheduled;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class AppointmentScheduler {

    private static final Logger LOG = Logger.getLogger(AppointmentScheduler.class);

    private static final int ALERT_THRESHOLD = 5;

    private static final int REMINDER_INTERVAL_HOURS = 24;

    private final EmailService emailService;

    private final AppointmentRepository appointmentRepository;

    @Inject
    public AppointmentScheduler(
        EmailService emailService,
        AppointmentRepository appointmentRepository
    ) {
        this.emailService = emailService;
        this.appointmentRepository = appointmentRepository;
    }

    @Scheduled(cron = "0 0 * * * ?")
    @Transactional
    public void checkUnacknowledgedAppointments() {
        LOG.info("--- Scheduler: Checking for unacknowledged appointments ---");
        
        LocalDateTime cutoffTime = LocalDateTime.now().minusHours(REMINDER_INTERVAL_HOURS);
        List<AppointmentEntity> pendingList = appointmentRepository.list(
            "isAcknowledged = ?1 and (lastAlertSentAt is null or lastAlertSentAt < ?2)",
            false, cutoffTime
        );

        int count = pendingList.size();

        if (count < ALERT_THRESHOLD) {
            LOG.infof("-- Scheduler: Found %d actionable pending requests. Below threshold (%d). Skipping. ---", count, ALERT_THRESHOLD);
            return;
        }

        LOG.infof("--- Scheduler: Found %d pending. Sending alert ---", count);

        try {
            emailService.sendClinicianUnacknowledgedAlert(pendingList);
            LOG.info("--- Scheduler: Alert email sent successfully. ---");
        } catch (Exception e) {
            LOG.error("--- Scheduler: Failed to send alert email. Continuing without rolling back. ---", e);
        }

        // Update lastAlertSentAt so we do not resend repeatedly even if the send fails
        LocalDateTime now = LocalDateTime.now();
        for (AppointmentEntity apt : pendingList) {
            apt.lastAlertSentAt = now;
        }
    }
    
}
