// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "hkqa-client", // 실행할 앱의 이름
      script: 'serve',
      watch: true, // 파일 변경 모니터링, 파일 변동시 재시작
      exec_mode: "cluster",
      env: {
        NODE_ENV: "prod",
        PM2_SERVE_PATH: '.',
        PM2_SERVE_PORT: 3001,
        PM2_SERVE_SPA: 'true',
        PM2_SERVE_HOMEPAGE: './dist/'
      }
    }
  ]
}
