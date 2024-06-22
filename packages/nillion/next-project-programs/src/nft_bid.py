from nada_dsl import *

def findWinner(bids: list[SecretInteger]) -> SecretInteger:
    maxBid = SecretInteger(0)

    for i in range(len(bids)):
        if bids[i] > maxBid:
            maxBid = bids[i]

    return maxBid


def nada_main():

    # declare Party
    bidders = [Party(name="Bidder" + str(i)) for i in range(4)]
    calculator = Party(name="Calculator")

    # gather bids from each bidder
    bids: list[SecretInteger] = [SecretInteger(Input(name="bid_input" + str(i), party=bidders[i])) for i in range(4)]

    outputs: list[Output] = []

    # find the winner
    maxBid = findWinner(bids)

    # output the winner
    for i in range(len(bids)):
        if bids[i] == maxBid:
            outputs.append(Output(Integer(i), "winner", calculator))

    return outputs
