'use strict';

// Load build number from .env file.
const dotenv = require('dotenv').config();
let path = require('path');

module.exports = {
  app: {
    title: 'HULFT Services',
    version: '1.1.0',
    description: 'HULFT Services',
    keywords: 'analytics'
  },
  db: {
    promise: global.Promise
  },
  port: process.env.PORT || 3000,
  host: process.env.HOST || '0.0.0.0',
  // DOMAIN config should be set to the fully qualified application accessible
  // URL. For example: https://www.myapp.com (including port if required).
  domain: process.env.DOMAIN,
  // Session Cookie settings
  sessionCookie: {
    // httpOnly flag makes sure the cookie is only accessed
    // through the HTTP protocol and not JS/browser
    httpOnly: true,
    // secure cookie should be turned to true to provide additional
    // layer of security so that the cookie is set only when working
    // in HTTPS mode.
    secure: false
  },
  // sessionSecret should be changed for security measures and concerns
  sessionSecret: process.env.SESSION_SECRET || 'IHaveASecret',
  // sessionKey is the cookie session name
  sessionKey: 'sessionId',
  sessionCollection: 'sessions',
  logo: './modules/core/client/img/brand/hulft_cloud_services_orange.svg',
  favicon: './modules/core/client/img/favicon.ico',
  illegalUsernames: ['meanjs', 'administrator', 'password', 'admin', 'user',
    'unknown', 'anonymous', 'null', 'undefined', 'api'
  ],
  aws: {
    s3: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
      bucket: process.env.S3_BUCKET
    }
  },
  uploads: {
    profileUpload: {
      dest: './modules//users/client/img/profile/uploads/', // Profile upload destination path
      limits: {
        fileSize: 1 * 1024 * 1024 // Max file size in bytes (1 MB)
      }
    }
  },
  shared: {
    owasp: {
      allowPassphrases: true,
      maxLength: 128,
      minLength: 8,
      minPhraseLength: 20,
      minOptionalTestsToPass: 2
    }
  },
  otherSettings: {
    astonUrl: 'http://localhost:3000'
  }
};
