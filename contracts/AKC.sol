// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AKC - AKASSECT Token
 * @dev BEP-20 Token on Binance Smart Chain
 * @notice Utility token for INFINIBIT ecosystem
 * 
 * Token Details:
 * - Name: AKASSECT
 * - Symbol: AKC
 * - Decimals: 18
 * - Total Supply: 300,000,000 AKC
 * 
 * Features:
 * - Fixed supply (minted once at deployment)
 * - Burnable by token holders
 * - Pausable by owner (emergency only)
 * - OpenZeppelin standard security
 * - No minting function (fixed supply)
 */
contract AKC is ERC20, ERC20Burnable, Pausable, Ownable {
    /// @notice Total supply: 300 million tokens with 18 decimals
    uint256 public constant TOTAL_SUPPLY = 300_000_000 * 10**18;
    
    /// @notice Emitted when tokens are paused
    event TokensPaused(address indexed by, uint256 timestamp);
    
    /// @notice Emitted when tokens are unpaused
    event TokensUnpaused(address indexed by, uint256 timestamp);
    
    /**
     * @dev Constructor mints entire supply to treasury address
     * @param treasury Address to receive the initial token supply
     * @notice Treasury should be a secure multisig wallet for mainnet
     */
    constructor(address treasury) ERC20("AKASSECT", "AKC") {
        require(treasury != address(0), "AKC: treasury is zero address");
        _mint(treasury, TOTAL_SUPPLY);
    }
    
    /**
     * @dev Pause all token transfers
     * @notice Only owner can pause (emergency use only)
     */
    function pause() external onlyOwner {
        _pause();
        emit TokensPaused(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Unpause all token transfers
     * @notice Only owner can unpause
     */
    function unpause() external onlyOwner {
        _unpause();
        emit TokensUnpaused(msg.sender, block.timestamp);
    }
    
    /**
     * @dev Hook that is called before any transfer of tokens
     * @notice Prevents transfers when contract is paused
     */
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);
        require(!paused(), "AKC: token transfer while paused");
    }
    
    /**
     * @dev Returns the number of decimals used for token amounts
     * @return uint8 The number of decimals (18)
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }
}
