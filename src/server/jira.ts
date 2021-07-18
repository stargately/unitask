import { JiraOpts } from "@/api-gateway/resolvers/tasks-resolver.types";
import JiraApi from "jira-client";

export async function getJiraTasks(jiraOpts?: JiraOpts) {
  if (!jiraOpts) {
    return [];
  }
  const jira = new JiraApi({
    protocol: "https",
    host: jiraOpts.host,
    username: jiraOpts.username,
    password: jiraOpts.password,
    apiVersion: "2",
    strictSSL: true,
  });
  const responses = await Promise.all(
    jiraOpts.users.map((u) => jira.getUsersIssues(u, false))
  );
  let ret: any = [];
  for (const resp of responses) {
    const issues = resp.issues.map((is: any) => ({
      title: `${is.key} ${is.fields.summary}`,
      // @ts-ignore
      url: `https://${jira.host}/browse/${is.key}`,
      createdAt: is.fields.created,
      updatedAt: is.fields.updated,
      closedAt: is.fields.resolutiondate,
      repo: {},
      assignees: is.fields.assignee.displayName,
      milestone: is.fields.customfield_10014 && {
        title: is.fields.customfield_10014,
        // @ts-ignore
        url: `https://${jira.host}/browse/${is.fields.customfield_10014}`,
      },
      project: "",
    }));
    ret = [...ret, ...issues];
  }
  return ret;
}