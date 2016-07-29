var moment = require('moment');
// get current time and date in iso format
var date = moment();
console.log("Today's Date and Time in ISO Format: " + moment().format()); // ->  2016-07-28T21:32:08-04:00

// check if date is valid iso format

console.log("2016-07-28T21:32:08-04:00: " + moment("2016-07-28T21:32:08-04:00").isValid() + "\n"); // => true
console.log("2016-07-29T11:00:00.000Z: " + moment("2016-07-28T21:32:08-04:00").isValid() + "\n"); // => true
