export const ModalTitle = (props: { children: string }) => {
  return (
    <p className="font-faketion tracking-widest text-light-secondary uppercase text-center">
      {props.children}
    </p>
  );
};
