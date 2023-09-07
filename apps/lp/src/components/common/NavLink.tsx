export const NavLink = (props: {
  url: string;
  label: string;
  className?: string;
  external?: boolean;
}) => {
  return (
    <a
      href={props.url}
      target={props.external ? "_blank" : "_self"}
      rel="noreferrer"
      className={`hover:text-light-secondary bp-transition my-auto font-mono uppercase ${props.className}`}
    >
      {props.label}
    </a>
  );
};
