import { IUserInfo } from "@/types/types";
import { defineStore } from "pinia";

interface UserStoreState {

  user: IUserInfo | undefined;

}

export const useUserStore = defineStore("user", {
  state: (): UserStoreState => {
    return {
      user: undefined || {} as IUserInfo || undefined,
    };
  },
  actions: {
    setUser(user: IUserInfo) {
      this.user = user;
    },
  },
});
