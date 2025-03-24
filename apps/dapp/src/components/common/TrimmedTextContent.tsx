import { Tooltip } from "ui";

export default function TrimmedTextContent({ text }: { text: string }) {
  const trimmed = text.length > 7 && text.slice(0, 7) + "...";

  return trimmed ? (
    <Tooltip className="bg-opacity-40 backdrop-blur-sm" content={text}>
      {trimmed}
    </Tooltip>
  ) : (
    <>{text}</>
  );
}
