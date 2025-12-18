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

    // BRAND COLORS
    private static final String COLOR_PRIMARY = "#059669";      // Emerald
    private static final String COLOR_PRIMARY_DARK = "#022c22"; // Deep Forest
    private static final String COLOR_BG = "#EEF2F6";           // Slate 50
    private static final String COLOR_TEXT = "#334155";         // Slate 700

    @Inject
    public EmailService(ReactiveMailer reactiveMailer) {
        this.reactiveMailer = reactiveMailer;
    }

    public Uni<Void> sendRequestReceivedMail(AppointmentEntity appointmentEntity) {
        String subject = "Request Received - Hear2Speak";
        String dateString = appointmentEntity.startDateTime.format(DATE_FORMAT);
        String timeString = appointmentEntity.startDateTime.format(TIME_FORMAT);

        String bodyContent = getRequestReceivedBody(appointmentEntity, dateString, timeString);
        String htmlBody = wrapHtmlTemplate("Request Received", bodyContent);

        return reactiveMailer.send(
            Mail.withHtml(appointmentEntity.patientEmail, subject, htmlBody)
        );
    }

    public Uni<Void> sendAppointmentConfirmedMail(AppointmentEntity appointmentEntity) {
        String subject = "Appointment Confirmed - Hear2Speak";
        String dateString = appointmentEntity.startDateTime.format(DATE_FORMAT);
        String timeString = appointmentEntity.startDateTime.format(TIME_FORMAT);

        String bodyContent = getAppointmentConfirmedBody(appointmentEntity, dateString, timeString);
        String htmlBody = wrapHtmlTemplate("Appointment Confirmed", bodyContent);

        return reactiveMailer.send(
            Mail.withHtml(appointmentEntity.patientEmail, subject, htmlBody)
        );
    }

    /**
     * SHARED WRAPPER: Handles the outer shell (Header, Footer, Container, CSS)
     */
    private String wrapHtmlTemplate(String title, String content) {
        return """
            <!DOCTYPE html>
            <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Montserrat:wght@600;700;800&display=swap" rel="stylesheet">
                <style>
                    /* CLIENT-SPECIFIC RESETS */
                    body, table, td, a { -webkit-text-size-adjust: 100%%; -ms-text-size-adjust: 100%%; }
                    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
                    img { -ms-interpolation-mode: bicubic; }
                    
                    /* TYPOGRAPHY & COLORS */
                    body { 
                        margin: 0; padding: 0; 
                        background-color: %s; 
                        font-family: 'DM Sans', 'Helvetica', 'Arial', sans-serif; 
                        color: %s;
                    }
                    h1, h2, h3 { 
                        font-family: 'Montserrat', 'Helvetica', 'Arial', sans-serif; 
                        color: %s;
                    }
                    .btn-cta {
                        background-color: %s; color: #ffffff; 
                        padding: 12px 24px; border-radius: 50px; 
                        text-decoration: none; font-weight: bold; display: inline-block;
                    }
                </style>
            </head>
            <body style="margin:0; padding:0; background-color:%s;">
                
                <table role="presentation" width="100%%" border="0" cellspacing="0" cellpadding="0" style="background-color:%s;">
                    <tr>
                        <td align="center" style="padding: 40px 10px;">
                        
                            <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" 
                                style="background-color:#ffffff; border-radius:24px; overflow:hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
                                
                                <tr>
                                    <td style="padding: 30px 40px; border-bottom: 1px solid #f0f0f0;">
                                        <table role="presentation" border="0" cellspacing="0" cellpadding="0">
                                            <tr>
                                                <td valign="middle">
                                                    <span style="display:block; font-family:'Montserrat', sans-serif; font-size:24px; font-weight:800; color:%s; letter-spacing:-0.03em; line-height:1;">
                                                        Hear2Speak
                                                    </span>
                                                    <span style="display:block; font-family:'DM Sans', sans-serif; font-size:10px; font-weight:700; text-transform:uppercase; color:%s; opacity:0.8; letter-spacing:0.05em; margin-top:4px;">
                                                        Centre for Hearing, Speech, and Vestibular Rehabilitation
                                                    </span>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>

                                <tr>
                                    <td style="padding: 40px;">
                                        %s
                                    </td>
                                </tr>

                                <tr>
                                    <td style="background-color: #1a1a1a; padding: 30px; text-align: center;">
                                        <p style="margin:0 0 10px 0; color:#ffffff; font-family:'Montserrat', sans-serif; font-weight:700; font-size:16px;">Hear2Speak Balance Clinic</p>
                                        <p style="margin:0; color:#94A3B8; font-size:12px; line-height:1.5;">
                                            Bengaluru's premier center for integrated hearing, speech, and balance care.
                                        </p>
                                        <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #333333; color:#64748B; font-size:11px;">
                                            &copy; 2025 Hear2Speak. All rights reserved.<br>
                                        </div>
                                    </td>
                                </tr>
                            </table>
                            
                            <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0">
                                <tr><td height="40">&nbsp;</td></tr>
                            </table>

                        </td>
                    </tr>
                </table>
            </body>
            </html>
            """.formatted(
                COLOR_BG, COLOR_TEXT, COLOR_PRIMARY_DARK, COLOR_PRIMARY, // CSS Block
                COLOR_BG, COLOR_BG, // Body & Outer Table
                COLOR_PRIMARY_DARK, // Logo Main Title
                COLOR_PRIMARY_DARK, // Logo Subtext (New)
                content // Body Content
            );
    }

    private String getRequestReceivedBody(AppointmentEntity apt, String date, String time) {
        return """
            <h2 style="margin-top:0; color:%s; font-size:24px;">Request Received</h2>
            <p style="font-size:16px; line-height:1.6;">Hello <strong>%s</strong>,</p>
            <p style="font-size:16px; line-height:1.6;">We have received your appointment request. Our team is currently reviewing the schedule to confirm availability.</p>

            <div style="background-color:#F8FAFC; border:1px solid #CBD5E1; border-radius:12px; padding:25px; margin:25px 0;">
                <p style="margin:0 0 15px 0; font-size:12px; text-transform:uppercase; color:#64748B; font-weight:bold; letter-spacing:0.05em;">Request Details</p>
                
                <table width="100%%" border="0" cellspacing="0" cellpadding="0">
                    <tr>
                        <td style="padding-bottom:8px; color:#334155;"><strong>Date:</strong></td>
                        <td style="padding-bottom:8px; color:#334155; text-align:right;">%s</td>
                    </tr>
                    <tr>
                        <td style="padding-bottom:8px; color:#334155;"><strong>Time:</strong></td>
                        <td style="padding-bottom:8px; color:#334155; text-align:right;">%s</td>
                    </tr>
                    <tr>
                        <td style="padding-bottom:8px; color:#334155;"><strong>Phone:</strong></td>
                        <td style="padding-bottom:8px; color:#334155; text-align:right;">%s</td>
                    </tr>
                </table>
                
                <div style="border-top:1px solid #E2E8F0; margin:15px 0; padding-top:15px;">
                    <span style="font-size:14px; color:#64748B;">Reason for visit:</span><br>
                    <span style="color:#022c22; font-style:italic;">"%s"</span>
                </div>
            </div>

            <p style="font-size:16px; line-height:1.6;">We will send a confirmation email shortly. If you need to make changes immediately, please call us:</p>
            
            <p style="font-size:18px; color:%s; font-weight:700; margin-top:10px;">
                %s &nbsp;<span style="color:#CBD5E1">|</span>&nbsp; %s
            </p>
            """.formatted(
                COLOR_PRIMARY_DARK,
                apt.patientFullName,
                date, time, apt.patientPhoneNumber, apt.patientReason,
                COLOR_PRIMARY_DARK,
                PHONE_1, PHONE_2
            );
    }

    private String getAppointmentConfirmedBody(AppointmentEntity apt, String date, String time) {
        return """
            <h2 style="margin-top:0; color:%s; font-size:24px;">Appointment Confirmed</h2>
            
            <p style="font-size:16px; line-height:1.6;">Hello <strong>%s</strong>,</p>
            <p style="font-size:16px; line-height:1.6;">Your appointment has been officially scheduled. We look forward to seeing you at the clinic.</p>

            <div style="background-color:#F0FDF4; border-left:5px solid %s; border-radius:4px; padding:25px; margin:25px 0;">
                <p style="margin:0 0 5px 0; font-size:20px; color:%s; font-weight:bold;">%s</p>
                <p style="margin:0 0 15px 0; font-size:20px; color:%s; font-weight:bold;">%s</p>
                
                <p style="margin:0; font-size:14px; color:#334155; display:flex; align-items:center;">
                    <strong>Location:</strong>&nbsp; Hear2Speak Clinic, Bengaluru
                </p>
            </div>

            <p style="font-size:15px; color:#64748B; margin-bottom: 30px;">
                <em>Please arrive 10 minutes prior to your scheduled time to complete any necessary paperwork.</em>
            </p>

            <div style="text-align:center; margin: 35px 0;">
                <a href="https://hear2speakbalance.clinic/#contact" class="btn-cta" style="color:#ffffff;">Get Directions</a>
            </div>

            <p style="font-size:14px; color:#64748B; border-top:1px solid #f0f0f0; padding-top:20px;">
                <strong>Need to reschedule?</strong><br>
                Contact us at <strong>%s</strong> or <strong>%s</strong>.
            </p>
            """.formatted(
                COLOR_PRIMARY,
                apt.patientFullName,
                COLOR_PRIMARY,
                COLOR_PRIMARY_DARK, date,
                COLOR_PRIMARY, time,
                PHONE_1, PHONE_2
            );
    }
}