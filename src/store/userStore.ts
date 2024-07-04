import { IUserInfo } from "@/types/types";
import { defineStore } from "pinia";

interface UserStoreState {
  user: IUserInfo | undefined;
  isLoggedIn: boolean;
}

export const useUserStore = defineStore("user", {
  state: (): UserStoreState => {
    return {
      user: undefined || ({} as IUserInfo) || undefined,
      isLoggedIn: true,
    };
  },
  actions: {
    setUser(user: IUserInfo) {
      this.user = user;
      this.isLoggedIn = true;
    },
    setResetUser() {
      this.user = undefined;
      this.isLoggedIn = false;
    },
  },
});
