import {useEffect, useState} from "react";
import {getProtocols, Protocol} from "@bond-protocol/bond-library";
import {IssuerCard} from "components/molecules/IssuerCard";
import {alphabeticSort, numericSort} from "services/sort";
import {useMarkets} from "hooks";
import {useBondPurchases} from "hooks/useBondPurchases";
import {useAtom} from "jotai";
import testnetMode from "../../atoms/testnetMode.atom";

export const IssuerList = () => {
  const { marketsByIssuer, issuers } = useMarkets();
  const { tvbByProtocol } = useBondPurchases();

  const [testnet, setTestnet] = useAtom(testnetMode);
  const [search, setSearch] = useState("");
  const [sortedIssuers, setSortedIssuers] = useState<Protocol[]>(issuers);
  const [currentSort, setCurrentSort] = useState({
    sortBy: sortByTvb,
    ascending: false,
  });

  const sortIssuers = function (
    compareFunction: (i1: Protocol, i2: Protocol) => number
  ) {
    const arr: Protocol[] = [];
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

    sortIssuers((i1: Protocol, i2: Protocol) =>
      alphabeticSort(i1.name, i2.name, ascending)
    );
    setCurrentSort({ sortBy: sortByName, ascending: ascending });
  }

  function sortByTvb() {
    const ascending =
      currentSort.sortBy.toString() === sortByTvb.toString()
        ? !currentSort.ascending
        : false;

    sortIssuers((i1: Protocol, i2: Protocol) => {
      return numericSort(
        tvbByProtocol.get(i1.id) || 0,
        tvbByProtocol.get(i2.id) || 0,
        ascending
      );
    });
    setCurrentSort({ sortBy: sortByTvb, ascending: ascending });
  }

  /*
  const updateSearch = () => {
    setSearch(event.target.value);
  };
   */

  useEffect(() => {
    currentSort.sortBy();
  }, [issuers, marketsByIssuer, tvbByProtocol, search]);

  return (
    <>
      {/* hiding search for now as there'll be little partners
      <p className="flex justify-start">
        <Input onChange={updateSearch} />
      </p>
      <p className="flex justify-start">
        <Button onClick={sortByName}>Sort by Name</Button>
        <Button onClick={sortByTvb}>Sort by TVB</Button>
      </p>
        */}
      <div className="mt-8 flex flex-wrap gap-x-12 gap-y-10">
        {sortedIssuers.map((issuer) => {
          if (issuer.name && issuer.name.toLowerCase().indexOf(search) != -1) {
            const markets = marketsByIssuer.get(issuer.id) || [];
            return (
              <div key={issuer.id} className="w-full flex-1">
                <IssuerCard issuer={issuer} markets={markets} />
              </div>
            );
          }
        })}
      </div>
    </>
  );
};
