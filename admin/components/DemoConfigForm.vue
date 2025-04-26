<template>
  <div class="bg-white rounded-lg shadow-md p-6">
    <h2 class="text-xl font-bold mb-6">{{ isEditing ? 'Edit' : 'Create' }} MCP Config</h2>
    
    <!-- Step indicator -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div 
          v-for="(step, index) in steps" 
          :key="step.id" 
          class="flex flex-col items-center"
          :class="index < steps.length - 1 ? 'w-1/3' : ''"
        >
          <div class="flex items-center w-full">
            <div 
              class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
              :class="currentStep >= index ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'"
            >
              {{ index + 1 }}
            </div>
            <div 
              v-if="index < steps.length - 1" 
              class="flex-1 h-1 mx-2"
              :class="currentStep > index ? 'bg-blue-600' : 'bg-gray-200'"
            ></div>
          </div>
          <span class="text-xs mt-1">{{ step.name }}</span>
        </div>
      </div>
    </div>
    
    <form @submit.prevent="handleSubmit">
      <!-- Step 1: Basic Configuration -->
      <div v-if="currentStep === 0" class="space-y-4">
        <!-- Basic configuration fields (unchanged) -->
        <div class="grid grid-cols-1 gap-4">
          <div class="space-y-2">
            <Label for="name">Name <span class="text-red-500">*</span></Label>
            <Input id="name" v-model="form.name" required placeholder="Enter configuration name" />
          </div>
          
          <div class="space-y-2">
            <Label for="description">Description <span class="text-red-500">*</span></Label>
            <Textarea 
              id="description" 
              v-model="form.description" 
              required
              placeholder="Enter configuration description"
              rows="3"
            />
          </div>
          
          <div class="space-y-2">
            <Label for="systemPrompt">System Prompt <span class="text-red-500">*</span></Label>
            <Textarea 
              id="systemPrompt" 
              v-model="form.systemPrompt" 
              required
              placeholder="Enter system prompt"
              rows="4"
            />
          </div>
          
          <div class="space-y-2">
            <div class="flex justify-between items-center">
              <Label for="settings">Settings (JSON) <span class="text-red-500">*</span></Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                @click="formatJson"
                class="text-xs"
              >
                Format JSON
              </Button>
            </div>
            <Textarea 
              id="settings" 
              v-model="settingsJson" 
              required
              placeholder="Enter MCP configuration"
              rows="12"
              class="font-mono text-sm"
              :class="{
                'border-red-500 focus:ring-red-500 focus:border-red-500': jsonError,
                'border-green-500 focus:ring-green-500 focus:border-green-500': !jsonError && settingsJson.trim().length > 0
              }"
              @input="validateJsonLive"
            />
            <p v-if="jsonError" class="text-red-500 text-sm">{{ jsonError }}</p>
            <p class="text-xs text-gray-500 mt-1">
              Configure MCP servers with either URL or command+args. Example:
              <code class="block bg-gray-100 p-2 mt-1 rounded text-xs overflow-x-auto">
{
  "mcpServers": {
    "weather": {
      "url": "https://api.weather.example.com"
    },
    "chatbot": {
      "command": "uv",
      "args": ["--directory", "/path/to/chatbot-server", "run", "server.py"],
      "github": "https://github.com/example/chatbot"
    }
  }
}
              </code>
            </p>
          </div>
          
          <div class="space-y-2">
            <Label for="isActive">Status <span class="text-red-500">*</span></Label>
            <div class="flex items-center space-x-2">
              <Switch id="isActive" v-model="form.isActive" required />
              <Label for="isActive">{{ form.isActive ? 'Active' : 'Inactive' }}</Label>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Step 2: Customization -->
      <div v-if="currentStep === 1" class="space-y-6">
        <!-- Customization fields (unchanged) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Color pickers -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium">Customize Colors</h3>
            
            <div class="space-y-3">
              <div class="space-y-2">
                <Label for="botMessageColor">Bot Messages <span class="text-red-500">*</span></Label>
                <div class="flex items-center space-x-2">
                  <div 
                    class="w-8 h-8 rounded border cursor-pointer" 
                    :style="{ backgroundColor: form.customization.botMessageColor, opacity: form.customization.botMessageOpacity }"
                    @click="() => document.getElementById('botMessageColor').click()"
                  ></div>
                  <input 
                    id="botMessageColor" 
                    v-model="form.customization.botMessageColor" 
                    type="color" 
                    class="w-full h-10"
                  />
                </div>
                <div class="mt-2">
                  <Label for="botMessageOpacity">Opacity: {{ Math.round((form.customization.botMessageOpacity || 0) * 100) }}%</Label>
                  <input 
                    id="botMessageOpacity" 
                    v-model="form.customization.botMessageOpacity" 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    class="w-full"
                  />
                </div>
              </div>
              
              <div class="space-y-2">
                <Label for="userMessageColor">User Messages & Input <span class="text-red-500">*</span></Label>
                <div class="flex items-center space-x-2">
                  <div 
                    class="w-8 h-8 rounded border cursor-pointer" 
                    :style="{ backgroundColor: form.customization.userMessageColor, opacity: form.customization.userMessageOpacity }"
                    @click="() => document.getElementById('userMessageColor').click()"
                  ></div>
                  <input 
                    id="userMessageColor" 
                    v-model="form.customization.userMessageColor" 
                    type="color" 
                    class="w-full h-10"
                  />
                </div>
                <div class="mt-2">
                  <Label for="userMessageOpacity">Opacity: {{ Math.round((form.customization.userMessageOpacity || 0) * 100) }}%</Label>
                  <input 
                    id="userMessageOpacity" 
                    v-model="form.customization.userMessageOpacity" 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    class="w-full"
                  />
                </div>
              </div>
              
              <div class="space-y-2">
                <Label for="buttonColor">MCP & Action Buttons <span class="text-red-500">*</span></Label>
                <div class="flex items-center space-x-2">
                  <div 
                    class="w-8 h-8 rounded border cursor-pointer" 
                    :style="{ backgroundColor: form.customization.buttonColor, opacity: form.customization.buttonOpacity }"
                    @click="() => document.getElementById('buttonColor').click()"
                  ></div>
                  <input 
                    id="buttonColor" 
                    v-model="form.customization.buttonColor" 
                    type="color" 
                    class="w-full h-10"
                  />
                </div>
                <div class="mt-2">
                  <Label for="buttonOpacity">Opacity: {{ Math.round((form.customization.buttonOpacity || 0) * 100) }}%</Label>
                  <input 
                    id="buttonOpacity" 
                    v-model="form.customization.buttonOpacity" 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    class="w-full"
                  />
                </div>
              </div>
              
              <div class="space-y-2">
                <Label for="backgroundColor">Background Color <span class="text-red-500">*</span></Label>
                <div class="flex items-center space-x-2">
                  <div 
                    class="w-8 h-8 rounded border cursor-pointer" 
                    :style="{ backgroundColor: form.customization.backgroundColor, opacity: form.customization.backgroundOpacity }"
                    @click="() => document.getElementById('backgroundColor').click()"
                  ></div>
                  <input 
                    id="backgroundColor" 
                    v-model="form.customization.backgroundColor" 
                    type="color" 
                    class="w-full h-10"
                  />
                </div>
                <div class="mt-2">
                  <Label for="backgroundOpacity">Opacity: {{ Math.round((form.customization.backgroundOpacity || 0) * 100) }}%</Label>
                  <input 
                    id="backgroundOpacity" 
                    v-model="form.customization.backgroundOpacity" 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    class="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
          
          <!-- Preview -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium">Preview</h3>
            
            <!-- Background card -->
            <div 
              class="rounded-lg p-4 flex justify-center items-center"
              :style="{ 


                backgroundColor: hexToRgba(form.customization.backgroundColor, form.customization.backgroundOpacity)
              }"
            >
              <!-- Chatbot widget -->
              <div class="w-full max-w-sm">
                <div 
                  class="rounded-lg overflow-hidden shadow-lg" 
                  style="background-color: rgba(0, 0, 0, 0.51);"
                >
                  <!-- Header -->
                  <div class="p-3 border-b border-gray-700">
                    <div class="flex items-center">
                      <div class="w-8 h-8 rounded bg-white/20"></div>
                      <div class="ml-2 text-white font-medium">Brand Name</div>
                    </div>
                  </div>
                  
                  <!-- Chat body -->
                  <div class="p-3 h-64 relative overflow-hidden">
                    <!-- Chat messages -->
                    <div class="space-y-3">
                      <!-- Bot message 1 -->
                      <div class="flex">
                        <div 
                          class="max-w-[80%] rounded-lg p-2"
                          :style="{ 
                            backgroundColor: hexToRgba(form.customization.botMessageColor, form.customization.botMessageOpacity)
                          }"
                        >
                          <div class="w-32 h-4 bg-white/20 rounded"></div>
                          <div class="w-24 h-4 bg-white/20 rounded mt-1"></div>
                        </div>
                      </div>
                      
                      <!-- User message -->
                      <div class="flex justify-end">
                        <div 
                          class="max-w-[80%] rounded-lg p-2"
                          :style="{ 
                            backgroundColor: hexToRgba(form.customization.userMessageColor, form.customization.userMessageOpacity)
                          }"
                        >
                          <div class="w-28 h-4 bg-white/20 rounded"></div>
                        </div>
                      </div>
                      
                      <!-- Bot message 2 -->
                      <div class="flex">
                        <div 
                          class="max-w-[80%] rounded-lg p-2"
                          :style="{ 
                            backgroundColor: hexToRgba(form.customization.botMessageColor, form.customization.botMessageOpacity)
                          }"
                        >
                          <div class="w-36 h-4 bg-white/20 rounded"></div>
                          <div class="w-28 h-4 bg-white/20 rounded mt-1"></div>
                        </div>
                      </div>
                    </div>
                    
                    <!-- Scroll indicator -->
                    <div class="absolute right-1 top-1/4 w-1 h-1/2 rounded-full bg-white/20">
                      <div class="w-1 h-1/4 rounded-full bg-white/40"></div>
                    </div>
                  </div>
                  
                  <!-- Divider -->
                  <div class="border-t border-gray-700"></div>
                  
                  <!-- Input area -->
                  <div class="p-3">
                    <div class="flex space-x-2">
                      <!-- MCPs and input -->
                      <div class="flex-1 space-y-2">
                        <div>
                          <div class="text-xs text-white/70 mb-1">MCPs</div>
                          <div class="flex space-x-1">
                            <div 
                              v-for="i in 3" 
                              :key="i" 
                              class="w-12 h-6 rounded-lg"
                              :style="{ 
                                backgroundColor: hexToRgba(form.customization.buttonColor, form.customization.buttonOpacity)
                              }"
                            ></div>
                          </div>
                        </div>
                        
                        <div 
                          class="h-8 rounded-lg w-full"
                          :style="{ 
                            backgroundColor: hexToRgba(form.customization.userMessageColor, form.customization.userMessageOpacity)
                          }"
                        ></div>
                      </div>
                      
                      <!-- Actions -->
                      <div class="w-16 space-y-2">
                        <div class="text-xs text-white/70 mb-1">Actions</div>
                        <div class="space-y-1">
                          <div 
                            v-for="i in 3" 
                            :key="i" 
                            class="w-full h-6 rounded-lg"
                            :style="{ 
                              backgroundColor: hexToRgba(form.customization.buttonColor, form.customization.buttonOpacity)
                            }"
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Step 3: Integration -->
      <div v-if="currentStep === 2" class="space-y-6">
        <div v-if="!savedConfigId" class="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <p class="text-sm text-yellow-700">
                Please save your configuration first to get your Sandbox ID.
              </p>
            </div>
          </div>
        </div>
        
        <div v-else>
          <h3 class="text-lg font-medium mb-4">Integration Instructions</h3>
          
          <div class="space-y-6">
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-medium mb-2">1. Add the TrialRun Widget script to your HTML</h4>
              <p class="text-sm text-gray-600 mb-3">
  Add this script tag to the head or body of your HTML document:
