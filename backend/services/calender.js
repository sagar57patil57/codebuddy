const {google} = require('googleapis');
require('dotenv').config();
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const calendarId = process.env.CALENDAR_ID;
const Util = require('../utils/utilities');

// Google calendar API settings
const SCOPES = 'https://www.googleapis.com/auth/calendar';
const calendar = google.calendar({version : "v3"});

const auth = new google.auth.JWT(
    CREDENTIALS.client_email,
    null,
    CREDENTIALS.private_key,
    SCOPES
);


// Insert new event to Google Calendar
insertEvent = async (event) => {

    try {
        let response = await calendar.events.insert({
            auth: auth,
            calendarId: calendarId,
            resource: event
        });
    
        if (response['status'] == 200 && response['statusText'] === 'OK') {
            return 1;
        } else {
            return 0;
        }
    } catch (error) {
        console.log(`Error at insertEvent --> ${error}`);
        return 0;
    }
};

exports.init = async (payload, site) => {
    // Event for Google Calendar
    let dateTime = Util.dateTimeForCalander(payload.startDate, payload.contestLength);
    console.log("date1", dateTime)
    const event = {
        'summary': `${site} Contest`,
        'description': payload.description,
        'start': {
            'dateTime': dateTime['start'],
            'timeZone': 'Asia/Kolkata'
        },
        'end': {
            'dateTime': dateTime['end'],
            'timeZone': 'Asia/Kolkata'
        }
    };
    try {
        const result = await insertEvent(event);
        console.log(result);
        return result;
    } catch (err) {
        console.log(err);
        return 0;
    }
}