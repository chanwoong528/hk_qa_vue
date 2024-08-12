import { defineStore } from "pinia";
import { IUserInfo } from "@/types/types";

interface UserStoreState {
  loggedInUser: IUserInfo | undefined;
  isLoggedIn: boolean;
}

export const useUserStore = defineStore("user", {
  state: (): UserStoreState => {
    return {
      loggedInUser: undefined || ({} as IUserInfo) || undefined,
      isLoggedIn: true,
    };
  },
  actions: {
    setUser(user: IUserInfo) {
      this.loggedInUser = user;
      this.isLoggedIn = true;
    },
    setResetUser() {
      localStorage.removeItem("accessToken");
      this.loggedInUser = undefined;
      this.isLoggedIn = false;
    },
  },
});
