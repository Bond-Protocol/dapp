import { InfoLabel } from "ui";

export const Metrics = ({ className }: { className: string }) => {
  return (
    <div className={`grid gap-4 ${className}`}>
      <InfoLabel label="Total Value Bonded">
        $16M<span className="text-[32px]">+</span>
      </InfoLabel>
      <div className="flex gap-4">
        <InfoLabel label="Bonds Issued">
          600<span className="text-[32px]">+</span>
        </InfoLabel>
        <InfoLabel label="Bonds Markets">
          15<span className="text-[32px]">+</span>
        </InfoLabel>
      </div>
    </div>
  );
};
