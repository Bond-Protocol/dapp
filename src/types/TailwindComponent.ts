import type { FC } from "react";

export type TailwindComponent = FC<{
  children?: React.ReactNode;
  className?: string;
}>;
