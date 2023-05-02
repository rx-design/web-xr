<script setup lang="ts">
  import { ref } from 'vue'
  import { Entity, Letter } from './types.ts'

  function getPosition() {
    return {
      x: (Math.random() - 0.5) * 20,
      y: 4,
      z: (Math.random() - 0.5) * 20,
    }
  }

  function getScale() {
    return {
      x: 4,
      y: 4,
      z: 4,
    }
  }

  function getInitialEntities() {
    return (<Letter[]>Object.keys(Letter)).map(letter => (<Entity>{
      letter,
      position: getPosition(),
      scale: getScale(),
    }))
  }

  const lives = ref(3)
  const score = ref(0)
  const ended = ref(false)
  const state = ref('Tropical fruit')
  const chars = ref<Letter[]>([
    Letter.P,
    Letter.I,
    Letter.N,
    Letter.E,
    Letter.A,
    Letter.P,
    Letter.P,
    Letter.L,
    Letter.E,
  ])
  const guess = ref(chars.value.map(_ => '_'))
  const items = ref(getInitialEntities())

  function checkLetter(letter: Letter) {
    for (let i = 0; i < chars.value.length; i++) {
      if (chars.value[i] === letter && guess.value[i] !== letter) {
        guess.value[i] = letter

        return true
      }
    }

    return false
  }

  function onClick(event: CustomEvent, entity: Entity) {
    if (ended.value) {
      return
    }

    if (checkLetter(entity.letter)) {
      state.value = guess.value.join(' ')
      score.value += 1

      if (score.value === chars.value.length) {
        ended.value = true
        state.value = 'Victory!'
      }

      event.target?.dispatchEvent(new Event('collected'))
    } else {
      lives.value -= 1

      if (lives.value === 0) {
        ended.value = true
        state.value = 'Game over'
      }
    }
  }

  function onPicked(entity: Entity) {
    entity.position = getPosition()
    entity.scale = getScale()
  }
</script>

<template>
  <a-scene color-space="sRGB" renderer="colorManagement: true, physicallyCorrectLights: true">
    <a-light type="point" position="16 16 16" />
    <a-light type="point" position="-16 -16 -16" />
    <a-camera>
      <a-text
        :value="`Lives: ${lives}`"
        font="mozillavr"
        position="-3.15 1.5 -2"
        color="red"
      />
      <a-text
        :value="state"
        font="mozillavr"
        position="-0.75 1.5 -2"
        color="red"
      />
      <a-text
        :value="`Score: ${score}`"
        font="mozillavr"
        position="2.25 1.5 -2"
        color="red"
      />
      <a-cursor raycaster="objects: .letter" />
    </a-camera>
    <a-entity environment="preset:forest; lighting:none" />
    <a-entity laser-controls />
    <a-entity
      v-for="item of items"
      :gltf-model="`models/${item.letter}.glb`"
      :position="item.position"
      :scale="item.scale"
      animation__collect="property: position; to: 0 0 0; dur: 300; startEvents: collected"
      animation__minimize="property: scale; to: 0 0 0; dur: 300; startEvents: collected"
      @mousedown="onClick($event, item)"
      @animationcomplete="onPicked(item)"
      class="letter"
    />
  </a-scene>
</template>
