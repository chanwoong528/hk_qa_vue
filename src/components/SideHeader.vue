<script lang="ts" setup>
import { onMounted, computed, ref } from "vue";
import { storeToRefs } from "pinia";

import { NAV_LIST } from "@/router/index.ts";
import { useUserStore } from "@/store/userStore";

import { E_Role } from "@/types/enum.d";
import { swApi } from "@/services/domain/swService";
import { useSwStore } from "@/store/swStore";
import { ISwType } from "@/types/types";

const store = useUserStore();
const { loggedInUser } = storeToRefs(store);
const swStore = useSwStore();
const { swTypes } = storeToRefs(swStore);

const openGroups = ref<string[]>([]);

onMounted(() => {
  swApi
    .GET_sw()
    .then((swListRes) => swStore.setSwTypes(swListRes as ISwType[]));
});

const computedNavList = computed(() => {
  if (!loggedInUser) return NAV_LIST;

  if (loggedInUser.value?.role === E_Role.master) return NAV_LIST;

  if (loggedInUser.value?.role === E_Role.admin)
    return NAV_LIST.filter((navItem) => !navItem.meta.requiresMaster);

  if (loggedInUser.value?.role === E_Role.tester)
    return NAV_LIST.filter(
      (navItem) => !navItem.meta.requiresAdmin || !navItem.meta.requiresMaster
    );
});
</script>

<template>
  <v-navigation-drawer permanent>
    <v-list v-model:opened="openGroups">
      <v-list-item title="HK QA TEST" :subtitle="loggedInUser?.username">
        <p>{{ loggedInUser?.role }}</p>
      </v-list-item>
      <v-divider></v-divider>
      <template v-for="navItem in computedNavList" x>
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
            :key="i"
            link
            :to="navItem.directTo + swType.swTypeId"
            :title="swType.typeTitle"
            :value="swType.typeTitle"
          ></v-list-item>
        </v-list-group>
      </template>
    </v-list>
  </v-navigation-drawer>
</template>
