import {FC, useState} from "react";
import {useCalculatedMarkets} from "hooks";
import {PROTOCOLS} from "@bond-labs/bond-library";
import {IssuerCard} from "components/molecules/IssuerCard";
import {Input} from "@material-tailwind/react";

export const IssuerList: FC<any> = () => {
  const {marketsByIssuer, issuers} = useCalculatedMarkets();

  const [search, setSearch] = useState("");

  const updateSearch = () => {
    setSearch(event.target.value);
  };

  return (
    <>
      <p className="flex justify-start">
        <Input onChange={updateSearch} />
      </p>
      {issuers.map(issuer => {
        const protocol = PROTOCOLS.get(issuer);
        if (protocol.name.toLowerCase().indexOf(search) != -1) return (<IssuerCard key={issuer} issuer={protocol} markets={marketsByIssuer.get(issuer)}/>)
      })}
    </>
  );
};
