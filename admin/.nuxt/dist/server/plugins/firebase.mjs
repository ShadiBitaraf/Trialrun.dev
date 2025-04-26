import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { defineNuxtPlugin, useRuntimeConfig } from "../node_modules/nuxt/dist/app/nuxt.mjs";
const firebase_kpjecCMkOtWi_NG312RLEsvaIkhwsdrV5WIoE0vCPpA = defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();
  const firebaseConfig = {
    apiKey: config.public.FIREBASE_API_KEY,
    authDomain: config.public.FIREBASE_AUTH_DOMAIN,
    projectId: config.public.FIREBASE_PROJECT_ID,
    storageBucket: config.public.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: config.public.FIREBASE_MESSAGING_SENDER_ID,
    appId: config.public.FIREBASE_APP_ID
  };
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);
  return {
    provide: {
      firebase: {
        app,
        db
      }
    }
  };
});
export {
  firebase_kpjecCMkOtWi_NG312RLEsvaIkhwsdrV5WIoE0vCPpA as default
};
//# sourceMappingURL=firebase.mjs.map
