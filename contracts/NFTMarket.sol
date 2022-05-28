//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract NFTMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter public itemsCounter;

    address nftContract;

    struct MarketItem {
        uint256 itemId;
        uint256 tokenId;
        uint256 price;
        address seller;
        address owner;
        bool sold;
    }

    MarketItem[] public allMarketItems;
    mapping(uint256 => MarketItem) public idToMarketItem;

    event MarketItemCreated(
        uint256 indexed itemId,
        address indexed seller,
        uint256 indexed price
    );

    event ItemSold(
        uint256 indexed itemId,
        address indexed newOwner,
        address indexed oldOwner
    );

    constructor(address _nftContract) {
        nftContract = _nftContract;
    }

    function listItem(uint256 _tokenId, uint256 _price) public nonReentrant {
        require(msg.sender == IERC721(nftContract).ownerOf(_tokenId), "You are not the owner of the NFT");
        _itemIds.increment();
        itemsCounter.increment();
        uint256 newItemId = _itemIds.current();
        
        idToMarketItem[newItemId] = MarketItem({
            itemId: newItemId,
            tokenId: _tokenId,
            price: _price,
            seller: msg.sender,
            owner: address(0),
            sold: false
        });

        allMarketItems.push(idToMarketItem[newItemId]);

        emit MarketItemCreated(newItemId, msg.sender, _price);

        IERC721(nftContract).transferFrom(idToMarketItem[newItemId].seller, address(this), _tokenId);
    }

    function buyItem(uint256 _itemId) public payable nonReentrant {
        require(msg.value == idToMarketItem[_itemId].price, "Please send the solicited amount");
        require(!idToMarketItem[_itemId].sold, "The item is already sold");
        itemsCounter.decrement();

        emit ItemSold(_itemId, msg.sender, idToMarketItem[_itemId].seller);

        idToMarketItem[_itemId].seller = address(0);
        idToMarketItem[_itemId].owner = msg.sender;
        idToMarketItem[_itemId].sold = true;

        IERC721(nftContract).transferFrom(address(this), msg.sender, idToMarketItem[_itemId].tokenId);
    }

    function fetchListedItems() public view returns (MarketItem[] memory) {
        return allMarketItems;
    }
}
