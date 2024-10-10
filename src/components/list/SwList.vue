<script setup lang="ts">
import type { ISwType } from "@/types/types";
import { E_SwTypeListType } from "@/types/enum.d";
import { PropType, ref } from "vue";

const props = defineProps({
  swList: {
    type: Array as () => ISwType[],
  },
  type: {
    type: String as PropType<E_SwTypeListType>,
    required: false,
  },
});

const headers = ref([
  {
    title: "Email",
    align: "start",
    sortable: false,
    key: "email",
  },
  { title: "Username", key: "username" },
  { title: "Created Date ", key: "createdAt" },
  { title: "Role/Status", key: "actions", sortable: false },
] as const);
</script>

<template>
  <section v-if="type === E_SwTypeListType.section">
    <header>
      <h4>현재 한국일보 서비스 리스트</h4>
    </header>
    <!-- <v-row cols="12" md="4"> -->
    <!-- <v-col  col="1"> -->
    <div class="card-wrap">
      <v-card v-for="swItem in props.swList" :key="swItem.swTypeId" :to="`/sw-type/${swItem.swTypeId}`"
        link class="service-home-card">

        <header class="card-header">
          <v-card-title>
            <!-- //append-icon="mdi-open-in-new" -->
            {{ swItem.typeTitle }}
          </v-card-title>

          <v-card-subtitle>
            {{ swItem.showStatus }}
            <p>{{ swItem.typeDesc }}</p>
          </v-card-subtitle>
        </header>
        <!-- 
        <v-card-text class="card-body">
          <v-chip class="ma-2" color="pink" label v-if="!!swItem.swVersions[0]">
            <v-icon icon="mdi-label" start></v-icon>
            {{ swItem.swVersions[0].versionTitle }}
          </v-chip>
          <p v-else>현재 버전 없음</p>

          <v-chip class="ma-2" color="teal" label v-if="!!swItem.swVersions[0]?.dueDate">
            <v-icon icon="mdi mdi-calendar-check" start></v-icon>
            {{ swItem.swVersions[0].dueDate }}
          </v-chip>

          <p v-else>마감일 미정</p>

        </v-card-text> -->
        <div class="card-body">
          <v-chip class="ma-2" color="pink" label v-if="!!swItem.swVersions[0]">
            <v-icon icon="mdi-label" start></v-icon>
            {{ swItem.swVersions[0].versionTitle }}
          </v-chip>
          <p v-else>현재 버전 없음</p>

          <v-chip class="ma-2" color="teal" label v-if="!!swItem.swVersions[0]?.dueDate">
            <v-icon icon="mdi mdi-calendar-check" start></v-icon>
            {{ swItem.swVersions[0].dueDate }}
          </v-chip>

          <p v-else>마감일 미정</p>
        </div>


      </v-card>
    </div>
    <!-- </v-col> -->
    <!-- </v-row> -->
  </section>
  <section v-else>
    <v-data-table :headers="headers" :items="props.swList" :sort-by="[{ key: 'createdAt', order: 'asc' }]">
    </v-data-table>
  </section>
</template>

<style scoped lang="scss">
header {
  padding: 10px 0;
}

.service-home-card {

  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;

  .card-header {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .card-body {

    display: flex;
    flex-direction: column;
    gap: 20px;
  }
}

.card-wrap {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
