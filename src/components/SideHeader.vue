<script lang="ts" setup>
import { onMounted, computed, ref } from "vue";
import { storeToRefs } from "pinia";

import { useUserStore } from "@/store/userStore";
import { NAV_LIST } from "@/router/index.ts";

import { E_Role } from "@/types/enum.d";
import { swApi } from "@/services/domain/swService";
import { useSwStore } from "@/store/swStore";
import { ISwType } from "@/types/types";

import ModalWrap from "@/components/ModalWrap.vue";
import NewServiceForm from "@/components/form/NewServiceForm.vue";
import { watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import HIQ_LOGO from "@/assets/hiq_logo_text_black.svg";

const route = useRoute();
const router = useRouter();
const store = useUserStore();
const { loggedInUser } = storeToRefs(store);

const swStore = useSwStore();
const { swTypes } = storeToRefs(swStore);

const openGroups = ref<string[]>([]);
const openNewServiceModal = ref<boolean>(false);

onMounted(() => {
  if (route.path === "/login" && !!loggedInUser.value?.id) return router.push("/");

  if (!!loggedInUser.value?.id) return fetchSw();
});

watch(
  () => [route.path, loggedInUser.value?.id],
  ([newPath, newUserId]) => {
    if (!!newUserId) return fetchSw();
  },
);

const fetchSw = () => {
  return swApi.GET_sw().then((swListRes) => {
    return swStore.setSwTypes(swListRes as ISwType[]);
  });
};
const computedNavList = computed(() => {
  const filterHiddenNavList = NAV_LIST.filter((navItem) => !navItem.meta.hidden);

  if (!loggedInUser.value) return filterHiddenNavList;

  if (loggedInUser.value?.role === E_Role.master) return filterHiddenNavList;

  if (loggedInUser.value?.role === E_Role.admin) {
    return filterHiddenNavList.filter((navItem) => !navItem.meta.requiresMaster);
  }

  if (loggedInUser.value?.role === E_Role.tester) {
    return filterHiddenNavList.filter((navItem) => !navItem.meta.requiresAdmin && !navItem.meta.requiresMaster);
  }
});

const onClickLogout = () => {
  store.setResetUser();

  return router.push("/login");
};
const onSubmitNewService = (title: string, desc: string) => {
  return swApi.POST_sw({ typeTitle: title, typeDesc: desc }).then((res) => {
    fetchSw();
    openNewServiceModal.value = false;
  });
};
</script>

<template>
  <ModalWrap v-model="openNewServiceModal" title="New Service">
    <NewServiceForm @onSubmitNewService="onSubmitNewService" />
  </ModalWrap>
  <v-navigation-drawer permanent>
    <v-list v-model:opened="openGroups" class="navigation-list">
      <v-list-item style="background: #303b87;">
        <div class="title-wrap">
          <v-list-item-title>
            <h1>
              <a href="/">
                <img :src="HIQ_LOGO" alt="qing logo" />
              </a>
            </h1>
          </v-list-item-title>
          <v-btn
            v-if="loggedInUser?.role === E_Role.master"
            size="small"
            variant="outlined"
            color="primary"
            @click="openNewServiceModal = true"
            class="service-create"
          >
            서비스
            <v-icon icon="mdi-plus"></v-icon>
          </v-btn>
        </div>
        
        <div class="user-wrap">
          {{ loggedInUser?.username }} ({{ loggedInUser?.role }})
          <v-btn variant="plain" icon="mdi-logout-variant" color="error" @click="onClickLogout" />
        </div>
      </v-list-item>

      <v-divider />

      <template v-for="navItem in computedNavList">
        <v-list-item
          :key="navItem.label"
          link
          :to="navItem.path"
          v-if="!!navItem.meta.requiresAuth && !(navItem.code === 'SW Type Detail')"
        >
          {{ navItem.label }}
        </v-list-item>

        <v-list-group v-else-if="!!(navItem.code === 'SW Type Detail')" v-model="openGroups" :value="navItem.label">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" :title="navItem.label"></v-list-item>
          </template>
          <v-list-item
            v-for="swType in swTypes"
            :key="navItem.directTo + swType.swTypeId"
            link
            :to="navItem.directTo + swType.swTypeId"
            :title="swType.typeTitle"
            :value="swType.typeTitle"
          >
            <!-- :active="route.path === navItem.directTo + swType.swTypeId" -->
          </v-list-item>
        </v-list-group>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>

<style lang="scss" scoped>
.navigation-list {
  padding: 0;
}
.title-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5px;
  flex-direction: column;
  padding: 30px 40px 10px 0;
  .service-create {
    position: absolute;
    right: 20px;
    top: 20px;
  }
  h1 {
    width: 70px;
    img {
      width: 100%;
    }
  }
}

.user-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.6);
}
</style>
