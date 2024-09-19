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
    <v-list v-model:opened="openGroups">
      <v-list-item>
        <div class="title-wrap">
          <v-list-item-title>
            <h1>
              <img :src="HIQ_LOGO" alt="hiq logo" />
            </h1>
          </v-list-item-title>
          <v-btn
            v-if="loggedInUser?.role === E_Role.master"
            size="small"
            variant="outlined"
            color="primary"
            @click="openNewServiceModal = true"
          >
            서비스 등록
            <v-icon icon="mdi-plus"></v-icon>
          </v-btn>
        </div>
        <v-list-item-subtitle>
          {{ loggedInUser?.username }}
        </v-list-item-subtitle>
        <div class="side-ctrl-con">
          <p>{{ loggedInUser?.role }}</p>
          <v-btn variant="plain" icon="mdi-logout-variant" color="error" @click="onClickLogout"> </v-btn>
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
.title-wrap {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  h1 {
    img {
      width: 100%;
    }
  }
}
.side-ctrl-con {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
