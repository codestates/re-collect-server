module.exports = {
  apps : [{
    name   : "server",
    script : "./bin/app.js",
    env_production: {
      NODE_ENV: 'production'
    },
    env_development: {
      NODE_ENV: 'development'
    }
  },{
    name: 'cron',
    script: './controller/mailCtrl.js',
    env_production: {
      NODE_ENV: 'production'
    },
    instance: 1,
    exec_mode: 'fork',
    watch: true,
    cron_restart: "0,30 * * * *",
    autorestart: false,
  }]
}

