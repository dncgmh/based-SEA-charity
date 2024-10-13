export const config = {
  app: {
    port: process.env.PORT,
    display: {
      featuredCharities: 6,
      featureProjects: 6,
    },
  },
  db: {
    mongoUri: process.env.MONGO_URI,
    redisUri: process.env.REDIS_URI,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXP,
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  provider: {
    webSoket: process.env.WEBSOCKET_PROVIDER,
  },
  basescan: {
    url: process.env.BASESCAN_URL,
    apiKey: process.env.BASESCAN_API_KEY,
  },
};
