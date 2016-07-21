var express = require('express');
var mongoose = require('mongoose');
var logger = require('morgan');
var nodemailer = require('nodemailer');
var passport = require('passport');
var BearerStrategy = require('passport-http-bearer');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
var bodyParser = require('body-parser');
var randtoken = require('rand-token');
var router  = express.Router();
var app = express();
var moment = require('moment');
var config = require('./config');
var agenda = require('agenda')({ db: { address: config.mongoURI } });

var transporter = require('./email');

var server_port = 8080;
var server_ip_address = '127.0.0.1'; // 127.0.0.1 as localhost

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api/v1', router);
app.set('port', process.env.PORT || server_port);
app.use(logger('dev'));
app.use(passport.initialize());
app.use(express.static(path.join(__dirname, 'public')));

var Schema = mongoose.Schema;
var isAuthenticated = passport.authenticate('bearer', { session : false });

mongoose.connect(config.mongoURI, function(err) {
    if (err) throw err;
});

String.prototype.toObjectId = function() {
  var ObjectId = (require('mongoose').Types.ObjectId);
  return new ObjectId(this.toString());
};

var userSchema = new mongoose.Schema({
  email: String,
  password: String,
  gender: String,
  token: String,
  dob: Date,
  phoneNumber: Number,
  firstName: String,
  lastName: String,
  dateCreated: String,
  zipCode: Number,
  street: String,
  city: String,
  state: String,
  specialties: [],
  country: String,
  isDoctor: Boolean,
  isAdmin: Boolean,
  isStaff: Boolean,
  appointments: [{ type: Schema.Types.ObjectId, ref: 'Appointment' }]
},
{
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

userSchema.pre('save', function(callback) {
  var user = this;
  if (!user.isModified('password')) return callback();

  bcrypt.genSalt(5, function(err, salt) {
    if (err) return callback(err);

    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return callback(err);
      user.password = hash;
      callback();
    });
  });
});

