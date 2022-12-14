<script setup>
import { ref, watch } from "vue";

import {
  StartCodePipeline,
  UpdateCodePipeline,
  getPipeline,
} from "../utils/codepipeline";
import { useGithubAction } from "../utils/github";

const props = defineProps({
  configurations: Object,
  credentials: String,
  profiles: Object,
  selectedPipeline: Object,
});

const emit = defineEmits(["updateMessage", "toggleLoading", "selectPipeline"]);

const branchName = ref("");
const detectChanges = ref(false);
const initialDetectChanges = ref(null);

const isLoading = ref("");

const _selectedPipeline = ref({});

watch(
  _selectedPipeline,
  async () => {
    if (_selectedPipeline.value.type !== "codepipeline") return;
    initialDetectChanges.value = null;
    detectChanges.value = null;

    initialDetectChanges.value =
      (
        await getPipeline({
          profiles: props.profiles,
          selectedPipeline: _selectedPipeline.value,
        })
      )?.pipeline?.stages[0]?.actions[0]?.configuration?.DetectChanges || null;

    initialDetectChanges.value = initialDetectChanges.value === "true";
    detectChanges.value = initialDetectChanges.value;
  },
  { deep: true }
);

function selectPipeline() {
  emit("selectPipeline", _selectedPipeline.value);
}

async function startPipeline() {
  switch (props.selectedPipeline.type) {
    case "codepipeline":
      if (
        branchName.value !== "" ||
        detectChanges.value !== initialDetectChanges.value
      )
        await UpdateCodePipeline({
          profiles: props.profiles,
          selectedPipeline: props.selectedPipeline,
          branchName: branchName.value,
          detectChanges: detectChanges.value,
        });
      return StartCodePipeline({
        profiles: props.profiles,
        selectedPipeline: props.selectedPipeline,
      });
    case "github":
      if (branchName.value === "") throw new Error("Missing branch name");
      return useGithubAction({
        auth: props.configurations.authentication.github.api_key,
        workflow_id: props.selectedPipeline.workflow_id,
        ref: branchName.value,
        repo: props.selectedPipeline.repository,
        owner: props.selectedPipeline.owner,
        inputs: props.selectedPipeline.inputs,
      });
    default:
      throw new Error("Incorrect pipeline type");
  }
}

async function start() {
  try {
    // resetMessage();
    isLoading.value = true;
    emit("toggleLoading", true);
    console.log("Start");

    const msg = await startPipeline();
    emit(
      "updateMessage",
      `Pipeline started : ${msg.pipelineExecutionId || "Ok !"}`,
      ""
    );

    branchName.value = "";
  } catch (e) {
    emit("updateMessage", "", e.message);
    throw e;
  } finally {
    isLoading.value = false;
    emit("toggleLoading", false);
  }
}
</script>

<template>
  <div class="card">
    <div
      id="pipeline"
      class="card-body"
      v-if="props.configurations && props.configurations.pipelines"
    >
      <form id="inputs">
        <div class="mt-2">
          <label for="pipeline"
            >Select a pipeline (<span class="fw-bold"
              >&nbsp;{{ props.configurations.pipelines.length }}&nbsp;</span
            >)</label
          >
          <select
            class="form-select"
            name="pipeline"
            id="pipeline"
            @change="selectPipeline($event)"
            v-model="_selectedPipeline"
          >
            <option
              :value="config"
              v-for="config in props.configurations.pipelines"
              :key="config.pipeline"
            >
              {{ config.friendlyName }}
            </option>
          </select>
        </div>

        <div class="mt-2">
          <label for="branch">What branch to deploy</label>
          <input
            class="form-control"
            type="text"
            name="branch"
            placeholder="branch name"
            v-model="branchName"
          />
        </div>

        <div v-if="props.selectedPipeline.type === 'codepipeline'" class="mt-2">
          <div class="form-check form-switch text-end">
            <input
              class="form-check-input"
              type="checkbox"
              id="detectChanges"
              v-model="detectChanges"
            />
            <label class="form-check-label" for="detectChanges"
              >Detect Changes</label
            >
          </div>
        </div>
      </form>

      <div id="buttons" class="d-grid gap-2 mt-2 p-2">
        <button
          class="btn btn-outline-primary"
          type="button"
          @click="start()"
          :disabled="
            !selectedPipeline ||
            isLoading === true ||
            (selectedPipeline &&
              selectedPipeline.type === 'github' &&
              branchName === '')
          "
        >
          Start
        </button>
      </div>

      <hr />
    </div>
  </div>
</template>
