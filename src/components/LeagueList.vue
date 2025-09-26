<template>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    <LeagueItem
      v-for="league in leagues"
      :key="league.idLeague"
      :league="league"
      @select="$emit('select', league)"
    />
    <div v-if="leagues.length === 0" class="col-span-full text-center text-gray-500">
      No leagues found
    </div>
  </div>
</template>

<script setup lang="ts">
import type { League } from '../types/league';
import LeagueItem from './LeagueItem.vue';

interface Props {
  leagues: League[];
}

defineProps<Props>();
defineEmits<{
  select: [league: League]
}>();
</script>