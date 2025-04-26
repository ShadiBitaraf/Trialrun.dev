<template>
  <div class="relative min-h-screen w-full bg-gradient-to-b from-[#FF8A3D] from-75% to-black to-100%">
    <!-- Shapes at the bottom -->
    <div class="absolute bottom-0 right-[10%] z-[1] h-[30vh] w-[30vh] bg-black"></div>
    <div class="absolute bottom-0 left-1/2 z-[2] h-[30vh] w-[30vh] -translate-x-1/2 rounded-full bg-black"></div>
    <div class="absolute bottom-0 left-[5%] z-[3] h-0 w-0 origin-bottom-left -rotate-90 border-b-[30vh] border-l-[15vh] border-r-[15vh] border-b-black border-l-transparent border-r-transparent bg-transparent"></div>
    
    <div class="relative z-10">
      <NavBar />
      
      <div class="box-border px-16 pt-24 pb-8 h-[calc(100vh-2rem)]">
        <div class="grid h-full w-4/5 grid-cols-2 grid-rows-2 gap-8 mx-auto mt-8 px-12">
          <HeroCard 
            title="Embeddable Playgrounds for AI Demos" 
            subheading="Boost conversions with an AI playground on your landing page. Interact with MCPs running in a sandboxed environment." 
            ctaText="Get Started"
          />
          <PlaceHolderCard />
          <!-- Widget container -->
          <div class="col-span-2 h-full w-full" ref="widgetContainer"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const widgetContainer = ref(null);

onMounted(() => {
  // Load the script
  const script = document.createElement('script');
  script.src = 'https://trialruncdn.fly.storage.tigris.dev/trialrun-widget.umd.cjs';
  script.async = true;
  
  // Create the widget element after script loads
  script.onload = () => {
    const widget = document.createElement('trialrun-widget');
    widget.setAttribute('sandbox-id', '0CEYqkczEOuDhdfTHPAh');
    widget.setAttribute('playground-width', '100%');
    widget.setAttribute('playground-height', '500px');
    
    // Add the widget to the container
    if (widgetContainer.value) {
      widgetContainer.value.appendChild(widget);
    }
  };
  
  // Add the script to the document
  document.head.appendChild(script);
});
</script>

<style>
html, body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow-x: hidden;
  font-family: 'Kanit', sans-serif;
}

@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@400;500;600&display=swap');
</style>
