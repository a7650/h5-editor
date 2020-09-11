<template>
  <div class="left-side-test">test - 123</div>
</template>

<script>
import { TextWidget } from 'poster/widgetConstructor'

export default {
  props: ['pluginHelpers'],
  created() {
    this.pluginHelpers.addWidget(new TextWidget())
  }
}
</script>

<style></style>
