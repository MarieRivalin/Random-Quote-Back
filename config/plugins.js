module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: "cloudinary",
      providerOptions: {
        cloud_name: env("dceabwngj"),
        api_key: env("333851933352676"),
        api_secret: env("l1xbTQOL5YZJ830Zf_mI439kCwI"),
      },
      actionOptions: {
        upload: {},
        uploadStream: {
          timeout: 1000 * 60 * 3,
        },
        delete: {},
      },
    },
  },
});
