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
import { styled } from "onefx/lib/styletron-react";
import { margin } from "polished";
import { formatDistance } from "date-fns";
import Search from "antd/lib/input/Search";

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
  if (!params.value) {
    return "";
  }
  try {
    const date = new Intl.DateTimeFormat("en-US", {
      dateStyle: "short",
      // timeStyle: "short",
    }).format(params.value);
    const when = formatDistance(params.value, new Date(), {
      addSuffix: false,
    }).replace("about ", "");
    return `${date}, ${when}`;
  } catch (_) {
    return "";
  }
};

const filterOptions = [
  "empty",
  {
    displayKey: "blank",
    displayName: "Empty",
    test(_filterValue: string, cellValue: string): boolean {
      return !cellValue;
    },
    hideFilterInput: true,
  },
  "contains",
  "notContains",
  "startsWith",
  "endsWith",
  {
    displayKey: "containsOrEmpty",
    displayName: "Contains or Empty",
    test(filterValue: string, cellValue: string): boolean {
      if (!cellValue) {
        return true;
      }
      return (
        !!filterValue &&
        cellValue.toLowerCase().includes(filterValue.toLowerCase())
      );
    },
  },
];

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const Catetory = styled("span", {
  ...margin(0, "12px", 0, "16px"),
});

const daysAgo = (days: number) =>
  new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.toISOString().slice(0, 10);
};

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
        type: "containsOrEmpty",
        filter: assignees,
      };
    }
    const notAssignees = query.get("notAssignees");
    if (notAssignees) {
      customFilter.assignees = {
        type: "notContains",
        filter: notAssignees,
      };
    }
    const closedAfter = query.get("closedAfter");
    if (closedAfter) {
      customFilter.closedAt = {
        type: "greaterThan",
        dateFrom: closedAfter,
      };
    }
    const updatedAfter = query.get("updatedAfter");
    if (updatedAfter) {
      customFilter.updatedAt = {
        type: "greaterThan",
        dateFrom: updatedAfter,
      };
    }
    const search = query.get("search");
    if (search) {
      customFilter.title = {
        type: "contains",
        filter: search,
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

  const today = getToday();

  return (
    <div className="ag-theme-alpine" style={{ height: "100vh", width: "100%" }}>
      <Button onClick={() => clearFilters()}>Clear Filters</Button>

      <Catetory />

      <Button
        onClick={() => history.push(`${location.pathname}?assignees=${myName}`)}
      >
        My tasks
      </Button>
      <Button
        onClick={() =>
          history.push(`${location.pathname}?notAssignees=${myName}`)
        }
      >
        Not my tasks
      </Button>
      <Button
        onClick={() =>
          history.push(
            `${location.pathname}?assignees=${myName}&updatedAfter=${today}`
          )
        }
      >
        My tasks updated today
      </Button>

      <Search
        autoComplete="on"
        placeholder="Filter title"
        onSearch={(value) =>
          history.push(`${location.pathname}?search=${value}`)
        }
        style={{ width: 200 }}
      />

      <Catetory />

      {location.pathname.indexOf("open") === -1 && (
        <>
          <Button
            onClick={() =>
              history.push(
                `${location.pathname}?assignees=${myName}&closedAfter=${daysAgo(
                  7
                )}`
              )
            }
          >
            I closed in last 7 days
          </Button>
          <Button
            onClick={() =>
              history.push(`${location.pathname}?closedAfter=${daysAgo(7)}`)
            }
          >
            We closed in last 7 days
          </Button>
        </>
      )}

      <AgGridReact
        rowData={tasks}
        rowSelection="multiple"
        enableRangeSelection={true}
        onGridReady={onGridReady}
      >
        <AgGridColumn
          sortable
          filter="agTextColumnFilter"
          filterParams={{ filterOptions }}
          field="repo"
          cellRenderer={getLinkRender("repoUrl", "repo")}
        />
        <AgGridColumn
          sortable
          filter="agTextColumnFilter"
          filterParams={{ filterOptions }}
          field="milestone"
          cellRenderer={getLinkRender("milestoneUrl", "milestone")}
        />
        <AgGridColumn
          width={600}
          sortable
          filter="agTextColumnFilter"
          filterParams={{ filterOptions }}
          field="title"
          cellRenderer={getLinkRender("url", "title")}
        />
        <AgGridColumn
          sortable
          filterParams={{ filterOptions }}
          filter="agTextColumnFilter"
          field="assignees"
        />
        <AgGridColumn
          sortable
          filter="agDateColumnFilter"
          field="createdAt"
          width={170}
          cellRenderer={dateRenderer}
        />
        <AgGridColumn
          sort="desc"
          sortable
          filter="agDateColumnFilter"
          field="updatedAt"
          width={170}
          cellRenderer={dateRenderer}
        />
        <AgGridColumn
          sortable
          filter="agDateColumnFilter"
          field="closedAt"
          width={170}
          cellRenderer={dateRenderer}
        />
        <AgGridColumn
          sortable
          filter="agTextColumnFilter"
          filterParams={{ filterOptions }}
          field="project"
          cellRenderer={getLinkRender("projectUrl", "project")}
        />
      </AgGridReact>
    </div>
  );
};