</p>
<div class="bg-gray-800 text-white p-3 rounded-md font-mono text-sm overflow-x-auto">

  &lt;script src="https://trialruncdn.fly.storage.tigris.dev/trialrun-widget.umd.cjs"&gt;&lt;/script&gt;
</div>

            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-medium mb-2">2. Add the widget to your page</h4>
              <p class="text-sm text-gray-600 mb-3">
  Place the custom element anywhere in your HTML. Use your Sandbox ID:
</p>
<div class="bg-gray-800 text-white p-3 rounded-md font-mono text-sm overflow-x-auto">

  &lt;trialrun-widget 
      sandbox-id="{{ savedConfigId }}"
      playground-width="100%" 
      playground-height="500px"
    &gt;&lt;/trialrun-widget&gt;
</div>

            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg">
              <h4 class="font-medium mb-2">Alternative: One-line integration</h4>
              <p class="text-sm text-gray-600 mb-3">
  You can also use this single script tag with data attributes:
</p>
<div class="bg-gray-800 text-white p-3 rounded-md font-mono text-sm overflow-x-auto">
    &lt;trialrun-widget 
    sandbox-id="{{ savedConfigId }}"
    playground-width="100%" 
    playground-height="500px"&gt;
    &lt;/trialrun-widget&gt;
  </div>

            </div>
            
            <div class="bg-blue-50 border-l-4 border-blue-400 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1H9z" clip-rule="evenodd" />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-blue-700">
                    Your Sandbox ID is: <span class="font-mono font-bold">{{ savedConfigId }}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div class="mt-8">
            <h3 class="text-lg font-medium mb-4">Live Preview</h3>
            <p class="text-sm text-gray-600 mb-4">
              Here's how your widget will look when integrated:
            </p>
            
            <div class="border border-gray-300 rounded-lg overflow-hidden" style="height: 500px;">
              <!-- Widget preview iframe -->
              <iframe 
                :src="`/preview.html?sandbox-id=${savedConfigId}&t=${previewTimestamp}`" 
                width="100%" 
                height="100%" 
                frameborder="0"
                title="Widget Preview"
              ></iframe>
            </div>
            
            <p class="text-sm text-gray-500 mt-2">
              Note: The preview shows your saved configuration. Any unsaved changes won't appear in the preview.
            </p>
          </div>
        </div>
      </div>
      
      <!-- Navigation buttons -->
      <div class="flex justify-between space-x-2 pt-6">
        <div>
          <Button 
            v-if="currentStep > 0" 
            type="button" 
            variant="outline" 
            @click="currentStep--"
          >
            Previous
          </Button>
        </div>
        
        <div class="flex space-x-2">
          <Button type="button" variant="outline" @click="resetForm">
            {{ isEditing ? 'Cancel' : 'Reset' }}
          </Button>
          
          <Button 
            v-if="currentStep < steps.length - 1" 
            type="button" 
            @click="nextStep"
            :disabled="!canProceedToNextStep"
          >
            Next
          </Button>
          
          <Button 
            v-else
            type="submit" 
            :disabled="saving || !isFormValid"
          >
            <Loader2 v-if="saving" class="mr-2 h-4 w-4 animate-spin" />
            {{ isEditing ? 'Update' : 'Create' }} Config
          </Button>
        </div>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore'
