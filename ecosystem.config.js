// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: "hkqa-client", // 실행할 앱의 이름
      script: 'serve',
      args: 'dist/ 3001 --spa',
      watch: true, // 파일 변경 모니터링, 파일 변동시 재시작
      exec_mode: "cluster",
      env: {
        "PORT": 3001,
        "NODE_ENV": "prod"
      }
    }
  ]
}