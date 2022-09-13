export const LinkIcon = (
  props: React.ImgHTMLAttributes<HTMLImageElement> & { href: string }
) => {
  return (
    <a href={props.href} className={props.className}>
      <img
        {...props}
        className="hover:cursor-pointer hover:fill-brand-yella hover:color-brand-yella"
      />
    </a>
  );
};
