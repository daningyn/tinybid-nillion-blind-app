"use client";

import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import CodeSnippet from "@/components/nillion/CodeSnippet";
import { CopyString } from "@/components/nillion/CopyString";
import { NillionOnboarding } from "@/components/nillion/NillionOnboarding";
import RetrieveSecretCommand from "@/components/nillion/RetrieveSecretCommand";
import SecretForm from "@/components/nillion/SecretForm";
import { Address } from "@/components/scaffold-eth";
import { compute } from "@/utils/nillion/compute";
import { getUserKeyFromSnap } from "@/utils/nillion/getUserKeyFromSnap";
import { retrieveSecretCommand } from "@/utils/nillion/retrieveSecretCommand";
import { retrieveSecretInteger } from "@/utils/nillion/retrieveSecretInteger";
import { storeProgram } from "@/utils/nillion/storeProgram";
import { storeSecretsInteger } from "@/utils/nillion/storeSecretsInteger";
import { Slider } from "@nextui-org/slider";
import { set } from "nprogress";

interface StringObject {
  [key: string]: string | null;
}

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();
  const [connectedToSnap, setConnectedToSnap] = useState<boolean>(false);
  const [userKey, setUserKey] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [userIdAdmin, setUserIdAdmin] = useState<string | null>(null);
  const [nillion, setNillion] = useState<any>(null);
  const [nillionClient, setNillionClient] = useState<any>(null);

  const [programName] = useState<string>("nft_bid");
  const [programId, setProgramId] = useState<string | null>(null);
  const [programIdInput, setProgramIdInput] = useState<string>("");
  const [computeResult, setComputeResult] = useState<string | null>(null);
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false);
  const [bidderIndex, setBidderIndex] = useState<string>("");
  const [partyName, setPatyName] = useState<string>("");
  const [secretName, setSecretName] = useState<string>("");
  const [secretValue, setSecretValue] = useState<string>("0");
  const [valueBidder, setValueBidder] = useState<string>("0");
  const [storeId1, setStoreId1] = useState<string>("");
  const [storeId2, setStoreId2] = useState<string>("");
  const [storeId3, setStoreId3] = useState<string>("");

  const [storedSecretsNameToStoreId, setStoredSecretsNameToStoreId] = useState<StringObject>({
    my_int1: null,
    my_int2: null,
  });
  const [parties] = useState<string[]>(["Bidder0"]);
  const [outputs] = useState<string[]>(["isWin"]);

  // connect to snap
  async function handleConnectToSnap() {
    const snapResponse = await getUserKeyFromSnap();
    setUserKey(snapResponse?.user_key || null);
    setConnectedToSnap(snapResponse?.connectedToSnap || false);
  }

  // store program in the Nillion network and set the resulting program id
  async function handleStoreProgram() {
    console.log("programName", programName);
    await storeProgram(nillionClient, programName).then(setProgramId);
    setIsDisabledButton(true);
  }

  async function handleRetrieveInt(secret_name: string, store_id: string | null) {
    if (store_id) {
      const value = await retrieveSecretInteger(nillionClient, store_id, secret_name);
      alert(`${secret_name} is ${value}`);
    }
  }

  // reset nillion values
  const resetNillion = () => {
    setConnectedToSnap(false);
    setUserKey(null);
    setUserId(null);
    setNillion(null);
    setNillionClient(null);
  };

  useEffect(() => {
    // when wallet is disconnected, reset nillion
    if (!connectedAddress) {
      resetNillion();
    }
  }, [connectedAddress]);

  // Initialize nillionClient for use on page
  useEffect(() => {
    if (userKey) {
      const getNillionClientLibrary = async () => {
        const nillionClientUtil = await import("@/utils/nillion/nillionClient");
        const libraries = await nillionClientUtil.getNillionClient(userKey);
        setNillion(libraries.nillion);
        setNillionClient(libraries.nillionClient);
        return libraries.nillionClient;
      };
      getNillionClientLibrary().then(nillionClient => {
        const user_id = nillionClient.user_id;
        setUserId(user_id);
      });
    }
  }, [userKey]);


  // handle bidder index
  function handleBidderIndex(value: string) {
    setBidderIndex(value);
    setPatyName("Bidder" + value);
    setSecretName("bid_input" + value);
  }

  function handleSliderChange(value: number) {
    console.log("Slider value: ", value);
    setValueBidder(value.toString());``
    setSecretValue(value.toString());
  }


  async function handleBidder() {
    if (programId) {
      console.log("programId", programId);
      console.log("secretName", secretName);
      console.log("partyName", partyName);
      console.log("secretValue", secretValue);

      const secrets = new nillion.Secrets();

      // create new SecretInteger with value cast to string
      const newSecret = nillion.Secret.new_integer(secretValue);
      // insert the SecretInteger into secrets object
      secrets.insert(secretName, newSecret);

      // create program bindings for secret so it can be used in a specific program
      const secret_program_bindings = new nillion.ProgramBindings(programId);

      // set the input party to the bindings to specify which party will provide the secret
      const party_id = nillionClient.party_id;
      secret_program_bindings.add_input_party(partyName, party_id);

      // get user id for user storing the secret
      const user_id = nillionClient.user_id;
      console.log("user_id", user_id);

      // create a permissions object, give the storer default permissions, including compute permissions with the program id
      const permissions = nillion.Permissions.default_for_user(user_id, programId);

      if (userIdAdmin) {
        console.log("userIdAdmin", userIdAdmin);
        const computePermissions: { [key: string]: string[] } = {};
        computePermissions[userIdAdmin] = [programId];
        console.log("computePermissions", computePermissions);
        permissions.add_compute_permissions(computePermissions);
      }

      // store secret(s) with bindings and permissions
      const store_id = await nillionClient.store_secrets(
        process.env.NEXT_PUBLIC_NILLION_CLUSTER_ID,
        secrets,
        secret_program_bindings,
        permissions,
      );
      console.log("party_id", party_id);
      console.log("store_id", store_id);
      console.log("party_ids_to_store_ids", party_id+':'+store_id);

      if (partyName == 'Bidder0') {
        const storeIds = [store_id, storeId1, storeId2, storeId3];
        const result = await compute(nillion, nillionClient, storeIds, programId, outputs[0]);
        console.log("result", result);
      }
    }
  }


  return (
    <>
      <div className="flex flex-col items-center max-w-[1280px] py-[60px] px-[10px] w-full gap-y-8">
        <div className="Header flex flex-col gap-y-4">
          <h1 className="text-[19px] font-bold">Blind app tinybid: Secure Single-Item First-Price Auction Demo</h1>
          <div className="description text-[13px] font-normal">
            This new program demonstrates a secure single-item first-price auction using the Nillion Nada program.
            <div className="line w-full h-[1px] bg-white mt-2"></div>
            <br />
            For each bid submitted by a bidder, it is transformed into a secret number within the Nada program.
            Once the time expires or the required number of bids is reached (in this case, if all bidders have submitted their bids, the program will calculate),
            the program calculates and reveals the bidders with the highest bids.
          </div>
        </div>
        <div className="px-5 flex flex-col">
          <h1 className="text-xl">
            {connectedAddress && connectedToSnap && !userKey && (
              <a target="_blank" href="https://nillion-snap-site.vercel.app/" rel="noopener noreferrer">
                <button className="btn btn-sm btn-primary mt-4">
                  No Nillion User Key - Generate and store user key here
                </button>
              </a>
            )}
          </h1>

          {connectedAddress && !connectedToSnap && (
            <button className="btn p-3 btn-sm btn-primary mt-4 bg-blue-600" onClick={handleConnectToSnap}>
              Connect to Snap
            </button>
          )}

          {connectedToSnap && (
            <div>
              {userKey && (
                <div>
                  <div className="flex justify-center items-center space-x-2">
                    <p className="my-2 font-medium">
                      User Key:
                    </p>
                    <CopyString str={userKey} />
                  </div>

                  {userId && (
                    <div className="flex justify-center items-center space-x-2">
                      <p className="my-2 font-medium">User ID:</p>
                      <CopyString str={userId} />
                    </div>
                  )}
                  <div className="flex justify-center items-center space-x-2">
                    <button className="btn p-3 btn-sm btn-primary mt-4 bg-blue-600" onClick={handleStoreProgram} disabled={isDisabledButton}>
                      Start Game
                    </button>
                  </div>

                  {!isDisabledButton ? (
                    <div>
                      <div className="flex justify-center items-center space-x-2">
                        <input
                          id="programId"
                          value={programId ? programId : ""}
                          onChange={e => setProgramId(e.target.value)}
                          placeholder="Program Id"
                          className="p-3 mt-4"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-center items-center space-x-2">
                      <p className="my-2 font-medium">Program ID:</p>
                      <CopyString str={programId ?? ""} />
                    </div>
                  )}

                  <div className="flex justify-center items-center space-x-2">
                    <input
                      id="userId"
                      value={userIdAdmin ? userIdAdmin : ""}
                      onChange={e => setUserIdAdmin(e.target.value)}
                      placeholder="User Id"
                      className="p-3 mt-4"
                    />
                  </div>
                </div>
              )}

              {programId && (
                <div>
                  <div className="flex justify-center items-center space-x-2 mt-20">
                    <img src="/image.png" alt="Mona Lisa" />
                  </div>

                  <div className="flex justify-center items-center space-x-2 mt-20">
                    <label>Bidder Index</label>
                    <input
                      value={bidderIndex}
                      onChange={e => handleBidderIndex(e.target.value)}
                      type={"number"}
                      className="p-1 w-20"
                    />
                  </div>

                  {bidderIndex == "0" && (
                    <div className="flex justify-center items-center space-x-2 mt-20">
                      <input
                        value={storeId1}
                        onChange={e => setStoreId1(e.target.value)}
                        className="p-1"
                        placeholder="Store id index 1"
                      />
                      <input
                        value={storeId2}
                        onChange={e => setStoreId2(e.target.value)}
                        className="p-1"
                        placeholder="Store id index 2"
                      />
                      <input
                        value={storeId3}
                        onChange={e => setStoreId3(e.target.value)}
                        className="p-1"
                        placeholder="Store id index 3"
                      />
                    </div>
                  )}

                  <div key={`Slider`}
                    className="Slider flex flex-col gap-y-2 flex-grow border-[1px] rounded-md items-center p-4 mt-10"
                  >
                    <div className="Title text-sm font-medium w-full text-left max-lg:text-xs">
                      Bidder{bidderIndex}
                    </div>
                    <div className="Slider max-lg:text-xs">
                      <Slider
                        className="h-[180px] "
                        size="lg"
                        step={1}
                        maxValue={15}
                        minValue={0}
                        orientation="vertical"
                        aria-label="Temperature"
                        defaultValue={0}
                        showSteps={false}
                        showTooltip={true}
                        onChange={handleSliderChange}
                        tooltipProps={{
                          offset: 10,
                          placement: "right",
                          classNames: {
                            base: [
                              "before:bg-gradient-to-r before:from-secondary-400 before:to-primary-500",
                            ],
                            content: [
                              "py-2 shadow-xl",
                              "text-white bg-gradient-to-r from-secondary-400 to-primary-500",
                            ],
                          },
                        }}
                      />
                    </div>
                    <button className="BidButton rounded-md text-[12px] py-2 px-4 border-[1px] hover:bg-blue-400 max-lg:text-xs"
                      onClick={handleBidder}
                    >
                      Bid
                    </button>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        <div className="flex-grow bg-base-300 w-full mt-16 px-8 py-12">
          <div className="flex justify-center items-center gap-12 flex-col sm:flex-row">
              <div>
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
