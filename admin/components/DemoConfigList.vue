<template>
    <div class="bg-white rounded-lg shadow-md p-4">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-bold">Demo Configurations</h2>
        <Button @click="refreshConfigs">
          <RefreshCcw class="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
  
      <div v-if="loading" class="flex justify-center p-8">
        <!-- <Spinner class="h-8 w-8 text-primary" /> -->
      </div>
  
      <div v-else-if="configs.length === 0" class="text-center p-8 text-gray-500">
        No demo configurations found. Create one to get started.
      </div>
  
      <Table v-else>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-for="config in configs" :key="config.id">
            <TableCell>{{ config.name }}</TableCell>
            <TableCell>{{ config.description }}</TableCell>
            <TableCell>{{ formatDate(config.createdAt) }}</TableCell>
            <TableCell>
              <div class="flex space-x-2">
                <Button variant="outline" size="sm" @click="editConfig(config)">
                  <Edit class="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" @click="confirmDelete(config)">
                  <Trash class="h-4 w-4 mr-1" />
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
  
      <AlertDialog :open="showDeleteDialog" @update:open="showDeleteDialog = $event">
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the demo configuration "{{ configToDelete?.name }}".
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction @click="deleteConfig">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
  
  import { Edit, Trash, RefreshCcw } from 'lucide-vue-next'


  // Replace the direct import
// import { db } from '~/plugins/firebase'

// Use Nuxt's composable to access the plugin
const { $firebase } = useNuxtApp()
const db = $firebase.db

  
  const configs = ref([])
  const loading = ref(true)
  const showDeleteDialog = ref(false)
  const configToDelete = ref(null)
  
  const emit = defineEmits(['edit'])
  
  onMounted(() => {
    refreshConfigs()
  })
  
  async function refreshConfigs() {
    loading.value = true
    try {
      const querySnapshot = await getDocs(collection(db, 'demoConfigs'))
      configs.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }))
    } catch (error) {
      console.error('Error fetching demo configs:', error)
      alert('Failed to load demo configurations')
    } finally {
      loading.value = false
    }
  }
  
  function editConfig(config) {
    emit('edit', config)
  }
  
  function confirmDelete(config) {
    configToDelete.value = config
    showDeleteDialog.value = true
  }
  
  async function deleteConfig() {
    if (!configToDelete.value) return
    
    try {
      await deleteDoc(doc(db, 'demoConfigs', configToDelete.value.id))
      await refreshConfigs()
      showDeleteDialog.value = false
      configToDelete.value = null
    } catch (error) {
      console.error('Error deleting demo config:', error)
      alert('Failed to delete demo configuration')
    }
  }
  
  function formatDate(date) {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  </script>
  