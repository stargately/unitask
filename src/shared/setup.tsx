import React from "react";
import { ContentPadding } from "@/shared/common/styles/style-padding";
import Form from "antd/lib/form";
import TextArea from "antd/lib/input/TextArea";
import Button from "antd/lib/button";
import { getSetup } from "@/shared/home/tasks-controller";
import { CommonMargin } from "@/shared/common/common-margin";
import { queryTasks } from "@/shared/home/hooks/use-tasks";
import { useApolloClient } from "@apollo/client";
import notification from "antd/lib/notification";
import Card from "antd/lib/card";
import Image from "antd/lib/image";

const sample = {
  jiraOpts: {
    host: "TODO.atlassian.net",
    username: "TODO",
    password: "TODO",
    users: ["TODO"],
  },
  githubOpts: {
    auth: "TODO",
    id: "TODO",
  },
  myName: "TODO",
};

export const Setup: React.FC = () => {
  const client = useApolloClient();

  let initialValue = getSetup() ? JSON.stringify(getSetup(), null, 2) : "";
  if (!initialValue) {
    initialValue = JSON.stringify(sample, null, 2);
  }

  return (
    <ContentPadding>
      <CommonMargin />

      <article style={{ maxWidth: "680px" }}>
        <h1>Setup</h1>

        <p>
          Unitask flattens all your recent tasks in Github and JIRA into one
          table.
        </p>

        <Image
          src="https://tp-misc.b-cdn.net/unitask-demo.png"
          alt="Unitask Demo"
          width="100%"
        />

        <p>
          <strong>
            All your credentials are stored in your browser local storage and
            only passed to the server for queries. Therefore, the server will
            never store your credentials. Use this service at your own risk.
          </strong>
        </p>

        <p>Here you could set up the query with the following sample...</p>

        <Card>
          <pre>
            <code> {JSON.stringify(sample, null, 2)}</code>
          </pre>
        </Card>

        <h3>JIRA</h3>
        <p>
          The username and users list are emails that you and your team members
          registered with JIRA.{" "}
          <a
            href="https://support.atlassian.com/atlassian-account/docs/manage-api-tokens-for-your-atlassian-account/"
            rel="noopener noreferrer nofollow"
          >
            Follow this instruction to get your API token as the password
          </a>
          .
        </p>
        <p>
          If you do not want to get JIRA tasks, delete the jiraOpts field
          completely.
        </p>

        <h3>Github</h3>
        <p>
          <a
            href="https://docs.github.com/en/github/authenticating-to-github/keeping-your-account-and-data-secure/creating-a-personal-access-token"
            rel="noopener noreferrer nofollow"
          >
            Get your auth token by following this instruction
          </a>
          .
        </p>
        <p>
          If you do not want to get Github tasks, delete the githubOpts field
          completely.
        </p>

        <p>
          Copy the sample setup above to the text area below and prepare your
          credentials to replace TODOs... Click submit when you are ready, and
          we will verify if it works and then save it to the browser local
          storage.
        </p>
      </article>

      <Form
        style={{ maxWidth: "680px" }}
        onFinish={async (values) => {
          const { setup } = values;
          try {
            const parsed = JSON.parse(setup);
            await queryTasks(client, "open", parsed);
            notification.success({
              message: "setup successfully",
            });
            localStorage.setItem("setup", JSON.stringify(parsed));
          } catch (err) {
            notification.error({
              message: `invalid setup: ${err}`,
            });
          }
        }}
      >
        <Form.Item
          label="Setup"
          name="setup"
          initialValue={initialValue}
          rules={[{ required: true, message: "Please input your setup!" }]}
        >
          <TextArea
            style={{
              fontFamily: 'monaco, Consolas, "Lucida Console", monospace',
            }}
            rows={20}
          />
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </ContentPadding>
  );
};
