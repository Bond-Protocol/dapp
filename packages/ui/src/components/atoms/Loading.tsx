const words = [
  " bonds",
  " discounts",
  " charts",
  " oracles",
  " magic",
  " dreams",
  " memes",
  " pepes",
  " bullrun",
  " line 577",
  " hopium",
  " it back turbo",
];

const meme = () => words[Math.floor(Math.random() * words.length)];

export const Loading = ({ content }: { content?: string }) => {
  return (
    <div className="font-fraktion mt-20 text-center font-bold uppercase">
      <h1 className="text-5xl leading-normal">
        Hang on, <br />
        loading {content ?? meme()}
      </h1>
    </div>
  );
};
