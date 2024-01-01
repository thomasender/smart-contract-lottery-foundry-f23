// SPDX-License-Identifier: MIT

pragma solidity ^0.8.23;

import {VRFCoordinatorV2Interface} from "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import {VRFConsumerBaseV2} from "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

/**
 * @title Raffle Contract
 * @author Thomas Ender
 * @notice This contract is used to create a raffle
 * @dev implements Chainlink VRF v2
 */
contract Raffle is VRFConsumerBaseV2 {
    /** Errors */
    error Raffle__InvalidEntranceFee();
    error Raffle__TooEarlyToDraw();
    error Raffle__TransferFailed();
    error Raffle__RaffleNotOpen();
    error Raffle__UpKeepNotNeeded(
        uint256 currentBalance,
        uint256 numPlayers,
        uint256 raffleState
    );

    /** Type declarations */
    enum RaffleState {
        OPEN, // 0
        CALCULATING // 1
    }

    /** Constants */
    uint16 private constant REQUEST_CONFIRMATIONS = 3; // number of block confirmations
    uint32 private constant NUM_WORDS = 1; // number of random values requested

    /** Immutables */
    uint256 private immutable i_entranceFee;
    /// @dev time in seconds need to pass before a new winner can be drawn
    uint256 private immutable i_interval;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    bytes32 private immutable i_gasLane;
    uint64 private immutable i_subscriptionId;
    uint32 private immutable i_callbackGasLimit;

    address payable[] private s_players;
    uint256 private s_lastDrawTimestamp;
    address private s_recentWinner;
    RaffleState private s_raffleState;

    /** Events */
    event EnteredRaffle(address indexed player);
    event WinnerDrawn(address indexed winner);
    event RequestedRaffleWinner(uint256 indexed requestId);

    constructor(
        uint256 entranceFee,
        uint256 interval,
        address vrfCoordinator,
        bytes32 gasLane,
        uint64 subscriptionId,
        uint32 callbackGasLimit
    ) VRFConsumerBaseV2(vrfCoordinator) {
        i_entranceFee = entranceFee;
        i_interval = interval;
        i_vrfCoordinator = VRFCoordinatorV2Interface(vrfCoordinator);
        i_gasLane = gasLane;
        i_subscriptionId = subscriptionId;
        i_callbackGasLimit = callbackGasLimit;

        s_raffleState = RaffleState.OPEN;
        s_lastDrawTimestamp = block.timestamp;
    }

    function buyTicket() external payable {
        if (msg.value != i_entranceFee) {
            revert Raffle__InvalidEntranceFee();
        }
        if (s_raffleState != RaffleState.OPEN) {
            revert Raffle__RaffleNotOpen();
        }
        s_players.push(payable(msg.sender));
        emit EnteredRaffle(msg.sender);
    }

    /**
     * @notice This function is called by the Chainlink Automation node to see if it is time to draw a winner
     * @dev This is the function the Chainlink automation nodes call to see if it is time to perform the upkeep (=> draw a winner)
     * The following needs to be true for the upkeep to be performed:
     * 1. Enough time has passed since the last draw
     * 2. The raffle is in the OPEN state
     * 3. Tickets have been bought
     * 4. (Implicit!) The subscription has been fundend with LINK Token
     * @return upKeepNeeded
     * @return
     */
    function checkUpKeep(
        bytes memory /* checkData */
    ) public view returns (bool upKeepNeeded, bytes memory /* performData */) {
        bool itsTimeToDraw = (block.timestamp - i_interval) >=
            s_lastDrawTimestamp;
        bool isOpen = RaffleState.OPEN == s_raffleState;
        bool hasBalance = address(this).balance > 0;
        bool hasPlayers = s_players.length > 0;
        upKeepNeeded = (itsTimeToDraw && isOpen && hasBalance && hasPlayers);
        return (upKeepNeeded, "0x0");
    }

    // 1. Get random number to pick a player
    function performUpkeep(bytes calldata /* performData */) external {
        (bool upKeepNeeded, ) = checkUpKeep("");
        if (!upKeepNeeded) {
            revert Raffle__UpKeepNotNeeded(
                address(this).balance,
                s_players.length,
                uint256(s_raffleState)
            );
        }
        s_raffleState = RaffleState.CALCULATING;
        // Get the random number
        // Will revert if subscription is not set and funded.
        uint256 requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane, // gas lane (keyHash) see here: https://docs.chain.link/vrf/v2/subscription/supported-networks
            i_subscriptionId, // subscription funded with link
            REQUEST_CONFIRMATIONS, // number of block confirmations
            i_callbackGasLimit, // gas limit for callback
            NUM_WORDS // number of random values requested
        );

        // This is redundant, as the VRFCoordinator will emit a RandomWordsRequested event
        // For learning how to test this easier, we emit our own event
        emit RequestedRaffleWinner(requestId);
    }

    function fulfillRandomWords(
        uint256 /* requestId */,
        uint256[] memory randomWords
    ) internal override {
        /// @notice determines the index of the winner
        uint256 winnerIndex = randomWords[0] % s_players.length;
        /// @notice picks the winner from the list of players
        address payable winner = s_players[winnerIndex];
        /// @notice remembers the most recent winner
        s_recentWinner = winner;
        /// @notice sets the state to open again
        s_raffleState = RaffleState.OPEN;

        /// @notice the raffle is completed so we reset the players array
        s_players = new address payable[](0);
        /// @notice we reset the last draw timestamp so the raffle is restarted
        s_lastDrawTimestamp = block.timestamp;
        /// @notice sends the prize money to the winner of the raffle
        (bool success, ) = winner.call{value: address(this).balance}("");

        /// @notice emits the winner drawn event
        emit WinnerDrawn(winner);

        /// @notice in case something goes wrong with the transfer, we revert the transaction in order to save the money
        if (!success) {
            revert Raffle__TransferFailed();
        }
    }

    /** Getter Functions */

    function getEntranceFee() public view returns (uint256) {
        return i_entranceFee;
    }

    function getPlayers() public view returns (address payable[] memory) {
        return s_players;
    }

    function getPlayer(uint256 indexOfPlayer) public view returns (address) {
        return s_players[indexOfPlayer];
    }

    function getRaffleState() external view returns (RaffleState) {
        return s_raffleState;
    }

    function getRecentWinner() external view returns (address) {
        return s_recentWinner;
    }

    function getLastDrawTimestamp() external view returns (uint256) {
        return s_lastDrawTimestamp;
    }
}
