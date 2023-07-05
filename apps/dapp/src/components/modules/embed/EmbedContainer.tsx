export const EmbedContainer = ({ children }: any) => {
  return <div className="p-2">{children}</div>;
};

export const withEmbedContainer = (Component: any) => {
  return (props: any) => (
    <EmbedContainer>
      <Component {...props} />
    </EmbedContainer>
  );
};
