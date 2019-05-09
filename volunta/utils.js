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

//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
//:::                                                                         :::
//:::  This routine calculates the distance between two points (given the     :::
//:::  latitude/longitude of those points). It is being used to calculate     :::
//:::  the distance between two locations using GeoDataSource (TM) prodducts  :::
//:::                                                                         :::
//:::  Definitions:                                                           :::
//:::    South latitudes are negative, east longitudes are positive           :::
//:::                                                                         :::
//:::  Passed to function:                                                    :::
//:::    lat1, lon1 = Latitude and Longitude of point 1 (in decimal degrees)  :::
//:::    lat2, lon2 = Latitude and Longitude of point 2 (in decimal degrees)  :::
//:::    unit = the unit you desire for results                               :::
//:::           where: 'M' is statute miles (default)                         :::
//:::                  'K' is kilometers                                      :::
//:::                  'N' is nautical miles                                  :::
//:::                                                                         :::
//:::  Worldwide cities and other features databases with latitude longitude  :::
//:::  are available at https://www.geodatasource.com                         :::
//:::                                                                         :::
//:::  For enquiries, please contact sales@geodatasource.com                  :::
//:::                                                                         :::
//:::  Official Web site: https://www.geodatasource.com                       :::
//:::                                                                         :::
//:::               GeoDataSource.com (C) All Rights Reserved 2018            :::
//:::                                                                         :::
//:::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::

export const distance = (lat1, lon1, lat2, lon2, unit) => {
  if (lat1 == lat2 && lon1 == lon2) {
    return 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    if (unit == 'K') {
      dist = dist * 1.609344;
    }
    if (unit == 'N') {
      dist = dist * 0.8684;
    }
    return dist;
  }
};
