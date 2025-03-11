import { defineStore } from "pinia";

import { ISwVersion } from "@/types/types";

interface SwVersionsStoreState {
  swVersions: ISwVersion[];
}

export const useSwVersionsStore = defineStore("swVersions", {
  state: (): SwVersionsStoreState => {
    return {
      swVersions: [],
    };
  },
  actions: {
    setSwVersions(swVersions: ISwVersion[]) {
      this.swVersions = swVersions;
    },
    updateSwVersionById(swVersionId: string, key: keyof ISwVersion, value: any) {
      const index = this.swVersions.findIndex(swVersion => swVersion.swVersionId === swVersionId);
      if (index !== -1) {
        this.swVersions[index][key] = value;
      }
    },
  },
});
