<template>
  <div class="w-full" data-testid="search-bar">
    <input
      :value="modelValue"
      @input="handleInput"
      type="text"
      placeholder="Search leagues..."
      class="w-full h-10 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      data-testid="search-input"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: string;
}

defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>();

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('update:modelValue', target.value);
};
</script>