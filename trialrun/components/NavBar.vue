<template>
  <div class="fixed top-0 left-1/2 z-50 w-4/5 -translate-x-1/2 mt-4">
    <nav class="flex items-center justify-between rounded-xl bg-black/50 px-8 py-4">
      <div class="flex items-center">
        <img src="/logo.png" alt="TrialRun Logo" class="h-10 mr-4" />
        <span class="font-kanit text-3xl font-semibold text-white">trialrun</span>
      </div>
      
      <div class="flex gap-8">
        <a href="https://jetskiai.notion.site/sandbox-ai?pvs=4" 
           class="font-kanit text-xl text-white hover:opacity-80 transition-opacity">
          litepaper
        </a>
        <a href="#showcase" 
           class="font-kanit text-xl text-white hover:opacity-80 transition-opacity">
          Showcase
        </a>
      </div>
      
      <div>
        <Button asChild variant="default" size="lg" class="rounded-full bg-white text-black hover:translate-y-[-2px]">
          <a href="https://app.trialrun.dev" class="font-kanit font-medium">get started</a>
        </Button>
      </div>
    </nav>
  </div>
</template>

<script setup>
// No props or additional setup needed
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;600&display=swap');

.font-kanit {
  font-family: 'Kanit', sans-serif;
}
</style>
