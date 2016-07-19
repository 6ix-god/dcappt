// hi
var nodemailer = require('nodemailer'),
    nodemailerHandlebars = require('nodemailer-express-handlebars');

var mailerOptions = {
     viewEngine: {
         extname: '.hbs',
         layoutsDir: 'views/email/',
         defaultLayout : 'template',
         partialsDir : 'views/partials/'
     },
     viewPath: 'views/email/',
     extName: '.hbs'
 };


var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'skinreserve',
    pass: 'K6Tv9ktvUXNu7TxbZcFUC8F5'
  }
});

transporter.use('compile', nodemailerHandlebars(mailerOptions));
module.exports = transporter;
