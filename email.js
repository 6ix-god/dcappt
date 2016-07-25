var nodemailer = require('nodemailer'),
    nodemailerHandlebars = require('nodemailer-express-handlebars');
var config = require('./config');

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
    user: config.email,
    pass: config.emailPswd
  }
});

transporter.use('compile', nodemailerHandlebars(mailerOptions));
module.exports = transporter;
