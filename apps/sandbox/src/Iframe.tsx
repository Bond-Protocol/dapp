const basePath = "http://localhost:5173/#/embed";
const tnetwork = "0x71e47a4429d35827e0312aa13162197c23287546";
const afx = "0x62A665d3f9fc9a968dC35a789122981d9109349a";
const gdex = "0xeca93e266b914700a26cf3fe364fad4134f8ba94";

const gmx = "0xea8a734db4c7ea50c32b5db8a0cb811707e8ace3";
type EmbedProps = {
  owner?: string;
  width?: number;
};

export const EmbedMarket = ({ width = 550, owner }: EmbedProps) => {
  const marketsPath = `${basePath}/markets?owner=${owner ?? gmx}`;
  return (
    <iframe
      allowTransparency={true}
      src={marketsPath}
      width={width}
      height={650}
      style={{
        border: "none",
        background: "none",
      }}
    />
  );
};
