// Shared utils functions

// Pass in from_date or to_date from an event object
// Returns date in 'MM/DD/YY' string format
export const timestampToDate = timestamp => {
  let date = new Date(0);
  date.setUTCSeconds(timestamp.seconds);
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let year = date.getFullYear();
  return (
    month.toString() + '/' + day.toString() + '/' + year.toString().slice(-2)
  );
};

// Similar to default dict in python
// Use: const counts = new DefaultDict(0)
export class DefaultDict {
  constructor(defaultVal) {
    return new Proxy(
      {},
      {
        get: (target, name) => (name in target ? target[name] : defaultVal),
      }
    );
  }
}

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

// Pass in date in 'MM/DD/YY' string format
// Returns date formatted like: 'June 20, 2019'
export const dateToWords = date => {
  let dateRegex = /(\d+)\/(\d+)\/(\d+)/;
  let result = dateRegex.exec(date);
  let month = monthNames[Number(result[1])];
  let day = result[2];
  // Add year prefix
  let year = '20' + result[3];
  return month + ' ' + day + ', ' + year;
};

// Pass in to_date or from_date from an event object
// Returns time of day in '12:00PM' format
export const timestampToTimeOfDay = timestamp => {
  let date = new Date(0);
  date.setUTCSeconds(timestamp.seconds);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  let meridian = 'AM';
  if (hours >= 12) {
    meridian = 'PM';
  }
  if (hours == 0) {
    hours = 12;
  } else if (hours > 12) {
    hours = hours - 12;
  }
  hours = hours.toString();

  if (minutes < 10) {
    minutes = minutes.toString();
    minutes = '0' + minutes;
  } else {
    minutes = minutes.toString();
  }
  return hours + ':' + minutes + ' ' + meridian;
};
