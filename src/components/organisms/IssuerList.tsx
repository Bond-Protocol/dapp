//@ts-nocheck
import { FC, useEffect, useRef, useState } from "react";
import { useCalculatedMarkets } from "hooks";
import { PROTOCOLS } from "@bond-labs/bond-library";
import { IssuerCard } from "components/molecules/IssuerCard";
import { Input } from "@material-tailwind/react";
import { alphabeticSort, numericSort } from "services/sort";
import { Button } from "components";

export const IssuerList: FC<any> = () => {
  const { marketsByIssuer, issuers } = useCalculatedMarkets();

  const [search, setSearch] = useState("");
  const [sortedIssuers, setSortedIssuers] = useState(issuers);
  const [currentSort, setCurrentSort] = useState({
    sortBy: sortByTbv,
    ascending: false,
  });

  const issuersRef = useRef(issuers);
  const tbvMapRef = useRef(new Map());

  const sortIssuers = function (
    compareFunction: (i1: string, i2: string) => number
  ) {
    const arr: string[] = [];
    issuersRef.current.forEach((issuer) => {
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
      alphabeticSort(PROTOCOLS.get(i1).name, PROTOCOLS.get(i2).name, ascending)
    );
    setCurrentSort({ sortBy: sortByName, ascending: ascending });
  }

  function sortByTbv() {
    const ascending =
      currentSort.sortBy.toString() === sortByTbv.toString()
        ? !currentSort.ascending
        : false;

    sortIssuers((i1: string, i2: string) =>
      numericSort(
        tbvMapRef.current.get(i1),
        tbvMapRef.current.get(i2),
        ascending
      )
    );
    setCurrentSort({ sortBy: sortByTbv, ascending: ascending });
  }

  const updateSearch = () => {
    setSearch(event.target.value);
  };

  useEffect(() => {
    issuersRef.current = issuers;

    const map = new Map();
    marketsByIssuer.forEach((value, key) => {
      let tbv = 0;
      value.forEach((market) => (tbv = tbv + market.tbvUsd));
      map.set(key, tbv);
    });
    tbvMapRef.current = map;

    currentSort.sortBy();
  }, [issuers, marketsByIssuer, search]);

  return (
    <>
      <p className="flex justify-start">
        <Input onChange={updateSearch} />
      </p>
      <p className="flex justify-start">
        <Button onClick={sortByName}>Sort by Name</Button>
        <Button onClick={sortByTbv}>Sort by TBV</Button>
      </p>
      {sortedIssuers.map((issuer) => {
        const protocol = PROTOCOLS.get(issuer);
        if (protocol.name.toLowerCase().indexOf(search) != -1)
          return (
            <IssuerCard
              key={issuer}
              issuer={protocol}
              markets={marketsByIssuer.get(issuer)}
            />
          );
      })}
    </>
  );
};
