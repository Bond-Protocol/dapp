const basePath = "http://localhost:5173/#/embed";
const marketsPath = `${basePath}/markets?owner=0x71e47a4429d35827e0312aa13162197c23287546`;

export const Iframe = ({ width = 550 }) => {
  return (
    <iframe
      allowTransparency={true}
      src={marketsPath}
      width={width}
      height={550}
      style={{
        border: "none",
        background: "none",
      }}
    />
  );
};
