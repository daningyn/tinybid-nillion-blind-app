"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { BugAntIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Address } from "@/components/scaffold-eth";
import { Slider } from "@nextui-org/slider";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
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
      <div className="Section1 flex flex-row gap-x-4 w-full max-md:flex-col max-md:gap-y-4">
        <div className="Description flex flex-row gap-x-2 w-[25%] py-2 items-start max-md:w-full">
          <div className="title text-xl mb-auto">1.</div>
          <div className="desc text-[12px] font-normal">
            For each bidder, use the slider to choose a bid value and then click Bid. The bids are encoded.
          </div>
        </div>
        <div className="SliderContainer flex flex-row gap-x-6 w-[75%] max-md:gap-x-4 max-md:w-full">
          {
            [...Array(4)].map((_, i) => {
              return (
                <div key={`Slider-${i}`}
                  className="Slider flex flex-col gap-y-2 flex-grow border-[1px] rounded-md items-center p-4"
                >
                  <div className="Title text-sm font-medium w-full text-left max-lg:text-xs">
                    Bidder {i + 1}
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
                  <button className="BidButton rounded-md text-[12px] py-2 px-4 border-[1px] hover:bg-blue-400 max-lg:text-xs">
                    Bid
                  </button>
                </div>
              )
            })
          }
        </div>
      </div>
      <div className="Section2 flex flex-row gap-x-4 w-full max-md:flex-col max-md:gap-y-4">
        <div className="Description flex flex-row gap-x-2 w-[25%] py-2 items-start flex-shrink max-md:w-full">
          <div className="title text-xl mb-auto">2.</div>
          <div className="desc text-[12px] font-normal">
            The auction operator receives the result to determine the winner and their bid.
          </div>
        </div>
        <div className="Result flex flex-row gap-x-6 w-[75%] flex-grow max-md:gap-x-4 max-md:w-full">
          <textarea className="w-full flex flex-col gap-y-2 flex-grow border-[1px] rounded-md items-center p-4"></textarea>
        </div>
      </div>
    </div>
  );
};

export default Home;
