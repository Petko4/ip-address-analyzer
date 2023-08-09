"use client";
import { TableRecord } from "@/components/TableRecord";
import TextInput from "@/components/TextInput";
import useDebounceValidation from "@/hooks/useDebounceValidation";
import { isValidIpAddress } from "@/lib/validators";
import { FormEvent, useEffect, useRef, useState } from "react";
import IpAddress from "@/lib/IpAddress";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const isValid = useDebounceValidation(inputValue, isValidIpAddress);
  const [ipAddress, setIpAddress] = useState<IpAddress | null>(null);

  const handleChangeInput = (e: FormEvent<HTMLInputElement>) => {
    setInputValue(e.currentTarget.value);
  };

  const handleClickButton = () => {
    if (inputValue !== "" && isValid) {
      const [addressPart, netmaskPart] = inputValue.split("/");
      const address = addressPart.split(".").map((octet) => parseInt(octet));
      const netmask = parseInt(netmaskPart);
      const ipAddress = new IpAddress(address, netmask);

      setIpAddress(ipAddress);
    }
  };

  return (
    <main className="bg-my-black max-w-lg m-auto flex flex-col gap-4 items-center h-screen p-10 ">
      <h1 className="text-3xl">IP Address Analyzer</h1>
      <div className="flex flex-col items-center">
        <TextInput
          value={inputValue}
          onChange={handleChangeInput}
          placeholder="192.168.0.0/24"
          isValid={isValid}
        />
        {!isValid && (
          <p className="text-red-400 text-center italic">
            This is not valid IP address!
          </p>
        )}
      </div>
      <button
        className="bg-light-blue w-44 rounded-full hover:btn-shadow active:translate-y-1"
        type="submit"
        onClick={handleClickButton}
      >
        analyze
      </button>
      {ipAddress && (
        <table>
          <tbody>
            <TableRecord
              name="IP address"
              value={ipAddress.ipAddress.join(".")}
            />
            <TableRecord name="Version" value={String(ipAddress.version)} />
            <TableRecord
              name="Network address"
              value={
                ipAddress.networkAddress
                  ? ipAddress.networkAddress.join(".")
                  : "-"
              }
            />
            <TableRecord name="Netmask" value={ipAddress.netmask.join(".")} />
            <TableRecord
              name="Binary netmask"
              value={ipAddress.netmask
                .map((octet) => octet.toString(2).padStart(8, "0"))
                .join(".")}
            />
            <TableRecord
              name="Wildcard"
              value={ipAddress.wildcardAddress.join(".")}
            />
            <TableRecord
              name="Broadcast address"
              value={
                ipAddress.broadcastAddress
                  ? ipAddress.broadcastAddress.join(".")
                  : "-"
              }
            />

            <TableRecord
              name="First available address"
              value={
                ipAddress.firstAvailableAddress
                  ? ipAddress.firstAvailableAddress.join(".")
                  : "-"
              }
            />
            <TableRecord
              name="Last available address"
              value={
                ipAddress.lastAvailableAddress
                  ? ipAddress.lastAvailableAddress.join(".")
                  : "-"
              }
            />

            {/* <TableRecord
              name="Available host IP range"
              value="192.168.0.1 - 192.168.0.255"
            /> */}
            <TableRecord name="IP class" value={ipAddress.ipClass} />
            <TableRecord
              name="IP type"
              value={ipAddress.ipType ? ipAddress.ipType : "-"}
            />
          </tbody>
        </table>
      )}
    </main>
  );
}
