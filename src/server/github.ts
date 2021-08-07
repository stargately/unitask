import {
  GithubOpts,
  Task,
  TaskState,
} from "@/api-gateway/resolvers/tasks-resolver.types";
import { Octokit } from "@octokit/core";

const issue = `{
          createdAt
          title
          url
          repository {
            name
            url
            owner {
              login
            }
          }
          milestone {
            title
            url
          }
          updatedAt
          closedAt
          assignees(first: 3) {
            nodes {
              name
              login
            }
          }
          projectCards {
            nodes {
              project {
                name
                url
              }
            }
          }
        }`;

const searchFrag = `issueCount
    pageInfo {
      hasNextPage
      endCursor
    }
    edges {
      node {
        ... on Issue ${issue}
        ... on PullRequest ${issue}
      }
    }`;

function dedupByUrl(items: Array<Task>): Array<Task> {
  const set = new Set();
  const ret = [];
  for (const it of items) {
    if (!set.has(it.url)) {
      ret.push(it);
      set.add(it.url);
    }
  }
  return ret;
}

export async function getGithubTasks(
  opts?: GithubOpts & { state?: TaskState }
) {
  if (!opts) {
    return [];
  }

  const { state = TaskState.all, auth } = opts;
  const octokit = new Octokit({
    auth,
  });

  const stateStr = state === TaskState.all ? "" : ` state:${state}`;

  const response = (await octokit.graphql(
    `query BatchQueryAll {
  mentions: search(first: 100, type: ISSUE, query: "mentions:${opts.id} archived:false${stateStr}") {
    ${searchFrag}
  }
  author: search(first: 100, type: ISSUE, query: "author:${opts.id} archived:false${stateStr}") {
    ${searchFrag}
  }
  assignee: search(first: 100, type: ISSUE, query: "assignee:${opts.id} archived:false${stateStr}") {
    ${searchFrag}
  }
}
`
  )) as any;
  const flatten = [
    ...response.mentions.edges,
    ...response.author.edges,
    ...response.assignee.edges,
  ];
  return dedupByUrl(
    flatten.map((item) => {
      const ed = item.node;
      return {
        title: ed.title,
        url: ed.url,
        createdAt: ed.createdAt,
        updatedAt: ed.updatedAt,
        closedAt: ed.closedAt,
        repo: {
          title: `${ed.repository?.owner?.login}/${ed.repository.name}`,
          url: `${ed.repository?.url}/issues`,
        },
        assignees: ed.assignees?.nodes
          ?.map((n: any) => n?.name || n?.login)
          .join(", "),
        milestone: ed.milestone,
        project: ed.projectCards?.nodes[0]?.project?.name && {
          title: ed.projectCards?.nodes[0]?.project?.name,
          url: ed.projectCards?.nodes[0]?.project?.url,
        },
      };
    })
  );
}
