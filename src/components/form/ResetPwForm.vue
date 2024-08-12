<script setup lang="ts">
import { reactive, ref } from "vue";
import { storeToRefs } from "pinia";
import { useVuelidate } from "@vuelidate/core";
import { required, helpers } from "@vuelidate/validators";

import { useUserStore } from "@/store/userStore";
import { userApi } from "@/services/domain/userService";

const props = defineProps<{
  fetchAuthByAccToken: () => void;
}>();

const store = useUserStore();
const { loggedInUser } = storeToRefs(store);

const pwVisible = ref<boolean>(false);
const initialState = {
  pw: "",
  pwConfirm: "",
};
const state = reactive({
  ...initialState,
});
const rules = {
  pw: { required: helpers.withMessage("Password is required", required) },
  pwConfirm: {
    required: helpers.withMessage("Confirming Password is required", required),
    sameAsPw: helpers.withMessage("Passwords do not match", (value) => {
      return value === state.pw;
    }),
  },
};
const onSubmitResetPassword = () => {
  if (!!v$.value.$errors.map((e) => e.$message).join(", ")) return;

  if (!!loggedInUser.value?.id) {
    userApi
      .PATCH_user({ id: loggedInUser.value?.id, pw: state.pw })
      .then((res) => {
        state.pw = "";
        state.pwConfirm = "";
        props.fetchAuthByAccToken();
      });
  }
};

const v$ = useVuelidate(rules, state);
</script>
<template>
  <form @submit.prevent="">
    <v-text-field
      :error-messages="v$.pw.$errors.map((e) => e.$message).join(', ')"
      :append-inner-icon="pwVisible ? 'mdi-eye-off' : 'mdi-eye'"
      :type="pwVisible ? 'text' : 'password'"
      density="compact"
      placeholder="Enter your password"
      prepend-inner-icon="mdi-lock-outline"
      variant="outlined"
      @click:append-inner="pwVisible = !pwVisible"
      @blur="v$.pw.$touch"
      @input="v$.pw.$touch"
      v-model="state.pw"
    ></v-text-field>
    <v-text-field
      :error-messages="v$.pwConfirm.$errors.map((e) => e.$message).join(', ')"
      :append-inner-icon="pwVisible ? 'mdi-eye-off' : 'mdi-eye'"
      :type="pwVisible ? 'text' : 'password'"
      density="compact"
      placeholder="Confirm password"
      prepend-inner-icon="mdi-lock-outline"
      variant="outlined"
      @click:append-inner="pwVisible = !pwVisible"
      @blur="v$.pwConfirm.$touch"
      @input="v$.pwConfirm.$touch"
      v-model="state.pwConfirm"
    ></v-text-field>
    <v-btn
      class="mb-8"
      color="blue"
      size="large"
      variant="tonal"
      block
      type="submit"
      @click="
        {
          v$.$validate();
          onSubmitResetPassword();
        }
      "
    >
      Change Password
    </v-btn>
  </form>
</template>
<style scoped></style>
