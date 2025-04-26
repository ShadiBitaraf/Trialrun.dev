<template>
  <Card class="flex h-full w-full flex-col bg-black/50 text-white" 
        :class="{ 'col-span-2': isLarge }">
    <div class="flex h-full w-full items-center justify-center">
      <div class="text-center w-full px-6">
        <CardTitle v-if="title" class="font-kanit text-4xl font-semibold mb-4">{{ title }}</CardTitle>
        
        <p v-if="subheading" class="font-kanit text-lg mb-6 max-w-[80%] mx-auto text-white">
          {{ subheading }}
        </p>
        
        <div class="my-4">
          <slot></slot>
        </div>
        
        <Button v-if="ctaText" asChild variant="default" size="lg" 
                class="rounded-full bg-white text-black hover:translate-y-[-2px] mt-2">
          <a href="#get-started" class="font-kanit font-medium">{{ ctaText }}</a>
        </Button>
      </div>
    </div>
  </Card>
</template>

<script setup>
defineProps({
  title: String,
  subheading: String,
  ctaText: String,
  isLarge: Boolean
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;600&display=swap');

.font-kanit {
  font-family: 'Kanit', sans-serif;
}
</style>
