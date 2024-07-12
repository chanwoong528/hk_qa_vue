import { defineStore } from "pinia";

import type { ISwType } from "@/types/types";

interface SwStoreState {
  swTypes: ISwType[];
}



export const useSwStore = defineStore("sw", {

  state: (): SwStoreState => {
    return {
      swTypes: undefined || ({} as ISwType[]) || undefined,
    }
  },
  actions: {
    setSwTypes(swTypes: ISwType[]) {
      this.swTypes = swTypes
    }
  }
})


