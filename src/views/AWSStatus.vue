<script setup>
import { watch, computed } from "vue";
import { useStore } from "vuex";

import Header from "../components/AWSStatus/Sections/Header.vue";
import PipelineInfo from "../components/AWSStatus/Sections/PipelineInfo.vue";
import MoreInfo from "../components/AWSStatus/Sections/MoreInfo.vue";
import DetectChanges from "../components/Inputs/DetectChanges.vue";

const store = useStore();

const selectedPipeline = computed(() => store.state.pipelines.selectedPipeline);

async function refresh() {
  try {
    store.dispatch("loadingHandler/startLoading");
    store.dispatch("messageHandler/setMessage", "Refreshing Status...");
    await store.dispatch("pipelines/loadPipeline");
  } catch (e) {
    store.dispatch("messageHandler/setError", e.message);
    throw e;
  } finally {
    store.dispatch("loadingHandler/stopLoading");
    store.dispatch("messageHandler/resetMessage");
  }
}

watch(
  selectedPipeline,
  () => {
    refresh();
  },
  { deep: true, immediate: true }
);
</script>

<template>
  <div
    class="card"
    v-if="selectedPipeline && selectedPipeline?.type === 'codepipeline'"
  >
    <div class="card-body">
      <Header />

      <div class="mb-3" v-if="selectedPipeline">
        <DetectChanges />
      </div>

      <MoreInfo />
      <PipelineInfo />

      <button
        class="btn btn-outline-primary btn-sm mt-3"
        @click.prevent="refresh"
      >
        Refresh
      </button>
    </div>
  </div>
</template>
