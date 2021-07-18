import { useTasks } from "@/shared/home/hooks/use-tasks";
import React, { useEffect } from "react";
import { useHistory, useLocation } from "onefx/lib/react-router";
import { Location } from "history";
import { TasksTable } from "./components/tasks-table";

type TaskStatus = "open" | "closed" | "all";

const getDate = (str: string | undefined | null) => {
  return str ? new Date(str) : null;
};

export const getSetup = (): any => {
  try {
    const setup = localStorage?.getItem("setup");
    if (!setup) {
      return setup;
    }

    return JSON.parse(setup);
    // eslint-disable-next-line no-empty
  } catch (err) {}
  return undefined;
};

const getStatus = (location: Location) => {
  const path = location.pathname.replace(/\//g, "");
  let status: TaskStatus = "all";
  if (path === "open") {
    status = "open";
  } else if (path === "closed") {
    status = "closed";
  }
  return status;
};

export const TasksController: React.FC = () => {
  const location = useLocation();
  const history = useHistory();

  useEffect(() => {
    const localSetup = getSetup();
    if (!localSetup) {
      history.push("/setup/");
    }
  }, [location.pathname]);

  const { loading, error, data } = useTasks(getStatus(location), getSetup());

  const tasks = data?.tasks?.items?.map((it) => {
    return {
      ...it,
      closedAt: getDate(it?.closedAt),
      updatedAt: getDate(it?.updatedAt),
      createdAt: getDate(it?.createdAt),
      milestone: it?.milestone?.title,
      milestoneUrl: it?.milestone?.url,
      repo: it?.repo?.title,
      repoUrl: it?.repo?.url,
      project: it?.project?.title,
      projectUrl: it?.project?.url,
    };
  });
  return (
    <>
      <TasksTable loading={loading} error={!!error} tasks={tasks} />
    </>
  );
};
