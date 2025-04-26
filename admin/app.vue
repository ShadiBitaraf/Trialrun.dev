<template>
  <div class="min-h-screen bg-gray-50">
    <header class="bg-primary shadow-md">
      <div class="container mx-auto px-4 py-3">
        <h1 class="text-white text-xl font-bold">Trialrun Dashboard</h1>
      </div>
    </header>
    
    <main class="container mx-auto p-4">
      <Tabs v-model="activeTab" class="w-full" @update:modelValue="handleTabChange">
        <TabsList class="mb-4">
          <TabsTrigger value="list">Demo Configs List</TabsTrigger>
          <TabsTrigger value="create">Create/Edit Demo Config</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <div class="mb-4">
            <button 
              @click="createNewConfig" 
              class="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90"
            >
              Create New Demo Config
            </button>
          </div>
          <DemoConfigList @edit="editConfig" ref="configList" />
        </TabsContent>
        <TabsContent value="create">
          <DemoConfigForm :config="currentConfig" @saved="handleSaved" @cancelled="handleCancelled" />
        </TabsContent>
      </Tabs>
    </main>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

// Set the primary color for the UI components
const appConfig = useAppConfig()
appConfig.ui = appConfig.ui || {}
appConfig.ui.primary = '#FF8A3D'

// State for the current config being edited
const currentConfig = ref(null)
const activeTab = ref('list')
const configList = ref(null)

// Watch for tab changes
function handleTabChange(newTab) {
  // If switching away from create tab, clear the current config
  if (newTab === 'list' && currentConfig.value !== null) {
    currentConfig.value = null
  }
}

// Function to create a new config
function createNewConfig() {
  currentConfig.value = null
  activeTab.value = 'create'
}

// Function to handle editing a config
function editConfig(config) {
  currentConfig.value = { ...config } // Use a copy to avoid reference issues
  activeTab.value = 'create'
}

// Function to handle after a config is saved
function handleSaved() {
  currentConfig.value = null
  activeTab.value = 'list'
  
  // Refresh the list
  if (configList.value) {
    configList.value.refreshConfigs()
  }
}

// Function to handle when editing is cancelled
function handleCancelled() {
  currentConfig.value = null
  activeTab.value = 'list'
}
</script>
