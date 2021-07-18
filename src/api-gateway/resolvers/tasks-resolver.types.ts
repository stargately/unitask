import {
  ArgsType,
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from "type-graphql";

@InputType()
export class JiraOpts {
  @Field(() => String)
  host: string;

  @Field(() => String)
  username: string;

  @Field(() => String)
  password: string;

  @Field(() => [String])
  users: Array<string>;
}

@ObjectType()
export class LinkableTitle {
  @Field(() => String)
  title: string;

  @Field(() => String)
  url: string;
}

@ObjectType()
export class Repo {
  @Field(() => String)
  title: string;

  @Field(() => String)
  url: string;
}

@ObjectType()
export class Task {
  @Field(() => String)
  title: string;

  @Field(() => String)
  url: string;

  @Field(() => String)
  createdAt: string;

  @Field(() => String)
  updatedAt: string;

  @Field(() => String)
  closedAt: string;

  @Field(() => Repo)
  repo: Repo;

  @Field(() => LinkableTitle)
  milestone: LinkableTitle;

  @Field(() => LinkableTitle)
  project: LinkableTitle;

  @Field(() => String)
  assignees: string;
}

@ObjectType()
export class TasksResponse {
  @Field(() => [Task])
  items: Array<Task>;
}

// eslint-disable-next-line no-shadow
export enum TaskState {
  open = "open",
  closed = "closed",
  all = "all",
}

registerEnumType(TaskState, {
  name: "TaskState",
});

@InputType()
export class GithubOpts {
  @Field(() => String)
  auth?: string;

  @Field(() => String)
  id?: string;
}

@InputType()
export class Setup {
  @Field(() => JiraOpts)
  jiraOpts?: JiraOpts;

  @Field(() => GithubOpts)
  githubOpts?: GithubOpts;

  @Field(() => String)
  myName?: string;
}

@ArgsType()
export class TasksRequest {
  @Field(() => TaskState)
  state?: TaskState;

  @Field(() => Setup)
  setup?: Setup;
}
