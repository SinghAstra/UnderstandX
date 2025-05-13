"use client";

import { ComponentProps } from "react";

export default function PreCode({
  children,
  ...rest
}: ComponentProps<"pre"> & {
  raw?: string;
  filename?: string;
}) {
  return (
    <div className=" relative rounded  w-full mx-auto ">
      <div className="overflow-x-auto p-2 ">
        <pre {...rest}>{children}</pre>
      </div>
    </div>
  );
}
