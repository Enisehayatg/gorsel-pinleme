import useSWR, { useSWRConfig } from "swr";
import apiClient from "@/libs/apiClient";

export const useApi = <T>(resource: string) => {
  const { data, error, mutate } = useSWR<T>(
    resource,
    apiClient.get.bind(apiClient),
  );
  const { mutate: globalMutate } = useSWRConfig();

  const create = async (newData: any) => {
    try {
      const response = await apiClient.post(resource, newData);
      await mutate();
      await globalMutate(resource);
      return response;
    } catch (err) {
      console.error("Create Error:", err);
      throw err;
    }
  };

  const get = async (id: string | number) => {
    try {
      return await apiClient.get(`${resource}/${id}`);
    } catch (err) {
      console.error("Get Error:", err);
      throw err;
    }
  };

  const update = async (id: string | number, updatedData: any) => {
    try {
      const response = await apiClient.put(`${resource}/${id}`, updatedData);
      await mutate();
      await globalMutate(resource);
      return response;
    } catch (err) {
      console.error("Update Error:", err);
      throw err;
    }
  };

  const remove = async (id: string | number) => {
    try {
      await apiClient.delete(`${resource}/${id}`);
      await mutate();
      await globalMutate(resource);
    } catch (err) {
      console.error("Delete Error:", err);
      throw err;
    }
  };

  const search = async (searchParams: { [key: string]: string }) => {
    try {
      return await apiClient.post(`${resource}/search`, searchParams);
    } catch (err) {
      console.error("Search Error:", err);
      throw err;
    }
  };

  return {
    data,
    error,
    isLoading: !data && !error,
    mutate,
    create,
    get,
    update,
    remove,
    search,
  };
};
