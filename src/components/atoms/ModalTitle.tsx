export const ModalTitle = (props: { children: string }) => {
  return (
    <p className="text-center font-faketion uppercase tracking-widest text-light-secondary">
      {props.children}
    </p>
  );
};
