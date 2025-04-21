package cit.edu.studyspace.service;

import cit.edu.studyspace.entity.BookingEntity;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.client.util.DateTime;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.CalendarScopes;
import com.google.api.services.calendar.model.*;

import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;



import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.time.ZoneId;
import java.util.Collections;
import java.util.List;

@Service
public class GoogleCalendarService {

    private static final String APPLICATION_NAME = "StudySpace Booking System";
    private static final JsonFactory JSON_FACTORY = JacksonFactory.getDefaultInstance();
    private static final List<String> SCOPES = Collections.singletonList(CalendarScopes.CALENDAR);

    private Calendar getCalendarService() throws Exception {
        final NetHttpTransport HTTP_TRANSPORT = GoogleNetHttpTransport.newTrustedTransport();

        // Using try-with-resources for safe resource handling
        try (InputStream in = new FileInputStream("src/main/resources/credentials.json")) {
            GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(in));

            GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
                    HTTP_TRANSPORT, JSON_FACTORY, clientSecrets, SCOPES)
                    .setDataStoreFactory(new FileDataStoreFactory(new java.io.File("tokens")))
                    .setAccessType("offline")
                    .build();

            com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver receiver = new LocalServerReceiver.Builder().setPort(8081).build();
            Credential credential = new AuthorizationCodeInstalledApp(flow, receiver).authorize("user");

            return new Calendar.Builder(HTTP_TRANSPORT, JSON_FACTORY, credential)
                    .setApplicationName(APPLICATION_NAME)
                    .build();
        }
    }

    public void createCalendarEvent(BookingEntity booking) throws Exception {
        Calendar service = getCalendarService();

        // Use safe null checks in production!
        String roomName = (booking.getSpace() != null) ? booking.getSpace().getName() : "StudySpace Room";
        String location = (booking.getSpace() != null) ? booking.getSpace().getLocation() : "StudySpace";
        String bookedBy = (booking.getUser() != null) ? booking.getUser().getEmail() : "A user";

        Event event = new Event()
                .setSummary("Booking: " + roomName)
                .setLocation(location)
                .setDescription("Booked by: " + bookedBy + "\nPeople: " + booking.getNumberOfPeople());

        // Convert LocalDateTime to DateTime for Google API
        ZoneId zoneId = ZoneId.of("Asia/Manila"); // or your local timezone
        DateTime start = new DateTime(java.util.Date.from(booking.getStartTime().atZone(zoneId).toInstant()));
        DateTime end = new DateTime(java.util.Date.from(booking.getEndTime().atZone(zoneId).toInstant()));

        event.setStart(new EventDateTime().setDateTime(start).setTimeZone(zoneId.toString()));
        event.setEnd(new EventDateTime().setDateTime(end).setTimeZone(zoneId.toString()));

        // Add a reminder
        EventReminder[] reminders = new EventReminder[]{
                new EventReminder().setMethod("email").setMinutes(60),
                new EventReminder().setMethod("popup").setMinutes(30),
        };
        event.setReminders(new Event.Reminders().setUseDefault(false).setOverrides(List.of(reminders)));

        service.events().insert("primary", event).execute();
    }
}
