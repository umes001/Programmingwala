// Google Meet helper.
//
// Unlike Zoom, Google Meet has no standalone "create meeting → get join link"
// REST API. Meet links are produced in one of two ways:
//
//   1. MANUAL: an organiser creates a Meet in Google Calendar / Meet and pastes
//      the https://meet.google.com/xxx link when scheduling a meeting here.
//
//   2. AUTOMATIC (optional): if a Google service account is configured
//      (GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY +
//      GOOGLE_CALENDAR_ID), this module creates a Calendar event with a Meet
//      conference request and returns the generated hangoutLink.
//
// The `googleapis` dependency is loaded lazily so the app keeps working when it
// is not installed (manual mode only).

const hasGoogleConfig = () =>
  Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY &&
      process.env.GOOGLE_CALENDAR_ID
  );

export function hasMeetCredentials() {
  return hasGoogleConfig();
}

// Normalise the line breaks in the PEM key (env vars often escape them).
function formatPrivateKey(key) {
  if (!key) return key;
  // Replace literal "\n" sequences and tidy whitespace so JWT signs correctly.
  return key.replace(/\\n/g, '\n');
}

/**
 * Create a Google Calendar event with a Meet conference request.
 * Returns { joinUrl, conferenceId }.
 *
 * @param {Object} params
 * @param {string} params.title
 * @param {(Date|string)} params.startTime
 * @param {number} params.durationMinutes
 */
export async function createGoogleMeet({ title, startTime, durationMinutes }) {
  if (!hasGoogleConfig()) {
    throw new Error('Google service account credentials are not configured.');
  }

  let google;
  try {
    google = (await import('googleapis')).google;
  } catch (err) {
    throw new Error("The 'googleapis' package is not installed. Run: npm install googleapis");
  }

  const start = startTime instanceof Date ? startTime : new Date(startTime);
  if (Number.isNaN(start.getTime())) throw new Error('Invalid start time for Google Meet event.');

  const end = new Date(start.getTime() + (Number(durationMinutes) || 60) * 60000);
  const toIso = (d) => d.toISOString();

  const jwtClient = new google.auth.JWT(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    null,
    formatPrivateKey(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY),
    ['https://www.googleapis.com/auth/calendar']
  );

  const calendar = google.calendar({ version: 'v3', auth: jwtClient });

  const event = {
    summary: title || 'School Meeting',
    start: { dateTime: toIso(start) },
    end: { dateTime: toIso(end) },
    conferenceData: {
      createRequest: { requestId: `meet-${Date.now()}`, conferenceSolutionType: 'hangoutsMeet' }
    }
  };

  const created = await calendar.events.insert({
    calendarId: process.env.GOOGLE_CALENDAR_ID,
    resource: event,
    conferenceDataVersion: 1
  });

  const hangoutLink = created.data.hangoutLink || '';
  const conferenceId = created.data.conferenceData?.conferenceId || '';

  if (!hangoutLink) {
    throw new Error('Google Calendar event was created but no Meet link was returned.');
  }

  return { joinUrl: hangoutLink, conferenceId };
}

/**
 * Optional: delete the backing Google Calendar event (best-effort, never throws).
 * @param {string} conferenceId - the Google Calendar event id stored on the meeting
 */
export async function deleteGoogleMeet(conferenceId) {
  if (!conferenceId || !hasGoogleConfig()) return false;
  try {
    let google;
    try {
      google = (await import('googleapis')).google;
    } catch {
      return false;
    }

    const jwtClient = new google.auth.JWT(
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      null,
      formatPrivateKey(process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY),
      ['https://www.googleapis.com/auth/calendar']
    );
    const calendar = google.calendar({ version: 'v3', auth: jwtClient });

    await calendar.events.delete({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      eventId: conferenceId
    });
    return true;
  } catch (err) {
    console.warn('Google Meet (Calendar event) deletion skipped:', err.message);
    return false;
  }
}
