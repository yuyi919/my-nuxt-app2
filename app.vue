<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtWelcome />
  </div>
</template>
<script setup lang="ts">
let ws: WebSocket | undefined = undefined
const log = console.log
const connect = async () => {
  const isSecure = location.protocol === "https:";
  const url = (isSecure ? "wss://" : "ws://") + location.host + "/api/connect";
  if (ws) {
    log("ws", "Closing previous connection before reconnecting...");
    ws.close();
    // clear();
  }

  log("ws", "Connecting to", url, "...");
  ws = new WebSocket(url);

  ws.addEventListener("message", (event) => {
    const { user = "system", message = "" } = event.data.startsWith("{")
      ? JSON.parse(event.data)
      : { message: event.data };
    log(
      user,
      typeof message === "string" ? message : JSON.stringify(message),
    );
  });

  await new Promise((resolve) => ws!.addEventListener("open", resolve));
  log("ws", "Connected!");

  ws.addEventListener('message', (msg: any) => {
    console.log(msg.data);
  });
};
onMounted(async () => {
  connect();
})
</script>