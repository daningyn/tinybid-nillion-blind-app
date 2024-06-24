import { nillionConfig } from "./nillionConfig";

interface JsInput {
  name: string;
  value: string;
}

export async function compute(
  nillion: any,
  nillionClient: any,
  store_ids: string[],
  program_id: string,
  outputName: string,
  computeTimeSecrets: JsInput[] = [],
  publicVariables: JsInput[] = [],
): Promise<string> {
  try {
    // const storeIdSplit1 = store_ids[1].split(":");
    // const storeIdSplit2 = store_ids[2].split(":");
    // const storeIdSplit3 = store_ids[3].split(":");
    // const storeIds = {};

    // const storeIds = store_ids.map(store_id => store_id.split(":")[1]);
    // create program bindings with the program id
    const program_bindings = new nillion.ProgramBindings(program_id);

    // add input and output party details (name and party id) to program bindings
    const party_id = nillionClient.party_id;

    const splitId1 = store_ids[1].split(':');
    const splitId2 = store_ids[2].split(':');
    const splitId3 = store_ids[3].split(':');

    const storeIds = [];
    storeIds.push(store_ids[0]);
    storeIds.push(splitId1[1]);
    storeIds.push(splitId2[1]);
    storeIds.push(splitId3[1]);

    console.log("Bidder0", party_id);
    console.log("Bidder1", splitId1[0]);
    console.log("Bidder2", splitId2[0]);
    console.log("Bidder3", splitId3[0]);
    // add input party details (name and party id) to program bindings
    program_bindings.add_input_party('Bidder0', party_id);
    program_bindings.add_input_party('Bidder1', splitId1[0]);
    program_bindings.add_input_party('Bidder2', splitId2[0]);
    program_bindings.add_input_party('Bidder3', splitId3[0]);

    // add output party details (name and party id) to program bindings
    program_bindings.add_output_party('Bidder0', party_id);

    console.log("program_bindings", program_bindings);
    console.log("party_id", party_id);
    console.log("storeIds", storeIds);
    console.log("outputName", outputName);

    // create a compute time secrets object
    const compute_time_secrets = new nillion.Secrets();

    // iterate through computeTimeSecrets, inserting each into the compute_time_secrets object
    for (const compute_secret of computeTimeSecrets) {
      const newComputeTimeSecret = nillion.Secret.new_integer(compute_secret.value.toString());
      compute_time_secrets.insert(compute_secret.name, newComputeTimeSecret);
    }

    // create a public variables object
    const public_variables = new nillion.PublicVariables();

    // iterate through computeTimeSecrets, inserting each into the compute_time_secrets object
    for (const public_variable of publicVariables) {
      const newPublicVariable = nillion.Secret.new_integer(public_variable.value.toString());
      compute_time_secrets.insert(public_variable.name, newPublicVariable);
    }

    // compute
    const compute_result_uuid = await nillionClient.compute(
      nillionConfig.cluster_id,
      program_bindings,
      storeIds,
      compute_time_secrets,
      public_variables,
    );

    console.log("compute_result_uuid", compute_result_uuid);

    return await nillionClient.compute_result(compute_result_uuid);
  } catch (error: any) {
    console.log("error", error);
    return "error";
  }
}
