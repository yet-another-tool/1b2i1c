import {
  getPipeline,
  getPipelineState,
  StartCodePipeline,
  UpdateCodePipeline,
} from "../../utils/codepipeline";
import { useGithubAction, getWorkflowDetails } from "../../utils/github";

const state = () => ({
  selectedPipeline: null,
  pipeline: {},
  status: {},
  inputs: {}, // Github only
  workflow: {}, // Github only
});

// getters
const getters = {};

// actions
const actions = {
  async setSelectedPipeline({ commit, dispatch }, pipeline) {
    commit("setSelectedPipeline", pipeline);
    if (pipeline.type === "codepipeline") await dispatch("loadPipeline");
  },

  async githubStatus({ state, rootState, commit }) {
    try {
      if (
        !state.selectedPipeline ||
        Object.keys(state.selectedPipeline).length === 0
      )
        throw new Error("Please Select a pipeline.");

      const workflow = await getWorkflowDetails({
        auth: rootState.configurations.configurations.authentication.github
          .api_key,
        repo: state.selectedPipeline.repository,
        owner: state.selectedPipeline.owner,
      });

      commit("loadWorkflow", { workflow: workflow.data });
    } catch (e) {
      throw new Error(e.message);
    }
  },

  // AWS Only
  async loadPipeline({ state, rootState, commit }) {
    try {
      if (
        !state.selectedPipeline ||
        Object.keys(state.selectedPipeline).length === 0
      )
        throw new Error("Please Select a pipeline.");

      const pipeline = await getPipeline({
        selectedPipeline: state.selectedPipeline,
        profiles: rootState.configurations.profiles,
      });
      const status = await getPipelineState({
        selectedPipeline: state.selectedPipeline,
        profiles: rootState.configurations.profiles,
      });

      commit("loadPipeline", { pipeline: pipeline.pipeline });
      commit("loadStatus", { status });
    } catch (e) {
      throw new Error(e.message);
    }
  },

  async startPipeline({ state, rootState, dispatch }, { branchName }) {
    if (!state.selectedPipeline) return;
    switch (state.selectedPipeline.type) {
      case "codepipeline":
        if (branchName !== "") await dispatch("updatePipeline", { branchName });
        return StartCodePipeline({
          profiles: rootState.configurations.profiles,
          selectedPipeline: state.selectedPipeline,
        });
      case "github":
        if (branchName === "") throw new Error("Missing branch name");
        return useGithubAction({
          auth: rootState.configurations.configurations.authentication.github
            .api_key,
          workflow_id: state.selectedPipeline.workflow_id,
          ref: branchName,
          repo: state.selectedPipeline.repository,
          owner: state.selectedPipeline.owner,
          inputs: state.selectedPipeline.inputs,
        });
      default:
        throw new Error("Incorrect pipeline type");
    }
  },

  // AWS Only
  async updatePipeline({ state, rootState }, { branchName, detectChanges }) {
    return UpdateCodePipeline({
      profiles: rootState.configurations.profiles,
      selectedPipeline: state.selectedPipeline,
      branchName: branchName,
      detectChanges: detectChanges,
    });
  },
};

// mutations
const mutations = {
  loadPipeline(state, { pipeline }) {
    state.pipeline = pipeline;
  },

  loadWorkflow(state, { workflow }) {
    state.workflow = workflow;
  },

  loadStatus(state, { status }) {
    state.status = status;
  },

  setSelectedPipeline(state, pipeline) {
    state.selectedPipeline = pipeline;
    state.inputs = pipeline.inputs || {};
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
