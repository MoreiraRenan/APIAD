module.exports = {
    apps: [
      {
        name: 'API AD',
        script: 'dist/main.js',
        watch: ['server', 'client'],
        ignore_watch: ['node_modules', 'anexos'],
        watch_options: {
          followSymlinks: false,
        },
        env: {
          PORT: 4004,
          NODE_ENV: 'production',
        },
      },
    ],
  };