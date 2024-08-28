import { useQuery, useMutation, useQueryClient } from "@tanstack/vue-query";
import { swApi, swVersionApi, testUnitApi } from "./domain/swService";
import { Ref } from "vue";


export function useSwList() {
  return useQuery({
    queryKey: ["swTypeList"], // Wrap the queryKey value in an array
    queryFn: swApi.GET_sw,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useMutateAddSwVersion() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: {
      swTypeId: string,
      versionTitle: string,
      versionDesc: string,
      tag: string,
      file?: File,
    }) => swVersionApi.POST_swVersion({
      swTypeId: data.swTypeId,
      versionTitle: data.versionTitle,
      versionDesc: data.versionDesc,
      tag: data.tag,
      ...(!!data.file && { file: data.file }),
    }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['swVersionList', variables.swTypeId] })
    },
  })
}

export function useUnitTestList(swVersionId: Ref) {

  const queryKey = ["testUnitList", swVersionId.value];
  console.log(">>>>>>>> ", swVersionId.value);
  return useQuery({
    queryKey,
    queryFn: () => testUnitApi.GET_testUnitsBySwVersionId(swVersionId.value),
    staleTime: 1000,
    // enabled: !!swVersionId.value,

  });
}


export function useSwVersion(swTypeId: Ref) {
  const queryKey = ["swVersionList", swTypeId];

  return useQuery({
    queryKey,
    queryFn: () => swVersionApi.GET_swVersionsBySwTypeId(swTypeId.value),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}


