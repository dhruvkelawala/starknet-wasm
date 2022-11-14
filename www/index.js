import {
  pedersen_hash_rs,
  compute_class_hash_rs,
  compute_hash_on_elements_serde,
  compute_hash_on_elements_js_sys
} from "starknet-wasm";
import { hash, stark, ec, shortString, number } from "starknet";
import { bench } from "./bench";
import ArgentAccount from "./assets/ArgentAccount.json";
import ERC20 from "./assets/ERC20.json";
import OZAccount from "./assets/OZAccount.json";

const addr1 = stark.randomAddress();
const addr2 = stark.randomAddress();
const addr3 = stark.randomAddress();
const keyPair = ec.genKeyPair();

const starkKey = ec.getStarkKey(keyPair);

const elements = [
  "0x696e766f6b65",
  "1",
  addr3,
  addr2,
  addr1,
  shortString.encodeShortString("SN_GOERLI"),
  "0x3"
];

// Pedersen
const phrs = bench("pedersen_hash_rs", () => pedersen_hash_rs(addr1, addr2));
console.log("🚀 ~ file: index.js ~ line 32 ~ phrs", number.toHexString(phrs));
const phjs = bench("pedersen_js", () => hash.pedersen([addr1, addr2]));
console.log("🚀 ~ file: index.js ~ line 34 ~ phjs", phjs);

// Compute Class Hash
const erc20Stringify = JSON.stringify(ERC20);
const argentAccountStringify = JSON.stringify(ArgentAccount);
const ozStringify = JSON.stringify(OZAccount);

const erc20classHash = bench("compute_class_hash_rs - ERC20", () =>
  compute_class_hash_rs(erc20Stringify)
);
console.log(`ERC20 class hash: ${erc20classHash}`);

bench("compute_class_hash_rs - ArgentAccount", () => {
  const classHash = compute_class_hash_rs(argentAccountStringify);
  console.log(`ArgentAccount class hash: ${classHash}`);
});

bench("compute_class_hash_rs - OZ Account", () => {
  const classHash = compute_class_hash_rs(ozStringify);
  console.log(`OZ class hash: ${classHash}`)
});

const hashOnElementsJs = bench("compute_hash_on_elements_js", () =>
  hash.computeHashOnElements(elements)
);
console.log(
  "🚀 ~ file: index.js ~ line 59 ~ hashOnElementsJs",
  hashOnElementsJs
);

const hashOnElementsSerde = bench("compute_hash_on_elements_serde", () =>
  compute_hash_on_elements_serde(elements)
);
console.log(
  "🚀 ~ file: index.js ~ line 64 ~ hashOnElementsSerde",
  number.toHexString(hashOnElementsSerde)
);

const hashOnElementsJsSys = bench("compute_hash_on_elements_js_sys", () =>
  compute_hash_on_elements_js_sys(elements)
);
console.log(
  "🚀 ~ file: index.js ~ line 69 ~ hashOnElementsJsSys",
  number.toHexString(hashOnElementsJsSys)
);
