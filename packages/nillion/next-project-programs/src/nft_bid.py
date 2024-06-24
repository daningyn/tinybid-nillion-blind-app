from nada_dsl import *

def nada_main():

    # declare Party
    bidders = [Party(name="Bidder" + str(i)) for i in range(4)]

    # gather bids from each bidder
    bids: list[SecretInteger] = [SecretInteger(Input(name="bid_input" + str(i), party=bidders[i])) for i in range(4)]

    outputs: list[Output] = []

    # find the winner
    maxBid = (
        (bids[0] > bids[1]).if_else(
            (bids[0] > bids[2]).if_else(
                (bids[0] > bids[3]).if_else(bids[0], bids[3]),
                (bids[2] > bids[3]).if_else(bids[2], bids[3])
            ),
            (bids[1] > bids[2]).if_else(
                (bids[1] > bids[3]).if_else(bids[1], bids[3]),
                (bids[2] > bids[3]).if_else(bids[2], bids[3])
            )
        )
    )

    # output the winner
    for i in range(len(bids)):
        outputs.append(Output(bids[i] == maxBid, "isWin" + str(i), bidders[0]))

    return outputs
