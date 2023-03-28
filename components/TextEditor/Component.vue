<script setup lang="ts">
	import { nodeViewProps, NodeViewWrapper } from "@tiptap/vue-3";

	defineProps(nodeViewProps);
</script>

<template>
	<NodeViewWrapper class="vue-component">
		<span class="label">Vue Component</span>
	</NodeViewWrapper>
</template>

<style lang="scss">
.vue-component {
  background: #FAF594;
  border: 3px solid #0D0D0D;
  border-radius: 0.5rem;
  margin: 1rem 0;
  position: relative;
}

.label {
  margin-left: 1rem;
  background-color: #0D0D0D;
  font-size: 0.6rem;
  letter-spacing: 1px;
  font-weight: bold;
  text-transform: uppercase;
  color: #fff;
  position: absolute;
  top: 0;
  padding: 0.25rem 0.75rem;
  border-radius: 0 0 0.5rem 0.5rem;
}
</style>
