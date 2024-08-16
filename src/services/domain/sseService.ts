
import { Reactive, } from "vue";
import { DEV_BASE_RESTAPI } from "../http";




export const sseApi = () => {
  let eventSource: EventSource;

  function onMsg(id: string, sseTrigger: Reactive<{ type: string, date: string }>) {
    eventSource = new EventSource(`${DEV_BASE_RESTAPI}/sse/post-comment/${id}`);
    return eventSource.onmessage = function (e) {
      const data = JSON.parse(e.data);
      const triggerData = { type: data.type, date: new Date().toISOString() }
      Object.assign(sseTrigger, triggerData)
      console.log(triggerData)

      return data
    }
  }
  function close() {
    eventSource.close();
  }
  return {
    onMsg: onMsg,
    close: close
  }
}