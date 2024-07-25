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
import { useRoute } from "vue-router";
import ResetPwForm from "./form/ResetPwForm.vue";
const route = useRoute();

const store = useUserStore();
const { loggedInUser } = storeToRefs(store);

const swStore = useSwStore();
const { swTypes } = storeToRefs(swStore);

const openGroups = ref<string[]>([]);
const openNewServiceModal = ref<boolean>(false);

onMounted(() => {
  if (!!loggedInUser.value?.id) return fetchSw();
});

watch(
  () => [route.path, loggedInUser.value?.id],
  ([newPath, newUserId]) => {
    if (!!newUserId) return fetchSw();
  }
);

const fetchSw = () => {
  return swApi.GET_sw().then((swListRes) => {
    return swStore.setSwTypes(swListRes as ISwType[]);
  });
};
const computedNavList = computed(() => {
  if (!loggedInUser.value) return NAV_LIST;

  if (loggedInUser.value?.role === E_Role.master) return NAV_LIST;

  if (loggedInUser.value?.role === E_Role.admin) {
    return NAV_LIST.filter((navItem) => !navItem.meta.requiresMaster);
  }

  if (loggedInUser.value?.role === E_Role.tester) {
    return NAV_LIST.filter(
      (navItem) => !navItem.meta.requiresAdmin && !navItem.meta.requiresMaster
    );
  }
});

const openResetPwModal = computed(() => {
  if (!!loggedInUser.value?.isPwDefault) return true;

  return false;
});

const onSubmitNewService = (title: string, desc: string) => {
  return swApi.POST_sw({ typeTitle: title, typeDesc: desc }).then((res) => {
    fetchSw();
  });
};
</script>

<template>
  <ModalWrap v-model="openResetPwModal" title="Reset Password">
    <ResetPwForm />
  </ModalWrap>
  <ModalWrap v-model="openNewServiceModal" title="New Service">
    <NewServiceForm @onSubmitNewService="onSubmitNewService" />
  </ModalWrap>
  <v-navigation-drawer permanent>
    <v-list v-model:opened="openGroups">
      <v-list-item>
        <div class="title-wrap">
          <v-list-item-title>HK QA TEST </v-list-item-title>
          <v-btn
            v-if="loggedInUser?.role === E_Role.master"
            size="x-small"
            variant="outlined"
            color="primary"
            @click="openNewServiceModal = true"
          >
            New Service
            <v-icon icon="mdi-plus"></v-icon>
          </v-btn>
        </div>
        <v-list-item-subtitle>
          {{ loggedInUser?.username }}
        </v-list-item-subtitle>
        <p>{{ loggedInUser?.role }}</p>
      </v-list-item>

      <v-divider />

      <template v-for="navItem in computedNavList">
        <v-list-item
          :key="navItem.label"
          link
          :to="navItem.path"
          v-if="
            !!navItem.meta.requiresAuth && !(navItem.label === 'SW Type Detail')
          "
        >
          {{ navItem.label }}
        </v-list-item>

        <v-list-group
          v-else-if="!!(navItem.label === 'SW Type Detail')"
          v-model="openGroups"
          :value="navItem.label"
        >
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" :title="navItem.label"></v-list-item>
          </template>

          <v-list-item
            v-for="(swType, i) in swTypes"
            :key="swType.swTypeId + i"
            link
            :to="navItem.directTo + swType.swTypeId"
            :title="swType.typeTitle"
            :value="swType.typeTitle"
          >
            <!-- <RouterLink :to="navItem.directTo + swType.swTypeId" c>
              {{ swType.typeTitle }}
            </RouterLink> -->
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
}
</style>
