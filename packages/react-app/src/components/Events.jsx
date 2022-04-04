import { List } from "antd";
import { useEventListener } from "eth-hooks/events/useEventListener";
import { Address, TokenBalance } from "../components";

/*
  ~ What it does? ~

  Displays a lists of events

  ~ How can I use? ~

  <Events
    contracts={readContracts}
    contractName="YourContract"
    eventName="SetPurpose"
    localProvider={localProvider}
    mainnetProvider={mainnetProvider}
    startBlock={1}
  />
*/

export default function Events({ contracts, contractName, eventName, localProvider, mainnetProvider, startBlock }) {
  // 📟 Listen for broadcast events
  const events = useEventListener(contracts, contractName, eventName, localProvider, startBlock);

  return (
    <div style={{ width: 600, margin: "auto", marginTop: 32, paddingBottom: 32 }}>
      <h2>
        {eventName} Events
        <br />
        {eventName === "Approved"
          ? "✅ Address | Approved Amount"
          : eventName === "EthToTokenSwap"
          ? " ⟠ -->🎈 Address | Trade | Amount In | Amount Out"
          : eventName === "TokenToEthSwap"
          ? "🎈-->⟠ Address | Trade | Amount Out | Amount In"
          : eventName === "LiquidityProvided"
          ? "➕ Address | Liquidity Minted | ETH In | Balloons In"
          : "➖ Address | Liquidity Withdrawn | ETH Out | Balloons Out "}
      </h2>
      <List
        bordered
        dataSource={events}
        renderItem={item => {
          return (
            <List.Item key={item.blockNumber + "_" + item.args[0].toString()}>
              <Address address={item.args[0]} ensProvider={mainnetProvider} fontSize={16} />
              {eventName !== "Approved" &&
                (item.args[1].toString().indexOf("E") == -1 ? (
                  <TokenBalance balance={item.args[1]} provider={localProvider} />
                ) : (
                  `${item.args[1].toString()}`
                ))}
              {eventName !== "Approved" && <TokenBalance balance={item.args[2]} provider={localProvider} />}
              {eventName !== "Approved" && <TokenBalance balance={item.args[3]} provider={localProvider} />}
              {eventName === "Approved" && (
                <Address address={item.args[1]} ensProvider={mainnetProvider} fontSize={16} />
              )}
              {eventName === "Approved" && <TokenBalance balance={item.args[2]} provider={localProvider} />}
            </List.Item>
          );
        }}
      />
    </div>
  );
}
