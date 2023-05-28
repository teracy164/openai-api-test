<template>
  <div class="markdown" :innerHTML="parsedText" />
</template>
<script lang="ts" setup>
import { marked } from 'marked';

const { text } = defineProps<{ text: string }>();
const parsedText = ref('');

onMounted(() => {
  parsedText.value = marked(text);
});
</script>
<style lang="scss">
.markdown {
  p {
    margin: 0;
  }
}
</style>
