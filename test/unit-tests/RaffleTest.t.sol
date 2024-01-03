// SPDX-License-Identifier: MIT

pragma solidity ^0.8.23;

import {DeployRaffle} from "../../script/DeployRaffle.s.sol";
import {Raffle} from "../../src/Raffle.sol";
import {Test, console} from "forge-std/Test.sol";
import {HelperConfig} from "../../script/HelperConfig.s.sol";
import {Vm} from "forge-std/Vm.sol";
import {VRFCoordinatorV2Mock} from "@chainlink/contracts/src/v0.8/mocks/VRFCoordinatorV2Mock.sol";

contract RaffleTest is Test {
    /** Events */
    event EnteredRaffle(address indexed player);

    /** Variables */
    Raffle raffle;
    HelperConfig helperConfig;
    uint256 entranceFee;
    uint256 interval;
    address vrfCoordinator;
    bytes32 gasLane;
    uint64 subscriptionId;
    uint32 callbackGasLimit;
    address linkToken;

    // creates a new address from a string
    address public PLAYER = makeAddr("player");
    uint256 public constant STARTING_USER_BALANCE = 10e18;

    function setUp() external {
        DeployRaffle deployer = new DeployRaffle();
        (raffle, helperConfig) = deployer.run();
        (
            entranceFee,
            interval,
            vrfCoordinator,
            gasLane,
            subscriptionId,
            callbackGasLimit,
            linkToken,

        ) = helperConfig.activeNetworkConfig();
        vm.deal(PLAYER, STARTING_USER_BALANCE);
    }

    function testRaffleInitializesInOpenState() public view {
        assert(raffle.getRaffleState() == Raffle.RaffleState.OPEN);
    }

    ////////////////////////
    /// enterRaffle ///////
    //////////////////////

    function testRaffleRevertsIfEntryFeeIsNotCorrect() public {
        // Arrange
        vm.prank(PLAYER);
        // Act / Assert
        vm.expectRevert(Raffle.Raffle__InvalidEntranceFee.selector);
        raffle.buyTicket();
    }

    function testRaffleRecordsPlayerOnEntry() public {
        vm.prank(PLAYER);
        raffle.buyTicket{value: entranceFee}();
        address newPlayer = raffle.getPlayer(0);
        assert(newPlayer == PLAYER);
    }

    function testRaffleEmitsEventOnEntry() public {
        vm.prank(PLAYER);
        /// @dev checks for the event with the first topic (true) and not other topics (false, false) and not checkData (false)
        vm.expectEmit(true, false, false, false, address(raffle));
        emit EnteredRaffle(PLAYER);

        raffle.buyTicket{value: entranceFee}();
    }

    modifier TicketBoughtAndEnoughTimePassed() {
        vm.prank(PLAYER);
        raffle.buyTicket{value: entranceFee}();
        // Move forward in time to make the raffle state calculating
        vm.warp(block.timestamp + interval + 1);
        // roll the block number forward
        vm.roll(block.number + 1);
        _;
    }

    function testCantEnterWhenRaffleStateIsCalculating()
        public
        TicketBoughtAndEnoughTimePassed
    {
        // We now should be able to call performUpKeep to pick a winner
        // We call it with some empty data
        raffle.performUpkeep("");

        // raffle contract should now be in the CALCULATING state
        // So if we try to enter the raffle again, it should revert with Raffle__RaffleNotOpen
        vm.expectRevert(Raffle.Raffle__RaffleNotOpen.selector);
        vm.prank(PLAYER);
        raffle.buyTicket{value: entranceFee}();
    }

    ///////////////////////////////////////
    ///////// checkUpKeep /////////////////
    /////////////////////////////////////

    function testCheckUpKeepReturnsFalseIfItHasNoBalance() public {
        // Arrange
        vm.warp(block.timestamp + interval);
        vm.roll(block.number + 1);

        // Act
        (bool upKeepNeeded, ) = raffle.checkUpkeep("");

        assert(!upKeepNeeded);
    }

    function testCheckUpKeepShouldReturnFalseIfRaffleStateIsCalculating()
        public
        TicketBoughtAndEnoughTimePassed
    {
        // Arrange
        raffle.performUpkeep("");

        // Act
        (bool upKeepNeeded, ) = raffle.checkUpkeep("");

        // Assert
        assert(!upKeepNeeded);
    }

    function testCheckUpKeepReturnsFalseIfNotEnoughTimeHasPassed() public {
        // Arrange
        vm.prank(PLAYER);
        raffle.buyTicket{value: entranceFee}();
        vm.warp(block.timestamp + interval - 1);
        vm.roll(block.number + 1);

        // Act
        (bool upKeepNeeded, ) = raffle.checkUpkeep("");

        // Assert
        assert(!upKeepNeeded);
    }

    function testCheckUpKeepShouldReturnTrueIfAllParametersAreValid()
        public
        // Arrange
        TicketBoughtAndEnoughTimePassed
    {
        // Act
        (bool upKeepNeeded, ) = raffle.checkUpkeep("");

        // Assert
        assert(upKeepNeeded);
    }

    ///////////////////////////////////////
    ///////// performUpkeep ///////////////
    /////////////////////////////////////

    function testPerformUpkeepRevertsWithRaffleUpKeepNotNeededIfUpKeepNeededIsFalse()
        public
    {
        // Arrange
        uint256 currentBalance = 0;
        uint256 numPlayers = 0;
        Raffle.RaffleState raffleState = raffle.getRaffleState();
        vm.warp(block.timestamp + interval + 1);
        vm.roll(block.number + 1);
        // Act / Assert
        vm.expectRevert(
            abi.encodeWithSelector(
                Raffle.Raffle__UpKeepNotNeeded.selector,
                currentBalance,
                numPlayers,
                raffleState
            )
        );
        raffle.performUpkeep("");
    }

    function testPerformUpkeepRunsSuccessfullyIfCheckUpkeepIsTrue()
        public
        // Arrange
        TicketBoughtAndEnoughTimePassed
    {
        // Act / Assert
        // Calling the function should not revert
        raffle.performUpkeep("");
    }

    // How to test using the output of an event?
    // In a regular contract we never can get hold of the event output
    // But in a test we can
    function testPerformUpkeepUpdatesRaffleStateAndEmitsRequestId()
        public
        TicketBoughtAndEnoughTimePassed
    {
        // Act / Assert
        vm.recordLogs(); // Starts recording the logs
        raffle.performUpkeep(""); // Emits requestId
        Vm.Log[] memory logs = vm.getRecordedLogs();
        // Logs are saved as bytes32 in Foundry
        // The topic at index 0 refers to the entire event
        // The topic at index 1 refers to the requestId (which is the first indexed parameter emitted in this event here)
        bytes32 requestId = logs[1].topics[1];
        // We can now use the requestId to check if the event was emitted
        assert(uint256(requestId) > 0);
        assert(raffle.getRaffleState() == Raffle.RaffleState.CALCULATING);
    }

    ///////////////////////////////////////
    ////////// fulfillRandomWords /////////
    /////////////////////////////////////

    modifier skipTestingOnFork() {
        if (block.chainid != 31337) {
            return;
        }
        _;
    }

    function testFulfillRandomWordsCanOnlyBeCalledAfterPerformUpkeep(
        uint256 randomRequestId
    ) public TicketBoughtAndEnoughTimePassed skipTestingOnFork {
        // Arrange
        /// @dev see VRFCoordinatorV2Mock for the revert reason
        vm.expectRevert("nonexistent request");
        VRFCoordinatorV2Mock(vrfCoordinator).fulfillRandomWords(
            randomRequestId,
            address(raffle)
        );
    }

    function testFulfillRandomWordsPicksAWinnerResetsRaffleAndTransfersPriceMoney()
        public
        TicketBoughtAndEnoughTimePassed
        skipTestingOnFork
    {
        // Arrange
        // Modifier TicketBoughtAndEnoughTimePassed already adds 1 Player to the raffle
        // We want to add a couple more players
        uint256 additionalEntrances = 5;
        uint256 startingIndex = 1;
        for (
            uint256 i = startingIndex;
            i < startingIndex + additionalEntrances;
            i++
        ) {
            address player = address(uint160(i)); // Also creates an address, makeAdr could also be used
            hoax(player, STARTING_USER_BALANCE); // hoax(player, STARTING_USER_BALANCE) is equivalent to vm.prank(player) && vm.deal(player, STARTING_USER_BALANCE)
            raffle.buyTicket{value: entranceFee}();
        }

        uint256 priceMoney = entranceFee * (additionalEntrances + 1);

        // Act
        // We need the requestId to call fulfillRandomWords
        // Calling performUpkeep emits the requestId
        // We can get the requestId from the logs
        vm.recordLogs(); // Start recording the logs
        raffle.performUpkeep(""); // Emits requestId
        Vm.Log[] memory logs = vm.getRecordedLogs();
        // The topic at index 1 refers to the requestId (which is the first indexed parameter emitted in this event here)
        bytes32 requestId = logs[1].topics[1];

        // Take note of the current s_lastDrawTimestamp
        uint256 previousLastDrawTimestamp = raffle.getLastDrawTimestamp();

        // pretend to be Chainlink VRF to trigger fulfillRandomWords
        VRFCoordinatorV2Mock(vrfCoordinator).fulfillRandomWords(
            // We need to cast to uint256
            uint256(requestId),
            address(raffle)
        );

        address recentWinner = raffle.getRecentWinner();

        // Assert
        assert(
            uint256(raffle.getRaffleState()) == uint256(Raffle.RaffleState.OPEN)
        );
        assert(recentWinner != address(0));
        assert(raffle.getPlayers().length == 0);
        assert(previousLastDrawTimestamp < raffle.getLastDrawTimestamp());
        console.log("recentWinner", recentWinner.balance);
        console.log(
            "STARTING_USER_BALANCE + priceMoney",
            STARTING_USER_BALANCE + priceMoney
        );
        assert(
            recentWinner.balance ==
                STARTING_USER_BALANCE + priceMoney - entranceFee
        );
    }
}
