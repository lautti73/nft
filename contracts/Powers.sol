// SPDX-License-Identifier: MIT
pragma solidity ^0.8.8;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "hardhat/console.sol";

error AlreadyInitialized();
error NeedMoreETHSent();
error RangeOutOfBounds();

contract Powers is ERC721URIStorage, VRFConsumerBaseV2, Ownable {
    // Types
    enum Element{
		Air,
		Earth,
		Fire,
        Water  
    }

	enum Tier{
		Tier1,
		Tier2,
		Tier3
    }

    // Chainlink VRF Variables
	address private immutable i_vrfCoordinatorV2 = 0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed;
    VRFCoordinatorV2Interface private immutable i_vrfCoordinator;
    uint64 private immutable i_subscriptionId;
    bytes32 private immutable i_gasLane = 0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f;
    uint32 private immutable i_callbackGasLimit = 2000000;
    uint16 private constant REQUEST_CONFIRMATIONS = 3;
    uint32 private constant NUM_WORDS = 2;

    // NFT Variables
    uint256 private i_mintFee;
    uint256 public s_tokenCounter;
	mapping(uint256 => uint256) public tokenIdToPowerAmount;
    uint256 internal constant MAX_CHANCE_VALUE = 1000;
	uint256 internal constant ELEMENT_CHANCE = 250;
    string[3][4] internal s_powerTokenUris;
    bool private s_initialized;

    // VRF Helpers
    mapping(uint256 => address) public s_requestIdToSender;

    // Events
    event NftRequested(uint256 indexed requestId, address requester);
    event NftMinted(address indexed minter);

    constructor(
        uint64 subscriptionId,
        uint256 mintFee,
        string[3][4] memory powerTokenUris
    ) VRFConsumerBaseV2(i_vrfCoordinatorV2) ERC721("Power", "PWR") {
		i_vrfCoordinator = VRFCoordinatorV2Interface(i_vrfCoordinatorV2);
        i_subscriptionId = subscriptionId;
        i_mintFee = mintFee;
        _initializeContract(powerTokenUris);
    }

    function requestNft() public payable returns (uint256 requestId) {
        if (msg.value < i_mintFee) {
            revert NeedMoreETHSent();
        }
        requestId = i_vrfCoordinator.requestRandomWords(
            i_gasLane,
            i_subscriptionId,
            REQUEST_CONFIRMATIONS,
            i_callbackGasLimit,
            NUM_WORDS
        );

        s_requestIdToSender[requestId] = msg.sender;
        emit NftRequested(requestId, msg.sender);
    }

    function fulfillRandomWords(uint256 requestId, uint256[] memory randomWords) internal override {
        address powerOwner = s_requestIdToSender[requestId];
        uint256 newItemId = s_tokenCounter;
        s_tokenCounter = s_tokenCounter + 1;
        uint256 moddedRng1 = randomWords[0] % MAX_CHANCE_VALUE;
		uint256 moddedRng2 = randomWords[1] % MAX_CHANCE_VALUE; // 000 - 999
		uint256 additionalPower = randomWords[1] % 10;
        Element powerElement = getElementFromModdedRng(moddedRng1);
		Tier powerTier = getTierFromModdedRng(moddedRng2);
		tokenIdToPowerAmount[newItemId] = getBasePowerByTierArray(uint256(powerTier)) + additionalPower; 

        _safeMint(powerOwner, newItemId);
        _setTokenURI(newItemId, s_powerTokenUris[uint256(powerElement)][uint256(powerTier)]);
        emit NftMinted(powerOwner);
    }

    function getChanceArray() public pure returns (uint256[3] memory) {
        return [100, 300, MAX_CHANCE_VALUE];
    }

	function getBasePowerByTierArray(uint256 index) public pure returns (uint256) {
        uint8[3] memory basePower = [90, 65, 45];
		return uint256(basePower[index]);
    }

    function _initializeContract(string[3][4] memory powerTokenUris) private {
        if (s_initialized) {
            revert AlreadyInitialized();
        }
        s_powerTokenUris = powerTokenUris;
        s_initialized = true;
    }

	function getElementFromModdedRng(uint256 moddedRng) public pure returns (Element) {
        uint256 cumulativeSum = 0;
		uint256 totalElements = 4;
        for (uint256 i = 0; i < totalElements; i++) {
            if (moddedRng >= cumulativeSum && moddedRng < cumulativeSum + ELEMENT_CHANCE) {
                return Element(i);
            }
            cumulativeSum = cumulativeSum + ELEMENT_CHANCE;
        }
        revert RangeOutOfBounds();
    }

    function getTierFromModdedRng(uint256 moddedRng) public pure returns (Tier) {
        uint256 cumulativeSum = 0;
        uint256[3] memory chanceArracy = getChanceArray();
        for (uint256 i = 0; i < chanceArracy.length; i++) {
            if (moddedRng >= cumulativeSum && moddedRng < cumulativeSum + chanceArracy[i]) {
                return Tier(i);
            }
            cumulativeSum = cumulativeSum + chanceArracy[i];
        }
        revert RangeOutOfBounds();
    }

    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Transfer failed");
    }

    function getMintFee() public view returns (uint256) {
        return i_mintFee;
    }

    function getPowerTokenUris(uint256 elementIndex, uint256 tierIndex) public view returns (string memory) {
        return s_powerTokenUris[elementIndex][tierIndex];
    }

    function getInitialized() public view returns (bool) {
        return s_initialized;
    }

    function getTokenCounter() public view returns (uint256) {
        return s_tokenCounter;
    }
}