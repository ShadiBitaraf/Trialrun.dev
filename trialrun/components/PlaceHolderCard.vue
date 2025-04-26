<template>
  <Card class="flex h-full w-full flex-col items-center justify-center bg-white/50 p-0 text-center text-white" 
        :class="{ 'col-span-2': isLarge, [customClass]: customClass }">
    <CardHeader v-if="title" class="space-y-2">
      <CardTitle class="font-kanit text-2xl font-semibold">{{ title }}</CardTitle>
      <CardDescription v-if="subheading" class="font-kanit text-lg max-w-[80%] mx-auto text-white">
        {{ subheading }}
      </CardDescription>
    </CardHeader>
    <CardContent class="pb-6">
      <slot></slot>
    </CardContent>
    <CardFooter v-if="ctaText">
      <Button asChild variant="default" size="lg" class="rounded-full bg-white text-black hover:translate-y-[-2px]">
        <a href="#get-started" class="font-kanit font-medium">{{ ctaText }}</a>
      </Button>
    </CardFooter>
  </Card>
</template>

<script setup>
defineProps({
  title: String,
  subheading: String,
  ctaText: String,
  isLarge: Boolean,
  customClass: String
});
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;600&display=swap');

.font-kanit {
  font-family: 'Kanit', sans-serif;
}
</style>
