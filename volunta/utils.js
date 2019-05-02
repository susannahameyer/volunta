// Shared utils functions

// Pass in from_date or to_date from an event object
// Returns date in 'MM/DD/YY' string format
export const timestampToDate = (timestamp) => {
    let date = new Date(null);
    date.setSeconds(timestamp.seconds);
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let year = date.getFullYear();
    return month.toString() + '/' + day.toString() + '/' + year.toString().slice(-2);
}