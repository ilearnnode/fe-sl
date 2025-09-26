<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <div class="container mx-auto px-4 py-8">
      <header class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Sports Leagues</h1>
      </header>

      <main>
        <div v-if="loading" class="flex justify-center py-12">
          <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        </div>

        <div v-else-if="error" class="text-center py-12">
          <p class="text-red-600 text-lg">{{ error }}</p>
          <button
            @click="fetchLeagues"
            class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>

        <div v-else>
          <div class="flex flex-col md:flex-row gap-4 mb-6">
            <div class="flex-1">
              <SearchBar v-model="searchTerm" />
            </div>
            <SportFilter
              v-model="selectedSport"
              :sports="uniqueSports"
            />
          </div>

          <LeagueList
            :leagues="filteredLeagues"
            @select="handleLeagueSelect"
          />
        </div>
      </main>
    </div>

    <BadgeModal
      :isOpen="isLeagueModalOpen"
      :league="selectedLeague"
      @close="closeModal"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import type { League } from './types/league';
import { apiService } from './services/api';
import LeagueList from './components/LeagueList.vue';
import SearchBar from './components/SearchBar.vue';
import SportFilter from './components/SportFilter.vue';
import BadgeModal from './components/BadgeModal.vue';

const leagues = ref<League[]>([]);
const loading = ref(false);
const error = ref('');
const searchTerm = ref('');
const selectedSport = ref('');
const selectedLeague = ref<League | null>(null);
const isLeagueModalOpen = ref(false);

const uniqueSports = computed(() => {
  const sports = new Set(leagues.value.map(league => league.strSport));
  return Array.from(sports).sort();
});

const filteredLeagues = computed(() => {
  let result = leagues.value;

  if (searchTerm.value) {
    const search = searchTerm.value.toLowerCase();
    result = result.filter(league =>
      league.strLeague.toLowerCase().includes(search) ||
      league.strLeagueAlternate?.toLowerCase().includes(search)
    );
  }

  if (selectedSport.value) {
    result = result.filter(league => league.strSport === selectedSport.value);
  }

  return result;
});

const fetchLeagues = async () => {
  loading.value = true;
  error.value = '';

  try {
    leagues.value = await apiService.getAllLeagues();
  } catch (err) {
    error.value = 'Failed to load leagues. Please try again.';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const handleLeagueSelect = (league: League) => {
  selectedLeague.value = league;
  isLeagueModalOpen.value = true;
};

const closeModal = () => {
  isLeagueModalOpen.value = false;
  setTimeout(() => {
    selectedLeague.value = null;
  }, 300);
};

onMounted(() => {
  fetchLeagues();
});
</script>