import { MapLevel, zip, constMap } from "../utils";
import { Network } from "./networks";
import { Chain } from "./chains";

const circleAPIs = [
  ["Mainnet", "https://iris-api.circle.com/v1/attestations"],
  ["Testnet", "https://iris-api-sandbox.circle.com/v1/attestations"],
] as const satisfies MapLevel<Network, string>;

// https://developers.circle.com/stablecoin/docs/cctp-technical-reference#domain-list
const circleDomains = [
  ["Ethereum", 0],
  ["Avalanche", 1],
  ["Optimism", 2],
  ["Arbitrum", 3],
  ["Solana", 5],
  ["Base", 6],
  ["Polygon", 7],
] as const satisfies MapLevel<Chain, number>;

const usdcContracts = [
  [
    "Mainnet",
    [
      ["Ethereum", "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"],
      ["Avalanche", "0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e"],
      ["Arbitrum", "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"],
      ["Optimism", "0x179522635726710dd7d2035a81d856de4aa7836c"],
      ["Solana", "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v"],
      ["Base", "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913"],
      ["Polygon", "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359"]
    ],
  ],
  [
    "Testnet",
    [
      ["Avalanche", "0x5425890298aed601595a70AB815c96711a31Bc65"],
      ["Arbitrum", "0xfd064A18f3BF249cf1f87FC203E90D8f650f2d63"],
      ["Ethereum", "0x07865c6e87b9f70255377e024ace6630c1eaa37f"],
      ["Optimism", "0xe05606174bac4A6364B31bd0eCA4bf4dD368f8C6"],
      ["Solana", "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU"],
      ["Base", "0xf175520c52418dfe19c8098071a252da48cd1c19"],
    ],
  ],
] as const satisfies MapLevel<Network, MapLevel<Chain, string>>;

export const [circleChains, circleChainIds] = zip(circleDomains);
export type CircleChain = (typeof circleChains)[number];
export type CircleChainId = (typeof circleChainIds)[number];

export const [circleNetworks, _] = zip(usdcContracts);
export type CircleNetwork = (typeof circleNetworks)[number];

export const circleChainId = constMap(circleDomains);
export const circleChainIdToChain = constMap(circleDomains, [1, 0]);
export const circleAPI = constMap(circleAPIs);

export const usdcContract = constMap(usdcContracts);

export const isCircleChain = (chain: string): chain is CircleChain => circleChainId.has(chain);

export const isCircleChainId = (chainId: number): chainId is CircleChainId =>
  circleChainIdToChain.has(chainId);

export const isCircleSupported = (network: Network, chain: string): network is CircleNetwork =>
  usdcContract.has(network, chain);

export function assertCircleChainId(chainId: number): asserts chainId is CircleChainId {
  if (!isCircleChainId(chainId)) throw Error(`Unknown Circle chain id: ${chainId}`);
}

export function assertCircleChain(chain: string): asserts chain is CircleChain {
  if (!isCircleChain(chain)) throw Error(`Unknown Circle chain: ${chain}`);
}

//safe assertion that allows chaining
export const asCircleChainId = (chainId: number): CircleChainId => {
  assertCircleChainId(chainId);
  return chainId;
};

export const toCircleChainId = (chain: number | bigint | string): CircleChainId => {
  switch (typeof chain) {
    case "string":
      if (isCircleChain(chain)) return circleChainId(chain);
      break;
    case "number":
      if (isCircleChainId(chain)) return chain;
      break;
    case "bigint":
      const ci = Number(chain);
      if (isCircleChainId(ci)) return ci;
      break;
  }
  throw Error(`Cannot convert to ChainId: ${chain}`);
};

export const toCircleChain = (chain: number | string | bigint): CircleChain => {
  switch (typeof chain) {
    case "string":
      if (isCircleChain(chain)) return chain;
      break;
    case "number":
      if (isCircleChainId(chain)) return circleChainIdToChain(chain);
      break;
    case "bigint":
      const cid = Number(chain);
      if (isCircleChainId(cid)) return circleChainIdToChain(cid);
      break;
  }
  throw Error(`Cannot convert to Chain: ${chain}`);
};
