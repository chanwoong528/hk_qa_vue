<script setup lang="ts">
import DefaultLayout from "@/layout/DefaultLayout.vue";
import SwList from "@/components/list/SwList.vue";
import { storeToRefs } from "pinia";
import { useSwStore } from "@/store/swStore";
import { E_SwTypeListType } from "@/types/enum.d";

const swStore = useSwStore();
const { swTypes } = storeToRefs(swStore);
</script>

<template>
  <DefaultLayout>
    <header class="home-header">
      <p>
        <span class="acronym">Q</span>uality <span class="acronym"> I</span>mprovement &
        <span class="acronym">N</span>avigation <span class="acronym">G</span>uide
      </p>
      <h3><strong> 품질 향상</strong>과 <strong>방향성</strong>을 <strong>제시</strong>하는 가이드</h3>
    </header>
    <SwList :type="E_SwTypeListType.section" :swList="swTypes" />
  </DefaultLayout>
</template>

<style scoped lang="scss">
.home-header {
  padding: 20px 0 24px;
  display: flex;
  /* justify-content: space-between; */
  flex-direction: column;
  gap: 8px;

  h3 {
    font-family: "Noto Sans KR";
    font-size: 28px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
    letter-spacing: -0.7px;
    strong {
      font-weight: 500;
    }
  }
  p {
    font-family: "Noto Sans KR";
    font-size: 14px;
    font-style: normal;
    font-weight: 300;
    line-height: normal;
    letter-spacing: -0.6px;
    line-height: 1;
  }
}
</style>
