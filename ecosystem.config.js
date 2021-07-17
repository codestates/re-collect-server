module.exports = {
  apps : [{
    name   : "server",
    script : "./bin/app.js",
    env_production: {
      NODE_ENV: 'production'
    },
    instances: 2,
    exec_mode: 'cluster',
    watch: true,
    env_development: {
      NODE_ENV: 'development'
    }
  },{
    name: 'cron',
    script: './controller/mailCtrl.js',
    env_production: {
      NODE_ENV: 'production'
    },
    instances: 1,
    exec_mode: 'fork',
    watch: true,
    cron_restart: "0,30 * * * *",
    autorestart: false,
  }]
}

