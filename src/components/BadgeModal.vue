<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          class="fixed inset-0 bg-black bg-opacity-50"
          @click="$emit('close')"
        ></div>

        <div class="relative bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
          <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
            <h2 class="text-xl font-semibold text-gray-900">
              {{ league?.strLeague }} - Season Badges
            </h2>
            <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div class="px-6 py-4 min-h-[300px] flex items-center justify-center">
            <div v-if="loading" class="flex flex-col items-center">
              <div class="animate-pulse bg-gray-200 rounded-lg w-48 h-48 mb-4"></div>
              <div class="animate-pulse bg-gray-200 rounded h-4 w-32"></div>
            </div>

            <div v-else-if="error" class="text-center">
              <p class="text-red-600">{{ error }}</p>
            </div>

            <div v-else-if="seasons.length === 0" class="text-center">
              <p class="text-gray-500">No season badges available</p>
            </div>

            <div v-else-if="latestSeasonWithBadge" class="flex flex-col items-center w-full">
              <p class="text-sm font-medium text-gray-700 mb-4">{{ latestSeasonWithBadge.strSeason }}</p>
              <div class="relative w-48 h-48 flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 p-4">
                <img
                  :src="latestSeasonWithBadge.strBadge"
                  :alt="`${latestSeasonWithBadge.strSeason} badge`"
                  class="max-w-full max-h-full object-contain drop-shadow-md"
                  @load="imageLoaded = true"
                  @error="handleImageError"
                  :class="{ 'opacity-0': !imageLoaded, 'opacity-100': imageLoaded }"
                  style="transition: opacity 0.3s ease"
                />
                <div v-if="!imageLoaded" class="absolute inset-4 animate-pulse bg-gray-200 rounded"></div>
              </div>
            </div>

            <div v-else class="text-center">
              <p class="text-gray-500">No season badge available</p>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { League, Season } from '../services/api.types';
import { apiService } from '../services/api';

interface Props {
  isOpen: boolean;
  league: League | null;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  close: []
}>();

const seasons = ref<Season[]>([]);
const loading = ref(false);
const error = ref('');
const imageLoaded = ref(false);

const latestSeasonWithBadge = computed(() => {
  const withBadges = seasons.value.filter(season => season.strBadge);
  return withBadges.length > 0 ? withBadges[withBadges.length - 1] : null;
});

const fetchSeasonBadges = async () => {
  if (!props.league) return;

  loading.value = true;
  error.value = '';

  try {
    const data = await apiService.getSeasonBadges(props.league.idLeague);
    seasons.value = data;
  } catch (err) {
    error.value = 'Failed to load season badges';
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  target.style.display = 'none';
};

watch(() => props.isOpen, (newVal) => {
  if (newVal && props.league) {
    imageLoaded.value = false;
    fetchSeasonBadges();
  } else {
    seasons.value = [];
    error.value = '';
    imageLoaded.value = false;
  }
});
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>