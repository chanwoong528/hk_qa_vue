import { defineStore } from "pinia";

import { UserClass } from "@/entity/User";

interface UserStoreState {
  loggedInUser: UserClass | undefined;
  isLoggedIn: boolean;
}

export const useUserStore = defineStore("user", {
  state: (): UserStoreState => {
    return {
      loggedInUser: undefined,
      isLoggedIn: true,
    };
  },
  actions: {
    setUser(user: UserClass) {
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
