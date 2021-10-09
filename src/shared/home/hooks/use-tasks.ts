import { getTasks } from "@/shared/home/data/quries";
import { ApolloClient, useQuery } from "@apollo/client";
import { Tasks } from "@/shared/home/data/__generated__/Tasks";

export const useTasks = (state: "open" | "closed" | "all", setup: any) => {
  const { loading, data, error, refetch } = useQuery<Tasks>(getTasks, {
    ssr: false,
    variables: {
      state,
      setup,
    },
    pollInterval: 600000,
  });
  return { loading, data, error, refetch };
};

export const queryTasks = async (
  client: ApolloClient<any>,
  state: "open" | "closed" | "all",
  setup: any
) => {
  const { data } = await client.query({
    query: getTasks,
    variables: {
      state,
      setup,
    },
  });
  return { data };
};
