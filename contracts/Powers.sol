//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Powers is ERC721 {

    address public owner;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    address public vrfContractAddress;
    address public marketContractAddress;



    struct Power {
        uint256 powerId;
        string name;
        string rarity;
        uint256 level;
        address owner;
    }

    mapping(uint256 => Power) public idToPower;
    mapping(address => Power[]) public powersOf;

    modifier onlyVRF() {
      require(msg.sender == vrfContractAddress);
      _;
    }

    modifier onlyOwner() {
      require(msg.sender == owner);
      _;
    }

    constructor() ERC721("Power", "PWR") {
        owner = msg.sender;
    }

    function setVrfContractAddress(address _vrfContractAddress) public onlyOwner {
      require(vrfContractAddress == address(0));
      vrfContractAddress = _vrfContractAddress;
    }

    function setMarketContractAddress(address _marketContractAddress) public onlyOwner {
      require(marketContractAddress == address(0));
      marketContractAddress = _marketContractAddress;
    }

    function _createToken(uint256 _random, string memory _name, address _owner) external onlyVRF {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();

        uint256 DNA = _random % 100;
        string memory _rarity;
        if(DNA > 0 && DNA < 49) {
            _rarity = "Comun";
        } else {
            _rarity = "Raro";
        }
        
        idToPower[newItemId] = Power({
            powerId: newItemId,
            name: _name,
            rarity: _rarity,
            level: 1,
            owner: _owner
        });
            
        setApprovalForAll(marketContractAddress, true);
        _safeMint(_owner, newItemId);
    }
}