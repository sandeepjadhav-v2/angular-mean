'use strict';

var path = require('path'),
  config = require(path.resolve('./config/config')),
  handlebars = require('handlebars'),
  fs = require('fs'),
  nodemailer = require('nodemailer'),
  logger = require(path.resolve('./config/lib/logger')),
  sendEmail,
  smtpTransport;

function getEmailContents(templatePath, replacements) {
  var templateContents = fs.readFileSync(templatePath).toString();

  var template = handlebars.compile(templateContents);
  var html = template(replacements);
  return html;
}

smtpTransport = nodemailer.createTransport(config.email.smtp);
smtpTransport.verify(function(error, success) {
  if (error) {
    logger.error('Error while creating the transport', error);
  } else {
    logger.info('Server is ready to take our messages');
  }
});

function getMailOptions(options, emailHtml) {
  let mailOptions;
  mailOptions = {
    to: options.to,
    from: options.from || config.email.from,
    subject: options.subject,
    html: emailHtml,
    cc: options.cc,
    bcc: options.bcc
  };
  return mailOptions;
}

exports.sendMail = function (options) {
  return new Promise(function (resolve, reject) {
    var emailHtml = getEmailContents(options.templatePath, options.replacements);
    var mailOptions = getMailOptions(options, emailHtml);
    smtpTransport.sendMail(mailOptions, function (err, response) {
      if (err) {
        logger.error('Error while sending the email using SMTP', err);
        reject(err);
      } else {
        resolve(response);
      }
    });
  });
};
