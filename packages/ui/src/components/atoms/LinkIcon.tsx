export const LinkIcon = (
  props: React.ImgHTMLAttributes<HTMLImageElement> & { href: string }
) => {
  return (
    <a
      href={props.href}
      className={`hover:text-light-secondary transition-all duration-300 ${props.className}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      {props.children}
    </a>
  );
};
