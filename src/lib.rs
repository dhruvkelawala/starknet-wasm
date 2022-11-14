mod utils;

use js_sys::Array;
use starknet::core::crypto::{compute_hash_on_elements, pedersen_hash};
use starknet::core::types::{ContractArtifact, FieldElement};
use wasm_bindgen::prelude::*;

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
pub fn pedersen_hash_rs(x: &str, y: &str) -> String {
    let x_field_element = FieldElement::from_hex_be(x).unwrap();
    let y_field_element = FieldElement::from_hex_be(y).unwrap();
    pedersen_hash(&x_field_element, &y_field_element).to_string()
}

#[wasm_bindgen]
pub fn compute_hash_on_elements_serde(data: JsValue) -> String {
    let elements: Vec<String> = serde_wasm_bindgen::from_value(data).unwrap();

    let field_elements = elements
        .iter()
        .map(|x| FieldElement::from_hex_be(x).unwrap())
        .collect::<Vec<FieldElement>>();

    compute_hash_on_elements(&field_elements).to_string()
}

#[wasm_bindgen]
pub fn compute_hash_on_elements_js_sys(data: Array) -> String {
    let elements = data
        .to_vec()
        .iter()
        .map(|x| {
            let x = x.as_string().unwrap();
            FieldElement::from_hex_be(&x).unwrap()
        })
        .collect::<Vec<FieldElement>>();

    compute_hash_on_elements(&elements).to_string()
}

#[wasm_bindgen]
pub fn compute_class_hash_rs(data: &str) -> String {
    let contract_artifact: ContractArtifact =
        serde_json::from_str::<ContractArtifact>(data).unwrap();
    let hash = contract_artifact.class_hash().unwrap();

    format!("{:#064x}", hash)
}
