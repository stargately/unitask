import test from "ava";
import { getYearQuarterSprint } from "@/shared/common/quarter";

test("getYearQuarterSprint", async (t) => {
  t.deepEqual(getYearQuarterSprint(new Date("2021-12-31")), [2021, 4, 7]);
  t.deepEqual(getYearQuarterSprint(new Date("2022-1-3")), [2022, 1, 1]);
  t.deepEqual(getYearQuarterSprint(new Date("2022-1-20")), [2022, 1, 2]);
});
