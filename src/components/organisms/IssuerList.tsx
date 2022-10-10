//@ts-nocheck
import { useEffect, useState } from "react";
import { getProtocols } from "@bond-protocol/bond-library";
import { IssuerCard } from "components/molecules/IssuerCard";
import { alphabeticSort, numericSort } from "services/sort";
import { useMarkets } from "hooks";
import {useBondPurchases} from "hooks/useBondPurchases";
import {useAtom} from "jotai";
import testnetMode from "../../atoms/testnetMode.atom";

export const IssuerList = () => {
  const { marketsByIssuer, issuers } = useMarkets();
  const { tbvByProtocol } = useBondPurchases();

  const [testnet, setTestnet] = useAtom(testnetMode);
  const [search, setSearch] = useState("");
  const [sortedIssuers, setSortedIssuers] = useState(issuers);
  const [currentSort, setCurrentSort] = useState({
    sortBy: sortByTbv,
    ascending: false,
  });

  const sortIssuers = function (
    compareFunction: (i1: string, i2: string) => number
  ) {
    const arr: string[] = [];
    getProtocols(testnet).forEach((issuer) => {
      arr.push(issuer);
    });
    setSortedIssuers(arr.sort(compareFunction));
  };

  function sortByName() {
    const ascending =
      currentSort.sortBy.toString() === sortByName.toString()
        ? !currentSort.ascending
        : true;

    sortIssuers((i1: string, i2: string) =>
      alphabeticSort(i1.name, i2.name, ascending)
    );
    setCurrentSort({ sortBy: sortByName, ascending: ascending });
  }

  function sortByTbv() {
    const ascending =
      currentSort.sortBy.toString() === sortByTbv.toString()
        ? !currentSort.ascending
        : false;

    sortIssuers((i1: string, i2: string) => {
        return numericSort(
          tbvByProtocol.get(i1.id),
          tbvByProtocol.get(i2.id),
          ascending
        )
      }
    );
    setCurrentSort({ sortBy: sortByTbv, ascending: ascending });
  }

  const updateSearch = () => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    currentSort.sortBy();
  }, [issuers, marketsByIssuer, tbvByProtocol, search]);

  return (
    <>
      {/* hiding search for now as there'll be little partners
      <p className="flex justify-start">
        <Input onChange={updateSearch} />
      </p>
      <p className="flex justify-start">
        <Button onClick={sortByName}>Sort by Name</Button>
        <Button onClick={sortByTbv}>Sort by TBV</Button>
      </p>
        */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 2xl:grid-cols-7 gap-8">
        {sortedIssuers.map((issuer) => {
          if (issuer.name && issuer.name.toLowerCase().indexOf(search) != -1) {
            const markets = marketsByIssuer.get(issuer.id) || [];
            return (
              <IssuerCard
                key={issuer.id}
                issuer={issuer}
                markets={markets}
              />
            );
          }
        })}
      </div>
    </>
  );
};
