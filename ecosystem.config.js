module.exports = {
  apps: [
    {
      name: "lulu-bot",
      script: "dist/index.js",
      args: "--no-sandbox",
      node_args: "--max-old-space-size=8192",
      watch: false,
      autorestart: false,
      log_date_format: "YYYY-MM-DD HH:mm:ss.SSS",
      max_memory_restart: "2G",
      env: {
        NODE_ENV: "production",
      },
    },
  ],
};
