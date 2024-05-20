<script setup lang="ts">
//
import { routes } from "@/router/index.ts";
</script>

<template>
  <h1>Hello App!</h1>
  <p><strong>Current route path:</strong> {{ $route.fullPath }}</p>
  <nav>
    <ul>
      <li v-for="route in routes">
        <RouterLink :to="route.path"> {{ route.label }}</RouterLink>
      </li>
    </ul>
  </nav>
</template>
