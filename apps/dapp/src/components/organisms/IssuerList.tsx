import { useEffect, useState } from "react";
import { getProtocols, Protocol } from "@bond-protocol/bond-library";
import { InfoLabel, IssuerCard } from "ui";
import { alphabeticSort, numericSort } from "services/sort";
import { useMarkets } from "hooks";
import { useAtom } from "jotai";
import testnetMode from "../../atoms/testnetMode.atom";
import { useOwnerTokenTbvs } from "hooks/useOwnerTokenTbvs";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "components/atoms/PageHeader";

export const IssuerList = () => {
  const { marketsByIssuer, issuers } = useMarkets();
  const { protocolTbvs } = useOwnerTokenTbvs();
  const navigate = useNavigate();

  const [testnet, setTestnet] = useAtom(testnetMode);
  const [search, setSearch] = useState("");
  const [sortedIssuers, setSortedIssuers] = useState<Protocol[]>(issuers);
  const [currentSort, setCurrentSort] = useState({
    sortBy: sortByTbv,
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

  function sortByTbv() {
    const ascending =
      currentSort.sortBy.toString() === sortByTbv.toString()
        ? !currentSort.ascending
        : false;

    sortIssuers((i1: Protocol, i2: Protocol) => {
      return numericSort(
        protocolTbvs?.get(i1.id) || 0,
        protocolTbvs?.get(i2.id) || 0,
        ascending
      );
    });
    setCurrentSort({ sortBy: sortByTbv, ascending: ascending });
  }

  /*
  const updateSearch = () => {
    setSearch(event.target.value);
  };
   */

  useEffect(() => {
    currentSort.sortBy();
  }, [issuers, marketsByIssuer, protocolTbvs, search]);

  return (
    <>
      <PageHeader title="Bond Issuers" />
      <div className="flex gap-x-5 py-10">
        <InfoLabel
          label="Total Value Bonded"
          tooltip="Total Value Bonded across all Issuers"
        >
          $26.5M
        </InfoLabel>
        <InfoLabel
          label="Unique Bonders"
          tooltip="Total unique addresses that interacted with protocol markets"
        >
          20K
        </InfoLabel>
        <InfoLabel
          label="Average Discount Rate"
          tooltip="Average discount at what bonds are acquired"
        >
          4%
        </InfoLabel>
      </div>
      <div className="mx-auto flex flex-wrap justify-center gap-x-6 gap-y-10">
        {sortedIssuers.map((issuer) => {
          if (issuer.name && issuer.name.toLowerCase().indexOf(search) != -1) {
            const markets = marketsByIssuer.get(issuer.id) || [];
            return (
              <div key={issuer.id} className="max-w-[169px] flex-1">
                <IssuerCard
                  issuer={issuer}
                  tbv={protocolTbvs?.get(issuer.id) || 0}
                  markets={markets}
                  navigate={navigate}
                />
              </div>
            );
          }
        })}
      </div>
    </>
  );
};
