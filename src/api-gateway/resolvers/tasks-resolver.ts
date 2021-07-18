import { Args, Query, Resolver } from "type-graphql";
import {
  TasksRequest,
  TasksResponse,
  TaskState,
} from "@/api-gateway/resolvers/tasks-resolver.types";
import { getJiraTasks } from "@/server/jira";
import { getGithubTasks } from "@/server/github";

@Resolver()
export class TasksResolver {
  @Query(() => TasksResponse)
  async tasks(@Args() tasksRequest: TasksRequest): Promise<TasksResponse> {
    let githubOpts;
    if (tasksRequest?.setup?.githubOpts?.auth) {
      githubOpts = {
        auth: tasksRequest?.setup?.githubOpts?.auth || "",
        state: tasksRequest.state,
        id: tasksRequest?.setup?.githubOpts?.id,
      };
    }

    const [githubTasks, jiraTasks] = await Promise.all([
      getGithubTasks(githubOpts),
      getJiraTasks(tasksRequest?.setup?.jiraOpts),
    ]);
    return {
      items: [...githubTasks, ...jiraTasks].filter((it) => {
        if (tasksRequest.state === TaskState.open) {
          return !it.closedAt;
        }
        if (tasksRequest.state === TaskState.closed) {
          return it.closedAt;
        }
        return true;
      }),
    };
  }
}
