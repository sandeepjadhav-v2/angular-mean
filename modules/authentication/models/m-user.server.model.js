'use strict';

/**
 * User Model
 */

var crypto = require('crypto'),
  path = require('path'),
  config = require(path.resolve('./config/config')),
  zxcvbn = require('zxcvbn'),
  _ = require('lodash');


module.exports = function (sequelize, DataTypes) {

  var User = sequelize.define('User',
    {
      firstName: { type: DataTypes.STRING, field: 'first_name' },
      lastName: { type: DataTypes.STRING, field: 'last_name' },
      displayName: { type: DataTypes.STRING, field: 'display_name' },
      email: {
        type: DataTypes.STRING,
        field: 'email',
        unique: true,
        allowNull: false,
        validate: {
          isEmail: true,
          isUnique: sequelize.validateIsUnique('email', 'Email already exists')
        }
      },
      username: {
        type: DataTypes.STRING,
        field: 'username',
        unique: true,
        allowNull: false,
        validate: {
          /**
           * A Validation function for username
           * - at least 3 characters
           * - only a-z0-9_-.
           * - contain at least one alphanumeric character
           * - not in list of illegal usernames
           * - no consecutive dots: "." ok, ".." nope
           * - not begin or end with "."
           */
          validateUsername: function (value) {
            var usernameRegex = /^(?=[\w.-]+$)(?!.*[._-]{2})(?!\.)(?!.*\.$).{3,34}$/;
            if (this.provider !== 'local' || (value && usernameRegex.test(value) && config.illegalUsernames.indexOf(value) < 0)) {
              // valid
            } else {
              // Invalid
              throw new Error('Please enter a valid username: 3+ characters long, non restricted word, characters "_-.", no consecutive dots, does not begin or end with dots, letters a-z and numbers 0-9.');
            }
          },
          isUnique: sequelize.validateIsUnique('username', 'Username already exists')
        }
      },
      language: { type: DataTypes.STRING, field: 'language', defaultValue: 'en-US' },
      password: {
        type: DataTypes.STRING, field: 'password'
      },
      salt: DataTypes.STRING,
      profileImageURL: { type: DataTypes.STRING, field: 'profile_image_url' },
      provider: {
        type: DataTypes.STRING,
        allowNull: false
      },
      providerId: {
        type: DataTypes.STRING,
        field: 'provider_id'
      },
      providerData: {
        type: DataTypes.TEXT,
        field: 'provider_data'
      },
      resetPasswordToken: {
        type: DataTypes.STRING,
        field: 'reset_password_token'
      },
      resetPasswordExpires: {
        type: DataTypes.DATE,
        field: 'reset_password_expires'
      },
      createdByUserID: {
        type: DataTypes.STRING,
        field: 'created_by_user_id'
      },
      emailVerified: {
        type: DataTypes.BOOLEAN,
        field: 'email_verified'
      },
      emailVerifyToken: {
        type: DataTypes.STRING,
        field: 'email_verify_token'
      },
      emailVerifyTokenExpires: {
        type: DataTypes.DATE,
        field: 'email_verify_token_expires'
      },
      failedLoginAttempts: {
        type: DataTypes.INTEGER,
        field: 'failed_login_attempts'
      },
      lockedStatus: {
        type: DataTypes.BOOLEAN,
        field: 'locked_status'
      },
      deletedAt: {
        type: DataTypes.STRING,
        field: 'deleted_at'
      },
      updatedByUserId: {
        type: DataTypes.STRING,
        field: 'updated_by_user_id'
      },
      roleId: {
        type: DataTypes.INTEGER,
        field: 'role_id'
      },
      phoneNumber: {
        type: DataTypes.STRING,
        field: 'phone_number'
      },
      lastPasswordUpdatedAt: {
        type: DataTypes.DATE,
        field: 'last_password_updated_at'
      }
    },
    {
      timestamps: true,
      paranoid: true,
      underscored: true,
      freezeTableName: true,
      // define the table's name
      tableName: 'users',
      instanceMethods: {
        makeSalt: function () {
          return crypto.randomBytes(16).toString('base64');
        },
        encryptPassword: function (password, salt) {
          if (!password || !salt) {
            return '';
          }
          salt = new Buffer(salt, 'base64');
          return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');
        },
        isSuperUser: function() {
          return (this.role && this.role.name === sequelize.models.Role.SUPERUSER);
        },
        isAdmin: function() {
          return (this.role && this.role.name === sequelize.models.Role.ADMIN);
        },
        isManager: function() {
          return (this.role && this.role.name === sequelize.models.Role.MANAGER);
        },
        isUser: function() {
          return (this.role && this.role.name === sequelize.models.Role.USER);
        }
      },
      associate: function (models) {
        User.belongsTo(models.Role, { as: 'role', foreignKey: 'roleId' });
        User.hasMany(models.LoginProvider, { as: 'providers' });

      },
      hooks: {
        beforeCreate: beforeSave,
        beforeUpdate: beforeSave
      },
      classMethods: {
        defaultProfileImageURL: function () {
          return 'modules/users/client/img/profile/default.png';
        },
        findUniqueUsername: function (username, suffix) {
          var _this = this;
          var possibleUsername = username.toLowerCase() + (suffix || '');

          return _this.findOne({ where: { username: possibleUsername } })
            .then(function (user) {
              if (!user) {
                return possibleUsername;
              } else {
                return _this.findUniqueUsername(username, (suffix || 0) + 1);
              }
            });
        }
      }
    }
  );


  User.prototype.authenticate = function(plainText) {
    // console.log('this.password: ', this.password)
    // console.log('this.salt: ', this.encryptPassword(plainText, this.salt))
    // console.log('this; ', plainText, this.salt)

    return this.encryptPassword(plainText, this.salt) === this.password;
  }

  User.prototype.toJSON =  function () {
    var values = this.get({ plain: true });
    delete values.password;
    delete values.salt;
    values.providers = [];
    values.created = this.created_at;
    values.updated = this.updated_at;
    values.isSuperuser = this.isSuperUser();
    values.isAdmin = this.isAdmin();
    values.isManager = this.isManager();
    values.isUser = this.isUser();

    values.providers = _.map(this.providers, function (provider) {
      return { provider: provider.provider, providerId: provider.providerId };
    });
    return values;
  }

  User.prototype.isSuperUser = function() {
    return (this.role && this.role.name === sequelize.models.Role.SUPERUSER);
  }
  User.prototype.isAdmin = function() {
    return (this.role && this.role.name === sequelize.models.Role.ADMIN);
  }
  User.prototype.isManager = function() {
    return (this.role && this.role.name === sequelize.models.Role.MANAGER);
  }
  User.prototype.isUser = function() {
    return (this.role && this.role.name === sequelize.models.Role.USER);
  }

  User.prototype.encryptPassword = function (password, salt) {
    if (!password || !salt) {
      return '';
    }
    salt = new Buffer.from(salt, 'base64');
    console.log('salt encryptPassword: ', salt, password);
    return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('base64');
  }

  return User;

  function saveUserPassword(user, models) {
    let userPasswordsObj = {
      userId: user.id,
      password: user._previousDataValues.password,
      salt: user.salt
    };
    let userPassword = models.UserPassword.build(userPasswordsObj);
    return userPassword.save();
  }

  async function checkForPreviousPasswords(user) {
    let models = user.sequelize.models;
    let previousPasswordToCheck = 3;
    let userPasswords = await models.UserPassword.findAll({ where: { userId: user.id }, limit: previousPasswordToCheck, order: [['created_at', 'DESC']] });
    if (userPasswords.length > 0) {
      userPasswords.some(function(oldPassword) {
        let newPassword = user.encryptPassword(user.password, oldPassword.salt);
        if (newPassword === oldPassword.password) {
          throw new Error('Cannot use last four passwords as new password');
        }
        return false;
      });
    }
    await saveUserPassword(user, models);
    user.salt = user.makeSalt();
    user.password = user.encryptPassword(user.password, user.salt);
    user.lastPasswordUpdatedAt = new Date();
    return user;
  }

  function checkForPasswordStregth (userData) {
    let matchingUserInput = false,
      matchingRepeatedCharacters = false,
      machingDictionaryWord = false;
    let userInputs = _.pick(userData, ['firstName', 'lastName', 'email', 'username']);
    let userInputsForZxcvbn = Object.values(userInputs);
    let zxcvbnResult = zxcvbn(userData.password, userInputsForZxcvbn);
    _.find(zxcvbnResult.sequence, function(obj) {
      if (obj.pattern === 'dictionary') {
        if (obj.dictionary_name === 'user_inputs') {
          matchingUserInput = true;
        } else {
          machingDictionaryWord = true;
        }
      }
      matchingRepeatedCharacters = (obj.pattern === 'repeat' && obj.pattern.repeat_count > 2);
      return (matchingUserInput || machingDictionaryWord || matchingRepeatedCharacters);
    });
    if (zxcvbnResult.feedback.warning) {
      throw new Error(zxcvbnResult.feedback.warning);
    } else if (matchingUserInput) {
      throw new Error('password should not include FirstName, LastName, UserName or Email');
    } else if (matchingRepeatedCharacters) {
      throw new Error('Repeated characters are not allowed');
    }
  }

  function beforeSave(user) {
    if (user.changed('password')) {
      checkForPasswordStregth(user);
      if (user.isNewRecord) {
        user.salt = user.makeSalt();
        user.password = user.encryptPassword(user.password, user.salt);
        user.lastPasswordUpdatedAt = new Date();
      } else {
        let newPassword = user.encryptPassword(user.password, user.salt);
        let lastPassword = user._previousDataValues.password;
        if (newPassword === lastPassword) {
          throw new Error('Cannot use same passwords');
        } else {
          return checkForPreviousPasswords(user, newPassword);
        }
      }
    }
    if (!user.profileImageURL) {
      user.profileImageURL = User.defaultProfileImageURL();
    }
  }

};
