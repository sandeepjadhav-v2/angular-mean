'use strict';

/**
 * Module dependencies
 */
var path = require('path'),
  errorHandler = require(path.resolve('./modules/core/controllers/errors.server.controller')),
  passport = require('passport'),
  db = require(path.resolve('./config/lib/sequelize')),
  config = require(path.resolve('./config/config')),
  _ = require('lodash'),
  utils = require(path.resolve('./config/lib/utils')),
  mail = require(path.resolve('./config/lib/mail'));


// URLs for which user can't be redirected on signin
var noReturnUrls = [
  '/authentication/signin'
];

function createUser(user, role, address) {
  var savedUser;
  user.roleId = role.id;
  return user.save()
    .then(function(_savedUser) {
      savedUser = _savedUser;
      if (address) {
        address.userId = savedUser.id;
        return address.save(address);
      }
    })
    .then(function () {
      return retriveUser(savedUser.id);
    });
}

function retriveUser(id) {
  return db.User.findOne({
    where: id,
    include: [{ model: db.Role, as: 'role' }, { model: db.LoginProvider, as: 'providers' }]
  });
}

function sendVerificationEmail (user, req, res) {
  return renderEmailTemplate(user, req, res)
    .then(function (emailTemplate) {
      return sendEmail(emailTemplate, user);
    })
    .catch(function(err) {
      console.log('email send error-', err);
    });
}

function renderEmailTemplate(user, req, res) {
  var httpTransport = 'http://';
  if (config.secure && config.secure.ssl === true) {
    httpTransport = 'https://';
  }
  var baseUrl = req.app.get('domain') || httpTransport + req.headers.host;
  var url = baseUrl + '/authentication/verify-email' + '?uId=' + user.id + '&vId=' + encodeURIComponent(user.emailVerifyToken);
  return new Promise(function (resolve, reject) {
    res.render(path.resolve('modules/users/./templates/email-verification-email'), {
      name: user.displayName,
      appName: config.app.title,
      url: url
    }, function (err, emailHTML) {
      if (err) {
        return reject('Render Error');
      } else {
        resolve(emailHTML);
      }
    });
  });
}

function sendEmail(emailHTML, user) {
  var mailOptions = {
    to: user.email,
    from: config.email.from,
    subject: 'Confirm your email',
    html: emailHTML
  };
  return new Promise(function (resolve, reject) {
    mail.sendMail(mailOptions, function (err) {
      resolve();
    });
  });
}