import { Loader2 } from 'lucide-vue-next'

const { $firebase } = useNuxtApp()
const db = $firebase.db

const props = defineProps({
  config: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['saved'])

const defaultSettings = {
  mcpServers: {}
}

const defaultCustomization = {
  botMessageColor: '#4A5568',
  botMessageOpacity: 1,  // Make sure this is a number
  userMessageColor: '#3182CE',
  userMessageOpacity: 1,  // Make sure this is a number
  buttonColor: '#38B2AC',
  buttonOpacity: 1,  // Make sure this is a number
  backgroundColor: '#1A202C',
  backgroundOpacity: 1  // Make sure this is a number
}

const defaultForm = {
  name: '',
  description: '',
  systemPrompt: '',
  settings: defaultSettings,
  customization: { ...defaultCustomization },
  isActive: true
}

const steps = [
  { id: 'config', name: 'MCP Config' },
  { id: 'customization', name: 'Customization' },
  { id: 'integration', name: 'Integration' }
]

const currentStep = ref(0)
const form = ref({ ...defaultForm })
const settingsJson = ref(JSON.stringify(defaultSettings, null, 2))
const jsonError = ref('')
const saving = ref(false)
const savedConfigId = ref('')
const previewTimestamp = ref(Date.now()) // Add timestamp to force iframe refresh

const isEditing = computed(() => !!props.config)

// Computed property to check if all required fields in current step are filled
const canProceedToNextStep = computed(() => {
  if (currentStep.value === 0) {
    return (
      form.value.name.trim() !== '' &&
      form.value.description.trim() !== '' &&
      form.value.systemPrompt.trim() !== '' &&
      settingsJson.value.trim() !== '' &&
      !jsonError.value
    )
  }
  return true
})

// Computed property to check if all required fields are filled
const isFormValid = computed(() => {
  return (
    form.value.name.trim() !== '' &&
    form.value.description.trim() !== '' &&
    form.value.systemPrompt.trim() !== '' &&
    settingsJson.value.trim() !== '' &&
    !jsonError.value &&
    form.value.customization.botMessageColor &&
    form.value.customization.userMessageColor &&
    form.value.customization.buttonColor &&
    form.value.customization.backgroundColor
  )
})

// Watch for changes in the config prop
watch(() => props.config, (newConfig) => {
  if (newConfig) {
    form.value = { 
      ...newConfig,
      // Ensure customization exists with defaults if not present
      customization: {
        ...defaultCustomization,  // First apply defaults
        ...(newConfig.customization || {})  // Then override with any existing values
      }
    }
    
    // Ensure settings has mcpServers if it doesn't exist
    if (!newConfig.settings || !newConfig.settings.mcpServers) {
      const updatedSettings = { ...newConfig.settings, mcpServers: {} }
      form.value.settings = updatedSettings
      settingsJson.value = JSON.stringify(updatedSettings, null, 2)
    } else {
      settingsJson.value = JSON.stringify(newConfig.settings || defaultSettings, null, 2)
    }
    
    // Set the saved config ID for the integration step
    savedConfigId.value = newConfig.id
  } else {
    resetForm()
  }
}, { immediate: true })

function validateJsonLive() {
  validateJson()
}

function validateJson() {
  try {
    if (!settingsJson.value.trim()) {
      jsonError.value = 'JSON cannot be empty'
      return false
    }
    
    const parsed = JSON.parse(settingsJson.value)
    
    // Schema validation
    if (!parsed.mcpServers) {
      jsonError.value = 'Missing required "mcpServers" object'
      return false
    }
    
    if (typeof parsed.mcpServers !== 'object') {
      jsonError.value = '"mcpServers" must be an object'
      return false
    }
    
    // Validate each server configuration
    for (const [key, server] of Object.entries(parsed.mcpServers)) {
      if (!server.url && !server.command) {
        jsonError.value = `Server "${key}" must have either "url" or "command" property`
        return false
      }
      
      if (server.command && !Array.isArray(server.args)) {
        jsonError.value = `Server "${key}" with command must have "args" as an array`
        return false
      }
    }
    
    jsonError.value = ''
    return true
  } catch (e) {
    jsonError.value = 'Invalid JSON format: ' + e.message
    return false
  }
}

function formatJson() {
  try {
    // Try to parse the JSON
    const parsed = JSON.parse(settingsJson.value)
    settingsJson.value = JSON.stringify(parsed, null, 2)
    jsonError.value = ''
  } catch (e) {
    // If parsing fails, try to fix common JSON errors
    try {
      // Attempt to fix common JSON issues
      let fixedJson = settingsJson.value
        // Replace single quotes with double quotes
        .replace(/'/g, '"')
        // Add missing quotes around property names
        .replace(/(\w+)(?=\s*:)/g, '"$1"')
        // Fix trailing commas in objects
        .replace(/,\s*}/g, '}')
        // Fix trailing commas in arrays
        .replace(/,\s*\]/g, ']')
        // Ensure mcpServers exists
        .replace(/^\s*{/, '{"mcpServers":')
        
      // Try to parse the fixed JSON
      const parsed = JSON.parse(fixedJson)
      
      // If successful, update the JSON
      settingsJson.value = JSON.stringify(parsed, null, 2)
      jsonError.value = ''
    } catch (fixError) {
      // If fixing fails, keep the original error
      jsonError.value = 'Cannot format: Invalid JSON format. Please check for syntax errors.'
    }
  }
}

// Modified nextStep function to save before moving to integration
async function nextStep() {
  if (currentStep.value === 0 && !validateJson()) return
  
  // If moving from step 1 (customization) to step 2 (integration), save first
  if (currentStep.value === 1) {
    try {
      saving.value = true
      // Save without emitting the 'saved' event
      const settings = JSON.parse(settingsJson.value)
      
      if (isEditing.value) {
        const docRef = doc(db, 'demoConfigs', props.config.id)
        await updateDoc(docRef, {
          name: form.value.name,
          description: form.value.description,
          systemPrompt: form.value.systemPrompt,
          settings,
          customization: form.value.customization,
          isActive: form.value.isActive,
          updatedAt: serverTimestamp()
        })
        savedConfigId.value = props.config.id
      } else {
        const docRef = await addDoc(collection(db, 'demoConfigs'), {
          name: form.value.name,
          description: form.value.description,
          systemPrompt: form.value.systemPrompt,
          settings,
          customization: form.value.customization,
          isActive: form.value.isActive,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        })
        savedConfigId.value = docRef.id
      }
      
      // Move to step 3 after saving
      currentStep.value = 2
      console.log("moving to 3")
      refreshPreview()
    } catch (error) {
      console.error('Error saving before integration step:', error)
      alert('Failed to save configuration. Please check your inputs and try again.')
    } finally {
      saving.value = false
    }
  } else if (currentStep.value < steps.length - 1) {
    currentStep.value++
  }
}

function resetForm() {
  form.value = { ...defaultForm }
  settingsJson.value = JSON.stringify(defaultSettings, null, 2)
  jsonError.value = ''
  currentStep.value = 0
  savedConfigId.value = ''
  
  if (isEditing.value) {
    emit('cancelled')
  }
}

// Handle form submission
async function handleSubmit() {
  // Only do a full save and emit when on the final step
  if (currentStep.value === 2) {
    if (!validateJson()) return
    
    try {
      saving.value = true
      await saveConfig()
      // Emit saved event only when explicitly submitting on step 3
      emit('saved')
    } catch (error) {
      console.error('Error saving configuration:', error)
      alert('Failed to save configuration. Please check your inputs and try again.')
    } finally {
      saving.value = false
    }
  } else {
    // If not on the final step, just move to the next step
    nextStep()
  }
}

// Refresh the preview by updating the timestamp
function refreshPreview() {
  previewTimestamp.value = Date.now()
}

async function saveConfig() {
  // Validate all required fields
  if (!form.value.name.trim()) {
    alert('Name is required')
    return Promise.reject('Name is required')
  }
  
  if (!form.value.description.trim()) {
    alert('Description is required')
    return Promise.reject('Description is required')
  }
  
  if (!form.value.systemPrompt.trim()) {
    alert('System Prompt is required')
    return Promise.reject('System Prompt is required')
  }
  
  if (!validateJson()) return Promise.reject('Invalid JSON')
  
  saving.value = true
  
  try {
    // Parse the JSON settings
    const settings = settingsJson.value ? JSON.parse(settingsJson.value) : defaultSettings
    
    if (isEditing.value) {
      // Update existing document
      const docRef = doc(db, 'demoConfigs', props.config.id)
      await updateDoc(docRef, {
        name: form.value.name,
        description: form.value.description,
        systemPrompt: form.value.systemPrompt,
        settings,
        customization: form.value.customization,
        isActive: form.value.isActive,
        updatedAt: serverTimestamp()
      })
      
      // Keep the same ID for integration step
      savedConfigId.value = props.config.id
    } else {
      // Create new document
      const docRef = await addDoc(collection(db, 'demoConfigs'), {
        name: form.value.name,
        description: form.value.description,
        systemPrompt: form.value.systemPrompt,
        settings,
        customization: form.value.customization,
        isActive: form.value.isActive,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      
      // Store the new document ID for integration step
      savedConfigId.value = docRef.id
    }
    
    // Update the preview timestamp to refresh the iframe
    refreshPreview()
    
    // Notify parent
    emit('saved')
    
    return Promise.resolve()
  } catch (error) {
    console.error('Error saving MCP config:', error)
    alert('Failed to save MCP configuration')
    return Promise.reject(error)
  } finally {
    saving.value = false
  }
}

// Helper function to convert hex to rgba
function hexToRgba(hex, opacity) {
  if (!hex) return 'transparent';
  
  // Remove the hash if it exists
  hex = hex.replace('#', '');
  
  // Parse the hex values
  let r = parseInt(hex.substring(0, 2), 16);
  let g = parseInt(hex.substring(2, 4), 16);
  let b = parseInt(hex.substring(4, 6), 16);
  
  // Return rgba value
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
</script>

<style scoped>
/* Add any component-specific styles here */
.code-copy-button {
  position: absolute;
  top: 8px;
  right: 8px;
  background-color: rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  color: white;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.code-copy-button:hover {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>

