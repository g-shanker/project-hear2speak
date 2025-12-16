package com.hear2speak.services;

import java.time.format.DateTimeFormatter;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import com.hear2speak.entities.appointment.AppointmentEntity;

import io.quarkus.mailer.Mail;
import io.quarkus.mailer.reactive.ReactiveMailer;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
public class EmailService {

    @ConfigProperty(name = "app.constants.mailer.contact.phone_1")
    String PHONE_1;

    @ConfigProperty(name = "app.constants.mailer.contact.phone_2")
    String PHONE_2;
    
    private final ReactiveMailer reactiveMailer;

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("EEEE, d MMMM yyyy");
    private static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("h:mm a");

    @Inject
    public EmailService(ReactiveMailer reactiveMailer) {
        this.reactiveMailer = reactiveMailer;
    }

    public Uni<Void> sendRequestReceivedMail(AppointmentEntity appointmentEntity) {
        String subject = "Request Received - Hear2Speak";

        String dateString = appointmentEntity.startDateTime.format(DATE_FORMAT);
        String timeString = appointmentEntity.startDateTime.format(TIME_FORMAT);

        String htmlBody = getRequestReceivedTemplate(appointmentEntity, dateString, timeString);

        return reactiveMailer.send(
            Mail.withHtml(appointmentEntity.patientEmail, subject, htmlBody)
        );
    }

    public Uni<Void> sendAppointmentConfirmedMail(AppointmentEntity appointmentEntity) {
        String subject = "Appointment Confirmed - Hear2Speak";

        String dateString = appointmentEntity.startDateTime.format(DATE_FORMAT);
        String timeString = appointmentEntity.startDateTime.format(TIME_FORMAT);

        String htmlBody = getAppointmentConfirmedTemplate(appointmentEntity, dateString, timeString);

        return reactiveMailer.send(
            Mail.withHtml(appointmentEntity.patientEmail, subject, htmlBody)
        );
    }

    private String getRequestReceivedTemplate(AppointmentEntity apt, String date, String time) {
        return """
            <!DOCTYPE html>
            <html>
            <head><style>%s</style></head>
            <body style="margin:0; padding:0; background-color:#EEF2F6; font-family:'Helvetica', sans-serif;">
                <table role="presentation" width="100%%" style="background-color:#EEF2F6;"><tr><td align="center" style="padding:40px 0;">
                    
                    <table width="600" style="background-color:#ffffff; border-radius:24px; overflow:hidden;">
                        <tr><td style="padding:25px 30px; border-bottom:1px solid #f0f0f0; background:#fcfcfc;">
                             <h2 style="color:#022c22; margin:0;">Hear2Speak</h2>
                        </td></tr>

                        <tr><td style="padding:40px 30px; color:#334155;">
                            <h2 style="color:#022c22; margin-top:0;">Request Received</h2>
                            <p>Hello <strong>%s</strong>,</p>
                            <p>We have received your request for an appointment. Our team is currently reviewing our schedule.</p>

                            <div style="background-color:#F8FAFC; border:1px solid #E2E8F0; border-radius:12px; padding:20px; margin:20px 0;">
                                <p style="margin:0 0 10px 0; font-size:12px; text-transform:uppercase; color:#64748B; font-weight:bold;">Request Summary</p>
                                <p style="margin:5px 0;"><strong>Date:</strong> %s</p>
                                <p style="margin:5px 0;"><strong>Time:</strong> %s</p>
                                <p style="margin:5px 0;"><strong>Phone:</strong> %s</p>
                                <hr style="border:0; border-top:1px solid #E2E8F0; margin:15px 0;">
                                <p style="margin:5px 0; color:#64748B; font-size:14px;"><strong>Reason:</strong> <em>"%s"</em></p>
                            </div>

                            <p style="color:#B91C1C; font-weight:bold; font-size:14px;">
                                ⚠ Is any of this information incorrect?
                            </p>
                            <p>If you need to change your request or correct your details, please <strong>call us</strong> at:</p>
                            <p style="font-size:16px; color:#022c22; font-weight:700;">
                                %s &nbsp;|&nbsp; %s
                            </p>

                            <br>
                            <div style="background-color:#FFF1F2; border-left:4px solid #E11D48; padding:15px; font-size:13px; color:#881337;">
                                <strong>Note:</strong> This email is automatically generated and the inbox is <strong>not monitored</strong>. Please do not reply to this email as we will not see your message.
                            </div>

                        </td></tr>
                        
                        <tr><td style="background-color:#1a1a1a; padding:20px; text-align:center; color:#94A3B8; font-size:12px;">
                            &copy; 2025 Hear2Speak Balance Clinic
                        </td></tr>
                    </table>

                </td></tr></table>
            </body></html>
            """.formatted(CSS_STYLES, apt.patientFullName, date, time, apt.patientPhoneNumber, apt.patientReason, PHONE_1, PHONE_2);
    }

    private String getAppointmentConfirmedTemplate(AppointmentEntity apt, String date, String time) {
        return """
            <!DOCTYPE html>
            <html>
            <head><style>%s</style></head>
            <body style="margin:0; padding:0; background-color:#EEF2F6; font-family:'Helvetica', sans-serif;">
                <table role="presentation" width="100%%" style="background-color:#EEF2F6;"><tr><td align="center" style="padding:40px 0;">
                    
                    <table width="600" style="background-color:#ffffff; border-radius:24px; overflow:hidden; border-top: 6px solid #059669;">
                        <tr><td style="padding:25px 30px; border-bottom:1px solid #f0f0f0;">
                             <h2 style="color:#022c22; margin:0;">Hear2Speak</h2>
                        </td></tr>

                        <tr><td style="padding:40px 30px; color:#334155;">
                            <h2 style="color:#059669; margin-top:0;">Appointment Confirmed</h2>
                            <p>Hello <strong>%s</strong>,</p>
                            
                            <p>Your appointment has been officially scheduled. 
                            <span style="color:#64748B; font-size: 14px;">(If you contacted us directly by phone, this email serves as your booking confirmation).</span></p>

                            <div style="background-color:#F0FDF4; border-left:4px solid #059669; padding:20px; margin:20px 0;">
                                <p style="margin:5px 0; font-size:18px; color:#022c22;"><strong>%s</strong></p>
                                <p style="margin:5px 0; font-size:18px; color:#059669;"><strong>%s</strong></p>
                                <p style="margin:15px 0 5px 0; font-size:14px; color:#334155;"><strong>Location:</strong> Hear2Speak Clinic, Bengaluru</p>
                            </div>

                            <p>Please arrive 10 minutes early.</p>

                            <p style="margin-top:30px;"><strong>Need to reschedule?</strong></p>
                            <p>Please do not reply to this email. Instead, contact us at:</p>
                            <p style="font-size:16px; color:#022c22; font-weight:700;">
                                %s &nbsp;|&nbsp; %s
                            </p>

                            <br>
                            <p style="font-size:12px; color:#94A3B8; text-align:center; margin-top:20px; border-top:1px solid #eee; padding-top:10px;">
                                This is an automated message. <strong>Replies to this email are not monitored.</strong>
                            </p>

                        </td></tr>
                        
                        <tr><td style="background-color:#1a1a1a; padding:20px; text-align:center; color:#94A3B8; font-size:12px;">
                            &copy; 2025 Hear2Speak Balance Clinic
                        </td></tr>
                    </table>

                </td></tr></table>
            </body></html>
            """.formatted(CSS_STYLES, apt.patientFullName, date, time, PHONE_1, PHONE_2);
    }

    private static final String CSS_STYLES = "/* Add responsive CSS here if needed */";

}