exports.resendVerificationMail = function (req, res) {
  return db.User.find({
    where: ['username=? or email=?', req.body.usernameOrEmail, req.body.usernameOrEmail]
  })
    .then(function (user) {
      if (!user) {
        res.status(422).send({
          message: 'Invalid UserName or Email'
        });
      } else {
        if (!user.emailVerified) {
          sendVerificationEmail(user, req, res).catch(function(err) {
            console.log('send email error=', err);
          });
          res.send({
            message: 'A verification email has been sent to you. Please click on the link in the email to activate your account.'
          });
        } else {
          res.status(422).send({
            message: 'Your Account has been already verified.'
          });
        }
      }
    })
    .catch(function (err) {
      res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};

// Create new session identifier value after user logged-In (To avoid impersonate a legitimate user)
const session = (req, res, user) => {
  var temp = req.session.passport;
  return req.session.regenerate(function(err) {
    if (err) {
      return res.status(400).send(err);
    }
    //  req.session.passport is now undefined
    req.session.passport = temp;
    return req.session.save(function(err) {
      if (err) {
        return res.status(400).send(err);
      }
      return res.json(user);
    });
  });
};

/**
 * Signin after passport authentication
 */
exports.signin = (req, res, next) => {
  passport.authenticate('local', function (err, user, info) {
    if (err || !user || (user.provider === 'local' && !user.sfSynced && !user.isSuperuser)) {
      console.error('err', err);
      res.status(422).send(info);
    } else {
      // Remove sensitive data before login
      user.password = undefined;
      user.salt = undefined;
      var promise = Promise.resolve();

      promise.then(function () {
        req.login(user, function (err) {
          if (err) {
            res.status(400).send(err);
          } else {
            session(req, res, user);
          }
        });
      });
    }
  })(req, res, next);
};

/**
 * Signout
 */
exports.signout = function (req, res) {
  req.logout();
  let cookie = req.cookies;
  for (var prop in cookie) {
    if (!cookie.hasOwnProperty(prop)) {
      continue;
    }
    res.clearCookie(prop);
  }
  res.sendStatus(200).end();
};

/**
 * OAuth provider call
 */
exports.oauthCall = function (strategy, scope) {
  return function (req, res, next) {
    if (req.query && req.query.redirect_to)
      req.session.redirect_to = req.query.redirect_to;

    // Authenticate
    passport.authenticate(strategy, scope)(req, res, next);
  };
};

/**
 * OAuth callback
 */
exports.oauthCallback = function (strategy) {
  return function (req, res, next) {

    // info.redirect_to contains inteded redirect path
    passport.authenticate(strategy, function (err, user, info) {
      if (err) {
        return res.redirect('/authentication/signin?err=' + encodeURIComponent(errorHandler.getErrorMessage(err)));
      }
      if (!user) {
        return res.redirect('/authentication/signin');
      }
      req.login(user, function (err) {
        if (err) {
          return res.redirect('/authentication/signin');
        }

        return res.redirect(info.redirect_to || '/');
      });
    })(req, res, next);
  };
};

/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function (req, providerUserProfile, done) {
  // Setup info object
  var info = {};

  // Set redirection path on session.
  // Do not redirect to a signin or signup page
  if (noReturnUrls.indexOf(req.session.redirect_to) === -1)
    info.redirect_to = req.session.redirect_to;

  if (!req.user) {
    // // Define a search query fields
    // var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
    // var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' +
    // providerUserProfile.providerIdentifierField;

    // Define main provider search query
    var mainProviderSearchQuery = {};
    mainProviderSearchQuery.provider = providerUserProfile.provider;
    mainProviderSearchQuery.providerId = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define additional provider search query
    var additionalProviderSearchQuery = {};
    additionalProviderSearchQuery['$providers.provider$'] = providerUserProfile.provider;
    additionalProviderSearchQuery['$providers.provider_id$'] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

    // Define a search query to find existing user with current provider profile
    var searchQuery = {
      $or: [mainProviderSearchQuery, additionalProviderSearchQuery]
    };

    return db.User.findOne({
      where: mainProviderSearchQuery,
      include: [{ model: db.Role, as: 'role' }, { model: db.LoginProvider, as: 'providers' }]
    })
      .then(function (user) {
        if (!user) {
          return db.LoginProvider.findOne({
            where: mainProviderSearchQuery,
            include: [db.User]
          })
            .then(function (loginProvider) {
              if (!loginProvider) {
                var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');
                return db.User.findUniqueUsername(possibleUsername)
                  .then(function (availableUsername) {
                    return db.User.build({
                      firstName: providerUserProfile.firstName,
                      lastName: providerUserProfile.lastName,
                      username: availableUsername,
                      displayName: providerUserProfile.displayName,
                      profileImageURL: providerUserProfile.profileImageURL,
                      provider: providerUserProfile.provider,
                      providerId: providerUserProfile.providerData[providerUserProfile.providerIdentifierField],
                      providerData: JSON.stringify(providerUserProfile.providerData),
                      email: providerUserProfile.email
                    });
                  })
                  .then(function (_user) {
                    user = _user;
                    return db.Role.findAll({ where: { name: db.Role.USER } })
                      .then(function (role) {
                        return role;
                      });
                  })
                  .then(function (role) {
                    return createUser(user, role);
                  })
                  .then(function (savedUser) {
                    return done(null, savedUser, info);
                  });
              } else {
                return retriveUser(loginProvider.userId)
                  .then(function (user) {
                    return done(null, user, info);
                  });
              }
            });

        } else {
          return done(null, user, info);
        }
      });
  } else {
    // User is already logged in, join the provider data to the existing user
    var user = req.user;

    // Check if user exists, is not signed in using this provider, and doesn't have that provider data already
    // configured
    var hasAdditionalProvider = _.some(user.providers, ['provider', providerUserProfile.provider]);
    if (user.provider !== providerUserProfile.provider && (!hasAdditionalProvider)) {
      // Add the provider data to the additional provider data field
      var loginProvider = db.LoginProvider.build({
        provider: providerUserProfile.provider,
        providerData: JSON.stringify(providerUserProfile.providerData),
        providerId: providerUserProfile.providerData[providerUserProfile.providerIdentifierField],
        userId: user.id
      });

      // And save the user
      return loginProvider.save()
        .then(function (provider) {
          return retriveUser(user.id);
        })
        .then(function (user) {
          return done(null, user, info);
        });
    } else {
      return done(new Error('User is already connected using this provider'), user);
    }
  }
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function (req, res, next) {
  var user = req.user;
  var provider = req.query.provider;

  if (!user) {
    return res.status(401).json({
      message: 'User is not authenticated'
    });
  } else if (!provider) {
    return res.status(400).send();
  }

  return db.LoginProvider.destroy({ where: { userId: user.id, provider: provider } })
    .then(function () {
      return retriveUser(user.id);
    })
    .then(function (user) {
      return req.login(user, function (err) {
        if (err) {
          return res.status(400).send(err);
        } else {
          return res.json(user);
        }
      });
    })

    .catch(function (err) {
      return res.status(422).send({
        message: errorHandler.getErrorMessage(err)
      });
    });
};

