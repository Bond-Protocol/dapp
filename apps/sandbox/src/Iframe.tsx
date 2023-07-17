//const basePath = "http://localhost:5173/#/embed";

export const EmbedMarket = () => {
  const yourBondIssuerAddress = "";

  const path = `https://app.bondprotocol.finance/#/embed/markets?owner=${yourBondIssuerAddress}`;

  return (
    <div
      style={{
        position: "relative",
        minHeight: "460px",
        paddingTop: "25px",
        height: 0,
        width: 850,
      }}
    >
      <iframe
        allowTransparency={true}
        src={path}
        style={{
          border: "none",
          background: "none",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};
