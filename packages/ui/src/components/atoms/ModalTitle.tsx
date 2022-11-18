export const ModalTitle = (props: { children: string }) => {
  return (
    <p className="font-faketion text-light-secondary text-center uppercase tracking-widest">
      {props.children}
    </p>
  );
};
