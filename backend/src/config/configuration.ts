export default () => ({
  nodeEnv: process.env.NODE_ENV,
  port: Number(process.env.PORT ?? 3000),

  databaseUrl: process.env.DATABASE_URL,

  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
  },

  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

  contactEmail: process.env.CONTACT_EMAIL,

  corsOrigin: process.env.CORS_ORIGIN,

  upload: {
    dir: process.env.UPLOAD_DIR,
    maxFileSize: Number(process.env.MAX_FILE_SIZE ?? 20 * 1024 * 1024),
    imageMaxWidth: Number(process.env.UPLOAD_IMAGE_MAX_WIDTH ?? 1920),
    imageMaxHeight: Number(process.env.UPLOAD_IMAGE_MAX_HEIGHT ?? 1920),
    thumbnailWidth: Number(process.env.UPLOAD_THUMBNAIL_WIDTH ?? 640),
    imageQuality: Number(process.env.UPLOAD_IMAGE_QUALITY ?? 82),
  },
});

