<template>
  <div class="w-full md:w-auto" data-testid="sport-filter">
    <select
      :value="modelValue"
      @change="handleChange"
      class="w-full h-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
      data-testid="sport-select"
    >
      <option value="">All Sports</option>
      <option v-for="sport in sports" :key="sport" :value="sport">
        {{ sport }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string;
  sports: string[];
}

defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>();

const handleChange = (event: Event) => {
  const target = event.target as HTMLSelectElement;
  emit('update:modelValue', target.value);
};
</script>