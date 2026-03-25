declare module "*.svg" {
  import * as React from "react";
  export const ReactComponent: React.forwardRef<React.SVGProps<SVGSVGElement>>;
}
