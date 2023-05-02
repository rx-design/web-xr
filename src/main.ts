import { createApp } from 'vue'
import Game from './Game.vue'
import { initializeApp } from 'firebase/app'

import 'aframe'
import 'aframe-environment-component'

const firebaseConfig = {
  apiKey: "AIzaSyD-qpG7LgmxwNR07rrSC0L3HPbLtG1PJeU",
  authDomain: "dlg-webxr.firebaseapp.com",
  projectId: "dlg-webxr",
  storageBucket: "dlg-webxr.appspot.com",
  messagingSenderId: "430179177583",
  appId: "1:430179177583:web:579f011ea290353163a99a",
}

initializeApp(firebaseConfig)

createApp(Game).mount('#game')
