<script setup lang="ts">
import { reactive } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";
import { JenkinsDeploymentClass } from "@/entity/JenkinsDeployment";

const props = defineProps<{
  swTypeId: string;

  editJenkinsDeployment?: Partial<JenkinsDeploymentClass>;
}>();

const initialState = !props.editJenkinsDeployment?.jenkinsDeploymentId
  ? {
      jenkinsUrl: "",
      title: "",
      description: "",
      // files: "",
    }
  : {
      jenkinsUrl: props.editJenkinsDeployment.jenkinsUrl,
      title: props.editJenkinsDeployment.title,
      description: props.editJenkinsDeployment.description,
    };

const emit = defineEmits([
  "onSubmitNewJenkinsDeployment",
  "onSubmitEditJenkinsDeployment",
  "onClickDeleteJenkinsDeployment",
]);

const state = reactive({
  ...initialState,
});
const rules = {
  jenkinsUrl: {
    required: helpers.withMessage("Title is required", required),
  },
  title: {
    required: helpers.withMessage("Title is required", required),
  },
  description: {
    required: helpers.withMessage("Description is required", required),
  },
};
const v$ = useVuelidate(rules, state);

const onSubmitNewJenkinsDeployment = () => {
  if (!!v$.value.$errors.map(e => e.$message).join(", ")) return;

  return emit("onSubmitNewJenkinsDeployment", { ...state, swTypeId: props.swTypeId });
};

const onClickDeleteJenkinsDeployment = () => {
  return emit("onClickDeleteJenkinsDeployment", props.editJenkinsDeployment?.jenkinsDeploymentId);
};

const onSubmitEditJenkinsDeployment = () => {
  if (!!v$.value.$errors.map(e => e.$message).join(", ")) return;

  return emit("onSubmitEditJenkinsDeployment", {
    ...state,
    jenkinsDeploymentId: props.editJenkinsDeployment?.jenkinsDeploymentId,
    swTypeId: props.swTypeId,
  });
};
</script>
<template>
  <form @submit.prevent="">
    <v-text-field
      :error-messages="v$.title.$errors.map(e => e.$message).join(', ')"
      density="compact"
      placeholder="Jenkins Title"
      prepend-inner-icon="mdi-format-title"
      variant="outlined"
      @blur="v$.title.$touch"
      @input="v$.title.$touch"
      v-model="state.title"
    />
    <v-text-field
      :error-messages="v$.description.$errors.map(e => e.$message).join(', ')"
      density="compact"
      placeholder="Jenkins Description"
      prepend-inner-icon="mdi-text-box-multiple-outline"
      variant="outlined"
      @blur="v$.description.$touch"
      @input="v$.description.$touch"
      v-model="state.description"
    />

    <v-text-field
      :error-messages="v$.jenkinsUrl.$errors.map(e => e.$message).join(', ')"
      density="compact"
      placeholder="Jenkins jenkinsUrl"
      prepend-inner-icon="mdi-cloud-upload"
      variant="outlined"
      @blur="v$.jenkinsUrl.$touch"
      @input="v$.jenkinsUrl.$touch"
      v-model="state.jenkinsUrl"
    />
    <div class="btn-con">
      <v-btn class="delete-btn" color="red" variant="tonal" @click="onClickDeleteJenkinsDeployment">delete</v-btn>

      <v-btn
        color="blue"
        size="large"
        variant="tonal"
        type="submit"
        @click="
          {
            v$.$validate();
            props.editJenkinsDeployment ? onSubmitEditJenkinsDeployment() : onSubmitNewJenkinsDeployment();
          }
        "
      >
        {{ props.editJenkinsDeployment ? "Edit" : "Add" }} Jenkins Deployment
      </v-btn>
    </div>
  </form>
</template>

<style scoped>
.btn-con {
  display: flex;

  gap: 10px;
}
</style>
