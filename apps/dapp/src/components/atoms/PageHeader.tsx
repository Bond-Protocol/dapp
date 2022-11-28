export interface PageHeaderProps {
  title?: string;
  className?: string;
}

export const PageHeader = (props: PageHeaderProps) => {
  return (
    <div className="flex font-fraktion uppercase">
      {props.title && <div className="text-5xl">{props.title}</div>}
    </div>
  );
};
