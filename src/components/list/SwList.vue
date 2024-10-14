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
const colors=["primary", "blue-darken-4", "primary", "blue-darken-4", "primary", "blue-darken-4", "primary", "blue-darken-4"];
</script>

<template>
  <section v-if="type === E_SwTypeListType.section">
    <div class="card-wrap">
      <v-row> 
      <v-col cols="6"  v-for="(swItem, i) in props.swList" > 
        <v-card :color="colors[i]" link variant = "tonal" class="service-home-card" :key="i" :to="`/sw-type/${swItem.swTypeId}`">
          <header class="card-header">
            <v-card-title>
              <!-- //append-icon="mdi-open-in-new" -->
              {{ swItem.typeTitle }}
            </v-card-title>

            <v-card-subtitle>
            <!--  {{ swItem.showStatus }} -->
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
            <div class="ma-2 card-desc" label v-if="!!swItem.swVersions[0]">
              
              {{ swItem.swVersions[0].versionTitle }}
            </div>
            <p class="ma-2 card-desc" v-else>현재 버전 없음</p>

            <div class="ma-2 card-date" label v-if="!!swItem.swVersions[0]?.dueDate">
              {{ swItem.swVersions[0].dueDate }}
            </div>

            <p class="ma-2 card-date" v-else>마감일 미정</p>
          </div>
        </v-card>
      </v-col> 
      </v-row> 
    </div>
  </section>
  <section v-else>
    <v-data-table :headers="headers" :items="props.swList" :sort-by="[{ key: 'createdAt', order: 'asc' }]">
    </v-data-table>
  </section>
</template>

<style scoped lang="scss">
header {
  padding: 14px 0 0;
}

.service-home-card {
  display: flex;
  flex-direction: column;
  box-shadow: none;

  .card-header {
    display: flex;
    flex-direction: row;
    gap: 12px;
    align-items: flex-end;
    border-bottom: 1px rgb(0 0 0 / 14%) solid;
    margin:0 20px;
  }

  .card-body {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 20px;
    padding: 20px 18px 28px;

  }
}

.card-wrap {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.v-card {
    width: 100%;
    .v-card-title {
        line-height: 1.2;
        padding: 0.4rem 0.2rem;
        border-bottom:2px solid currentColor;
        margin-bottom: -1px;
    }
    .v-card-subtitle {
      padding: 0;
      color: #000;
      font-weight: 500;
      line-height: 2.6;
    }
    .card-body {
      color: rgba(0,0,0,0.8);
      font-size: 16px;
      align-items: center;
    }
    .card-date {
      background:#fff;
      padding: 0 8px;
      font-size: 12px;
      line-height: 2;
      flex-shrink: 0;

    }
}

.box-wrap {
  padding: 22px 20px;
}
</style>
