import { useLayoutEffect, useRef, useState } from "react";
import { useEffect } from "react";

export const Background = ({ children }: { children?: React.ReactNode }) => {
  const [bgSize, setBgSize] = useState(0);

  useLayoutEffect(() => {
    let body = document.body,
      html = document.documentElement;

    let heights = [
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight,
    ];

    console.log({
      heights,
    });
    setBgSize();
  }, []);

  return (
    <div className="h-full w-full border">
      <div
        className={`main-bg-fill absolute w-full`}
        style={{ height: `${bgSize}px` }}
      >
        <div className="main-bg h-full w-full" />
        <div className="main-fade h-full w-full" />
      </div>
      <div className="absolute inset-0 isolate">{children}</div>
    </div>
  );
};
