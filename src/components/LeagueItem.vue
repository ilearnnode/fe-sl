<template>
  <div
    @click="handleClick"
    class="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 hover:border-blue-400"
  >
    <h3 class="text-lg font-semibold text-gray-900 mb-2">{{ league.strLeague }}</h3>
    <p class="text-sm text-gray-600 mb-1">
      <span class="font-medium">Sport:</span> {{ league.strSport }}
    </p>
    <p v-if="league.strLeagueAlternate" class="text-sm text-gray-500 italic">
      {{ league.strLeagueAlternate }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { League } from '../types/league';

interface Props {
  league: League;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  select: [league: League]
}>();

const handleClick = () => {
  emit('select', props.league);
};
</script>