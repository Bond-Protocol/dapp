import { useMyBonds } from "hooks/useMyBonds";
import { BondList } from "..";

export const UserBonds = () => {
  const { myBonds } = useMyBonds();

  //console.log({ myBonds });
  return (
    <div>
      <BondList data={myBonds} />
    </div>
  );
};
