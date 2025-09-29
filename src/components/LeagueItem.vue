<template>
  <div
    class="p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 hover:border-blue-400"
    data-testid="league-item"
  >
    <h3 class="text-lg font-semibold text-gray-900 mb-2" data-testid="league-name">{{ league.strLeague }}</h3>
    <p class="text-sm text-gray-600 mb-1">
      <span class="font-medium">Sport:</span> <span data-testid="league-sport">{{ league.strSport }}</span>
    </p>
    <p v-if="league.strLeagueAlternate" class="text-sm text-gray-500 italic" data-testid="league-alternate">
      {{ league.strLeagueAlternate }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { League } from '../services/api.types';

interface Props {
  league: League;
}

defineProps<Props>();
</script>