import { colors } from "@/shared/common/styles/style-color";
import CloseCircleTwoTone from "@ant-design/icons/CloseCircleTwoTone";
import LoadingOutlined from "@ant-design/icons/LoadingOutlined";
import React, { useEffect, useState } from "react";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import Button from "antd/lib/button";
import { useHistory, useLocation } from "onefx/lib/react-router";
import { GridApi } from "ag-grid-community";
import { GridReadyEvent } from "ag-grid-community/dist/lib/events";
import { Link } from "onefx/lib/react-router-dom";
import { getSetup } from "@/shared/home/tasks-controller";

export type TaskText = {
  title?: string | null;
  url?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  closedAt?: Date | null;
  repo?: string | null;
  repoUrl?: string | null;
  milestone?: string | null;
  milestoneUrl?: string | null;
  project?: string | null;
  assignees?: string | null;
};

type Props = {
  loading: boolean;
  tasks?: Array<TaskText>;
  error: boolean;
};

const getLinkRender =
  (urlField: string, textField: string) =>
  (params: { data: Record<string, string>; value: Record<string, string> }) =>
    params.data[textField]
      ? `<a href="${params.data[urlField]}" target="_blank" rel="noopener">${params.data[textField]}</a>`
      : "";

const dateRenderer = (params: {
  data: Record<string, string>;
  value: Date;
}) => {
  try {
    return params.value
      ? new Intl.DateTimeFormat("en-US", {
          dateStyle: "short",
          timeStyle: "short",
        }).format(params.value)
      : "";
  } catch (_) {
    return "";
  }
};

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export const TasksTable: React.FC<Props> = ({
  loading,
  tasks,
  error,
}: Props) => {
  if (loading) {
    return (
      <div>
        <LoadingOutlined /> Checking Status
      </div>
    );
  }
  if (error) {
    return (
      <div>
        <CloseCircleTwoTone twoToneColor={colors.error} /> You have not setup
        yet or your credential is invalid, please go to{" "}
        <Link to="/setup/">setup</Link> to prepare your credentials.
      </div>
    );
  }

  const myName = getSetup()?.myName;

  const history = useHistory();
  const query = useQuery();
  const location = useLocation();

  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const clearFilters = () => {
    history.push(location.pathname);
    gridApi?.setFilterModel(null);
  };
  const restoreFromQueryParam = () => {
    const customFilter: Record<string, Record<string, string>> = {};
    const assignees = query.get("assignees");
    if (assignees) {
      customFilter.assignees = {
        type: "contains",
        filter: assignees,
      };
    }
    const closedAfter = query.get("closedAfter");
    if (closedAfter) {
      customFilter.closedAt = {
        type: "greaterThan",
        dateFrom: closedAfter,
      };
    }
    gridApi?.setFilterModel(customFilter);
  };
  const onGridReady = (params: GridReadyEvent) => {
    setGridApi(params.api);
  };
  useEffect(() => {
    if (gridApi) {
      restoreFromQueryParam();
    }
  }, [location.search, gridApi]);
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  return (
    <div className="ag-theme-alpine" style={{ height: "100vh", width: "100%" }}>
      <Button onClick={() => clearFilters()}>Clear Filters</Button>
      <Button
        onClick={() => history.push(`${location.pathname}?assignees=${myName}`)}
      >
        My Tasks
      </Button>
      <Button
        onClick={() =>
          history.push(
            `${location.pathname}?assignees=${myName}&closedAfter=${weekAgo}`
          )
        }
      >
        I closed in last 7 days
      </Button>
      <Button
        onClick={() =>
          history.push(`${location.pathname}?closedAfter=${weekAgo}`)
        }
      >
        We closed in last 7 days
      </Button>
      <AgGridReact
        rowData={tasks}
        rowSelection="multiple"
        enableRangeSelection={true}
        onGridReady={onGridReady}
      >
        <AgGridColumn
          sortable
          filter="agTextColumnFilter"
          field="milestone"
          cellRenderer={getLinkRender("milestoneUrl", "milestone")}
        />
        <AgGridColumn
          width={600}
          sortable
          filter="agTextColumnFilter"
          field="title"
          cellRenderer={getLinkRender("url", "title")}
        />
        <AgGridColumn sortable filter="agTextColumnFilter" field="assignees" />
        <AgGridColumn
          sortable
          filter="agDateColumnFilter"
          field="createdAt"
          cellRenderer={dateRenderer}
        />
        <AgGridColumn
          sort="desc"
          sortable
          filter="agDateColumnFilter"
          field="updatedAt"
          cellRenderer={dateRenderer}
        />
        <AgGridColumn
          sortable
          filter="agDateColumnFilter"
          field="closedAt"
          cellRenderer={dateRenderer}
        />
        <AgGridColumn
          sortable
          filter="agTextColumnFilter"
          field="repo"
          cellRenderer={getLinkRender("repoUrl", "repo")}
        />
        <AgGridColumn
          sortable
          filter="agTextColumnFilter"
          field="project"
          cellRenderer={getLinkRender("projectUrl", "project")}
        />
      </AgGridReact>
    </div>
  );
};
