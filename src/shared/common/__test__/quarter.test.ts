import test from "ava";
import { getYearQuarterSprint } from "@/shared/common/quarter";

test("getWeekNumber", async (t) => {
  const result = getYearQuarterSprint(new Date());
  t.deepEqual(result, [2021, 4, 6]);
});
