// import { ref } from "vue";
// import { io } from "socket.io-client";

// // 브로드캐스팅 받은 데이터 구분을 위한 id
// export const id = ref(Math.random().toString())
// // 받은 데이터를 수집
// export const chatMessages = ref([])
// // 연결 상태
// export const connected = ref(false)

// const socketAddr = process.env.NODE_ENV === "dev"
//   ? "http://localhost:3001"
//   : "http://localhost:3001";


// export const socket = io(socketAddr)

// socket.on("connect", () => {
//   connected.value = true;
// });

// socket.on("disconnect", () => {
//   connected.value = false;
// });

// // 메시지를 받으면 채팅 메시지 데이터에 푸시
// socket.on('ServerToClient', (data) => {
//   console.log(data)
//   chatMessages.value.push(data)
// })

// socket.on('joined', (data) => {
//   console.log("!!! ", data)
//   chatMessages.value.push(data)
// })