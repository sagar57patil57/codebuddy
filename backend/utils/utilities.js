const { Constants } = require("./constants");
require('dotenv').config();
const jwt = require("jsonwebtoken");

exports.getContestObject = (title, schedule, link, site) => {
    if (!title) {
        return null;
    }
    return {
        title,
        link: link ? 'https://www.hackerrank.com' + link : 'https://www.hackerrank.com',
        schedule,
        site,
        type: 'future'
    }
}

exports.getCfContestObject = (title, schedule, length, link, site) => {
    console.log(title, schedule, length, link, site)
    if (!title) {
        return null;
    }
    console.log(new Date() - new Date(schedule))
    return {
        title,
        link: link ? 'https://codeforces.com' + link : 'https://codeforces.com/contests',
        schedule: schedule,
        length: length,
        site,
        //type: new Date() - new Date(schedule) > 0 ? 'future' : 'current'
    }
}

exports.getHackerRankContestObject = (type, title, date, site) => {
    return {
        type,
        title,
        link: 'https://www.hackerearth.com/challenges/',
        schedule: date,
        site
    }
}

exports.getCacheKey = (website) => {

    switch (website) {
        case Constants.HACKER_RANK:
            return Constants.HACKER_RANK_CONTESTS;
    }

}

exports.dateTimeForCalander = (selectedDate, len = 1) => {
    // Your TIMEOFFSET Offset
    const TIMEOFFSET = '+05:30';
    let date = new Date(selectedDate);

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    if (month < 10) {
        month = `0${month}`;
    }
    let day = date.getDate();
    if (day < 10) {
        day = `0${day}`;
    }
    let hour = date.getHours();
    if (hour < 10) {
        hour = `0${hour}`;
    }
    let minute = date.getMinutes();
    if (minute < 10) {
        minute = `0${minute}`;
    }

    let newDateTime = `${year}-${month}-${day}T${hour}:${minute}:00.000${TIMEOFFSET}`;

    let event = new Date(Date.parse(newDateTime));

    let startDate = event;
    // Delay in end time is 1
    let endDate = new Date(new Date(startDate).setHours(startDate.getHours()+len));

    return {
        'start': startDate,
        'end': endDate
    };
}

exports.getDbName = () => {
    if (process.env._DEV_ == "true") {
        return 'mongodb://localhost:27017/killbit';
    } else if (process.env._TEST_ == "true") {
        return 'mongodb://localhost:27017/killbit_test';
    }
    return '';
}

exports.generateToken = (email, id, role) => {
    return jwt.sign(
        { email: email, userId: id, role: role },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
    )
}