userSchema.methods.verifyPassword = function(password, cb) {
  bcrypt.compare(password, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.options.toJSON.transform = function (doc, ret) {
    delete ret._id;
    delete ret.__v;
    delete ret.password;
};


var appointmentSchema = new mongoose.Schema({
  doctor: { type: Schema.Types.ObjectId, ref: 'User' },
  clinic: { type: Schema.Types.ObjectId, ref: 'Clinic' },
  paitent: { type: Schema.Types.ObjectId, ref: 'User' },
  specialtySetForAppointment: String,
  approved: Boolean,
  dateAndTime: Date,
  approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  approvedOn: Date,
  doctorsNote: String
});

var clinicSchema = new mongoose.Schema({
  appointments: [{ type: Schema.Types.ObjectId, ref: 'Appointment' }],
  name: String,
  paitents: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  doctors: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  description: String,
  phoneNumber: Number,
  zipCode: Number,
  street: String,
  city: String,
  state: String,
  country: String
});

var submissionSchema = new mongoose.Schema({
  clinicName: String,
  applicant: { type: Schema.Types.ObjectId, ref: 'User' },
  medicalLicenseNumber: Number,
  applicantEmail: String,
  zipCode: Number,
  description: String,
  street: String,
  city: String,
  state: String,
  phoneNumber: Number,
  country: String,
  dateCreated: Date
},
{
  toObject: { virtuals: true },
  toJSON: { virtuals: true }
});

submissionSchema.options.toJSON.transform = function (doc, ret) {
    delete ret._id;
    delete ret.__v;
};

var User = mongoose.model('User', userSchema);
var Appointment = mongoose.model('Appointment', appointmentSchema);
var Clinic =  mongoose.model('Clinic', clinicSchema);
var Submission =  mongoose.model('Submission', submissionSchema);

// Token Based Authentication Because why not.
passport.use(new BearerStrategy(
  function(tokenInput, done) {
    User.findOne({ token: tokenInput }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      return done(null, user, { scope: 'all' });
    });
  }
));

router.get('/', function (req, res) {
    res.json({ message: "docAPPT API v1"});
});

router.post('/register', function(req, res) {


  var fields = ['email', 'password', 'phoneNumber', 'firstName', 'lastName',
  'zipCode', 'street', 'city', 'state', 'country', 'gender', 'dob'], field;

  for (var i = 0; i < fields.length; i++) {
    field = fields[i];
    if (!req.body[field]) {
      return res.status(400).end('Invalid Input');
    }
  }

  User.findOne({ email: req.body.email }, function(err, user) {
    if (user) {
      return res.status(400).end('Email Address already in use with another account.');
    } else {

      var newUser = new User();
      for (var i = 0; i < fields.length; i++) {
        field = fields[i];
        newUser[field] = req.body[field];
      }

      var generatedToken = randtoken.generate(16);

      newUser.isAdmin = false;
      newUser.isDoctor = false;
      newUser.isStaff = false;
      newUser.dateCreated = Date.now();
      newUser.token = generatedToken;

      newUser.save(function(err) {
        if (err) return next(err);
      });

      newUser = newUser.toObject();
      delete newUser.password;
      delete newUser._id;
      res.json(newUser);

      var submissionMailOptions = {
        from: 'docAPPT Suuport <skinreserve@gmail.com>',
        to: newUser.email,
        subject: 'docAPPT Account Created!',
        template: 'newUser',
        context: {
          email: newUser.email,
          firstName: newUser.firstName
        }
      };

      function sendEmail() {
        // send mail with defined transport object
        transporter.sendMail(submissionMailOptions, function(error, info){
          if(error){
            console.log(error);
          } else {
            console.log('Message sent: ' + info.response);
          }
          transporter.close();
        });
      }

      sendEmail()

    }
  });
});

router.post('/register/doctor', isAuthenticated, function(req, res, next) {

  var fields = ['clinicName','medicalLicenseNumber', 'zipCode', 'street', 'city', 'state', 'phoneNumber', 'country', 'description'], field;

  for (var i = 0; i < fields.length; i++) {
    field = fields[i];
    if (!req.body[field]) {
      return res.status(409).end('Invalid Input'); // 409 Conflict
    }
  }

  // req.user.id.toObjectId()
  Submission.findOne({ applicant: req.user.id }, function(err, submission) {

      if (submission) {
        res.json({'message': 'You have already made a submission'});
      } else {
        var newSubmission = new Submission();
        for (var i = 0; i < fields.length; i++) {
          field = fields[i];
          newSubmission[field] = req.body[field];
      }

      newSubmission.applicant = req.user.id;
      newSubmission.clinicName = req.body.clinicName;
      newSubmission.dateCreated = Date.now();

      newSubmission.save(function(err) {
        if (err) return next(err);
        res.json({'message': 'Your submission has been sent to our staff!'});
        sendEmail();
      });
    }
  });

  var submissionMailOptions = {
    from: 'docAPPT Suuport <skinreserve@gmail.com>',
    to: req.user.email,
    subject: 'docAPPT Clinic Submission Succsefully Sent',
    template: 'doctorsubmission',
    context: {
      email: req.user.email,
      firstName: req.user.firstName
    }
  };

  function sendEmail() {

    // send mail with defined transport object
    transporter.sendMail(submissionMailOptions, function(error, info){
      if(error){
        console.log(error);
      } else {
        console.log('Message sent: ' + info.response);
      }
      transporter.close();
    });

  }

});

router.post('/login', function(req, res, next) {

  User.findOne({ email: req.body.email }, function (err, user) {

    if (err) {
        res.json({"message": "There is no User in our database with the requested ID"});
    }

    if (!user) {
      res.json({"message": "User does not exist"});
    }

  user.verifyPassword(req.body.password, function(err, isMatch) {

      if (err) {
          res.json({"message": "There is no User in our database with the requested ID"});
      }

      if (!isMatch) {
        res.json({"message": "Password does not match"});
      } else {

        var newLoginToken = randtoken.generate(16);
        user.token = newLoginToken;
        user.save();
        res.end({ "token": user.token });

      }

    });
  });

});

app.post('/user/request/appointment', isAuthenticated, function(req, res) {

  // user requests appointments as a normal user
  var fields = ['clinicID', 'paitent', 'specialtySetForAppointment', 'dateAndTime'], field;

  for (var i = 0; i < fields.length; i++) {
    field = fields[i];
    if (!req.body[field]) {
      return res.status(400).end('Invalid Input');
    }
  }

  var newAppointment = new Appointment();
  newAppointment.clinic = req.body.clinicID;
  newAppointment.paitent = req.body.userID;
  newAppointment.specialtySetForAppointment = req.body.specialtySetForAppointment;
  newAppointment.dateAndTime = req.body.dateAndTime;
  newAppointment.save();

});

router.get('/clinic/:id', function(req, res) {
  Clinic
  .findById(req.params.id)
  .populate('doctors')
  .exec(function (err, clinic) {
      if (clinic) {
        res.json(clinic);
      } else {
        return res.status(400).end('Clinic Not Found');
      }
  });
});

app.get('/doctor/:id', function(req, res) {
  // returns infromation about a doctor (user with isDoctor as true)
  User.findOne({ _id: req.params.id }, function(err, user) {
    if (user.isDoctor) {
      user = user.toObject();
      res.end(JSON.stringify(user));
    } else {
      return res.status(400).end('Doctor Not Found');
    }
  });
});

app.get('/user/profile', isAuthenticated, function(req, res) {
  // shows currently logged in user information
  User.findOne({ _id: req.user._id }, function(err, user) {
    user = user.toObject;
    delete user.password;
    res.end(JSON.stringify(user));
  });
});

app.post('/panel/approve/:id', isAuthenticated, function(req, res) {
  // approve appointments as a doctor
  Clinic.findOne({ _id: req.params.id }, function(err, clinic) {
    if (!clinic) {
      return res.status(400).end('Clinic Not Found');
    }

    if (req.user.clinicWorkingAt === clinic._id) {
      return res.status(401).end('An error as occured.');
    } else {
      // approve appointment if all goes good
      newAppointment = new Appointment();
      newAppointment.approved = true;
      newAppointment.save();
      // send an email out to the user via nodemailer here

    }
  });

});

app.post('/panel/doctor/create', isAuthenticated, function(req, res) {
  // create appointment as doctor to exsisting clinc
  var userEmail = req.body.email;
  var time = req.body.time;
  var doctorsNote = req.body.doctorsNote;
  var specialtySetForAppointment = req.body.specialtySetForAppointment;
});

app.post('/panel/doctor/add', isAuthenticated, function(req, res) {
  // add doctor to clinic
  Clinic.findOne({}, function(err, clinic) {
    if (!clinic) return res.status(401);

    User.findOne({ email: req.body.email }, function(err, user) {
      if (!user) return res.end({'message': 'No user was found that was associated with this email.'});
      clinic.doctors.push(user.email);
    });
  });
});

app.post('/panel/doctor/leave/:id', isAuthenticated, function(req, res, next) {
  // leave current clinic as authenticated doctor
  Clinic.findById(req.params.id, function(err, clinic) {
    if (err) return next(err);
    if(!clinic) return res.status(401);
    var index = clinic.doctors.indexOf(req.params.id);
    clinic.doctors.splice(index, 1);
    clinic.save(function(err) {
      if (err) return next(err);
      res.send(200); // user has been succsefully removed from clinc
    });
  });
});

// admin panel for approving doctos as staff for the service

router.get('/admin/submissions', isAuthenticated, function(req, res) {
  // returns all pending doctors submissions to dev/admins

    if (req.user.isAdmin == false) return res.status(400).send({message: 'Why are you here lol?'});

    Submission
    .find({})
    .populate('applicant')
    .exec(function (err, submissions) {
      if (err) return handleError(err);
      res.json(submissions);
    });

});

router.put('/admin/approve/:id', isAuthenticated, function(req, res) {
  // approves doctor based off their user id

  if (req.user.isAdmin == false) return res.status(400).send({message: 'Why are you here lol?'});

    Submission
    .findById(req.params.id)
    .populate('applicant')
    .exec(function (err, submission) {

    console.log('Applicant Email: ' + submission.applicant.email);

    if (!submission) return res.status(400).send({ message: 'Submission does not exist' }); // submission doesn't exist

    var newClinic = new Clinic({
      name: submission.clinicName,
      paitents: [],
      appointments: [],
      doctors: [submission.applicant.id],
      description: submission.description,
      phoneNumber: submission.phoneNumber,
      zipCode: submission.zipCode,
      street: submission.street,
      city: submission.city,
      state: submission.state,
      country: submission.country
    });

    var emailMessageTo = submission.applicant.email;

    newClinic.save(function(err, newClinic) {
      if (err) return console.error(err);
    });

    res.status(200).send({ message: 'Succsefully Added' });

    // TODO: Send Email
    var newClinicMailOptions = {
        from: 'docAPPT Support <skinreserve@gmail.com>',
        to: submission.applicant.email,
        subject: 'Congratulations your clinic has been added!',
        template: 'newClinic',
        context: {
          email: submission.applicant.email,
          firstName: submission.applicant.firstName
        }
      };

      transporter.sendMail(newClinicMailOptions, function(error, info){
        if(error){
          console.log(error);
        } else {
          console.log('Message sent: ' + info.response);
        }
        transporter.close();
      });

      User.findById(submission.applicant.id, function(err, user) {
        user.isDoctor = true;
        user.save();
      });

      submission.remove(function(err, oldSubmission) {
        if (err) return console.error(err);
      });

  });
});

router.delete('/admin/decline/:id', isAuthenticated, function(req, res) {
  // approves doctor based off their user id

  if (req.user.isAdmin == false) return res.status(400).send({message: 'Why are you here lol?'});

  Submission
  .findById(req.params.id)
  .populate('applicant')
  .exec(function (err, submission) {
    if (!submission) return res.status(400).send({ message: 'Submission does not exist' });

    var newClinicMailOptions = {
        from: 'docAPPT Suuport <skinreserve@gmail.com>',
        to: submission.applicant.email,
        subject: 'Your docAPPT Clinic Submission has been rejected.',
        template: 'clinicRejection',
        context: {
          email: submission.applicant.email,
          firstName: submission.applicant.firstName
        }
      };

      transporter.sendMail(newClinicMailOptions, function(error, info){
        if(error){
          console.log(error);
        } else {
          console.log('Message sent: ' + info.response);
        }
        transporter.close();
      });

    submission.remove(function(err, oldSubmission) {
      if (err) return console.error(err);
    });
  });
});

// TODO: (Feature) doctors to create a 6-10 digit code that allows user them to add exsisting users to a clinic as a new doctor.

app.get('/autocomplete/email', function(req, res) {

  // => http://localhost:8000/autocomplete?query=the
  var name = req.param('query');
  var regex = new RegExp(name, 'i');
  var query = User.find({email: regex}).limit(20).select('email');
  // var query = User.find({fullname: regex}, { 'fullname': 1 }).sort({"updated_at":-1}).sort({"created_at":-1}).limit(20);

  // Execute query in a callback and return user
  query.exec(function(err, user) {
       if (!err) {
           res.send(user, {'Content-Type': 'application/json'}, 200);
       } else {
           res.send(JSON.stringify(err), {'Content-Type': 'application/json'}, 404);
       }
  });
});

router.get('/autocomplete/clinic', function(req, res) {
  var name = req.param('query');
  var regex = new RegExp(name, 'i');
  var query = Clinic.find({name: regex}).limit(20).select('name').select('city').select('state');

  query.exec(function(err, clinic) {
       if (!err) {
           res.send(clinic, {'Content-Type': 'application/json'}, 200);
       } else {
           res.send(JSON.stringify(err), {'Content-Type': 'application/json'}, 404);
       }
  });
});

router.get('/user/current', isAuthenticated, function(req, res) {
  User.findById(req.user.id, function(err, user) {
    res.json(user);
  });
});

app.listen(server_port, server_ip_address, function () {
     console.log("Server is Running on port " + server_port + " and located on " + server_ip_address);
});
