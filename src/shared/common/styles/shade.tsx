// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import shader from "shader";

export function shade(color: string): string {
  return shader(color, -0.09);
}
