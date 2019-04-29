// Shared utils functions


// Pass in from_date or to_date from an event object
// Returns date in 'MM/DD/YY' string format
export const timestampToDate = (timestamp) => {
    var date = new Date(null);
    date.setSeconds(timestamp.seconds);
    var month = date.getMonth() + 1;
    var day = date.getDate();
    var year = date.getFullYear();
    return month.toString() + '/' + day.toString() + '/' + year.toString().slice(-2);
}