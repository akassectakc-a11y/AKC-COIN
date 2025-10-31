# 📝 AKC Token Information Sheet (English)

> **Complete Technical Specifications for Exchange Integration**

---

## 🎯 Executive Summary

**AKASSECT (AKC)** is a **BEP-20 standard** utility token built on Binance Smart Chain (BSC), designed to power the AINOVA ecosystem. With a fixed supply of 300 million tokens and full compliance with industry standards, AKC provides a secure and reliable digital asset for the DeFi community.

---

## 🪙 Token Specifications

### Basic Information

```json
{
  "name": "AKASSECT",
  "symbol": "AKC",
  "standard": "BEP-20",
  "network": "Binance Smart Chain (BSC)",
  "chainId": 56,
  "decimals": 18,
  "totalSupply": "300000000000000000000000000",
  "totalSupplyFormatted": "300,000,000 AKC",
  "contractAddress": "0x...",
  "verified": true
}
```

### Token Standard: BEP-20

**What is BEP-20?**
- BEP-20 is a token standard on Binance Smart Chain
- Compatible with ERC-20 (Ethereum standard)
- Designed for fast and low-cost transactions
- Widely supported by wallets and exchanges

**BEP-20 vs ERC-20**
| Feature | BEP-20 | ERC-20 |
|---------|--------|--------|
| Blockchain | BSC | Ethereum |
| Gas Fees | $0.10 - $0.50 | $5 - $50 |
| Block Time | ~3 seconds | ~15 seconds |
| Compatibility | ✅ ERC-20 compatible | ✅ ERC-20 |

---

## 🔧 Technical Specifications

### Contract Details

| Parameter | Value |
|-----------|-------|
| **Contract Type** | Standard BEP-20 Token |
| **Compiler Version** | Solidity 0.8.4 |
| **Optimization** | Enabled (200 runs) |
| **License** | MIT |
| **Proxy Contract** | No (Not upgradeable) |
| **Pausable** | Yes (Emergency use only) |
| **Mintable** | Yes (Owner only, post-launch locked) |
| **Burnable** | Yes (Public) |

### Smart Contract Address

```
Mainnet (BSC):
Contract Address: 0x... (Replace with actual address)
Chain ID: 56
Block Explorer: https://bscscan.com/token/0x...
```

```
Testnet (BSC):
Contract Address: 0x... (Replace with actual address)
Chain ID: 97
Block Explorer: https://testnet.bscscan.com/token/0x...
```

### Network Information

**Mainnet (Production)**
- Network Name: Binance Smart Chain
- RPC URL: https://bsc-dataseed1.binance.org
- Chain ID: 56
- Symbol: BNB
- Block Explorer: https://bscscan.com

**Testnet (Testing)**
- Network Name: BSC Testnet
- RPC URL: https://data-seed-prebsc-1-s1.binance.org:8545
- Chain ID: 97
- Symbol: BNB
- Block Explorer: https://testnet.bscscan.com

---

## 📊 Supply Information

### Total Supply

- **Maximum Supply**: 300,000,000 AKC (Fixed, cannot be increased)
- **Initial Supply**: 300,000,000 AKC (100% minted at launch)
- **Circulating Supply**: 300,000,000 AKC
- **Burned**: 0 AKC
- **Locked**: 60,000,000 AKC (Team vesting)

### Supply Breakdown

```
Total: 300,000,000 AKC (100%)

├─ Public Circulation: 90,000,000 AKC (30%)
│  └─ Available for trading
│
├─ Team & Advisors: 60,000,000 AKC (20%)
│  └─ 24-month linear vesting
│
├─ Ecosystem: 90,000,000 AKC (30%)
│  └─ Partnerships, development, grants
│
├─ Marketing: 30,000,000 AKC (10%)
│  └─ Community rewards, airdrops
│
└─ Reserve: 30,000,000 AKC (10%)
   └─ Future development, liquidity
```

---

## 💰 Token Economics

### Price Information (Example)

| Metric | Value |
|--------|-------|
| **Initial Price** | $0.005 USD |
| **Current Price** | $0.005 USD |
| **Market Cap** | $1,500,000 USD |
| **Fully Diluted Valuation** | $1,500,000 USD |
| **24h Volume** | $500,000 USD |
| **All-Time High** | $0.005 USD |
| **All-Time Low** | $0.005 USD |

*Note: Prices are examples and will be updated post-listing*

### Liquidity

**PancakeSwap Pool**
- AKC Amount: 1,000,000 AKC
- BNB Amount: 10 BNB
- Initial Liquidity: ~$5,000 USD
- LP Tokens: Locked for 12 months

---

## 🔐 Security Features

### Built-in Security

✅ **OpenZeppelin Libraries**
- Industry-standard implementation
- Audited and battle-tested
- Widely trusted in DeFi

✅ **Access Control**
- Owner-only functions clearly defined
- No hidden admin functions
- Ownership can be renounced or transferred to multisig

✅ **Pausable Mechanism**
- Emergency stop capability
- Owner-controlled
- Transparent implementation

✅ **No Backdoors**
- Source code fully verified
- No proxy or upgrade mechanism
- Immutable logic

### Security Audits

| Audit | Status | Severity | Report |
|-------|--------|----------|--------|
| **Slither** | ✅ Pass | 0 High, 0 Medium | [View](#) |
| **Internal Review** | ✅ Pass | 0 Critical | [View](#) |
| **External Audit** | ⏳ Pending | - | CertiK/PeckShield |

---

## 🔗 Integration Guide

### Adding AKC to MetaMask

```javascript
// Automatically add token to MetaMask
const tokenAddress = "0x..."; // AKC contract address
const tokenSymbol = "AKC";
const tokenDecimals = 18;
const tokenImage = "https://ainova.io/logo.png";

await ethereum.request({
  method: 'wallet_watchAsset',
  params: {
    type: 'ERC20',
    options: {
      address: tokenAddress,
      symbol: tokenSymbol,
      decimals: tokenDecimals,
      image: tokenImage,
    },
  },
});
```

### Web3 Integration

```javascript
// Using ethers.js
const { ethers } = require("ethers");

// Connect to BSC
const provider = new ethers.providers.JsonRpcProvider(
  "https://bsc-dataseed1.binance.org"
);

// AKC Contract
const contractAddress = "0x...";
const abi = [...]; // AKC ABI

const contract = new ethers.Contract(contractAddress, abi, provider);

// Check balance
const balance = await contract.balanceOf("0x...");
console.log(ethers.utils.formatEther(balance));

// Transfer tokens
const tx = await contract.transfer("0x...", ethers.utils.parseEther("100"));
await tx.wait();
```

### API Integration

```bash
# Get token information
curl https://api.bscscan.com/api \
  ?module=token \
  &action=tokeninfo \
  &contractaddress=0x... \
  &apikey=YOUR_API_KEY

# Get token balance
curl https://api.bscscan.com/api \
  ?module=account \
  &action=tokenbalance \
  &contractaddress=0x... \
  &address=0x... \
  &tag=latest \
  &apikey=YOUR_API_KEY
```

---

## 📈 Trading Information

### Supported Wallets

✅ **Hardware Wallets**
- Ledger
- Trezor

✅ **Software Wallets**
- MetaMask
- Trust Wallet
- Binance Chain Wallet
- TokenPocket
- SafePal

✅ **Exchange Wallets**
- Binance
- Gate.io
- MEXC
- Others (post-listing)

### Current Listings

| Platform | Type | Trading Pair | Link |
|----------|------|--------------|------|
| **PancakeSwap** | DEX | AKC/BNB | [Trade](#) |
| **CoinGecko** | Info | - | [View](#) |
| **CoinMarketCap** | Info | - | [View](#) |

### Upcoming Listings

- MEXC (Tier 3 CEX) - Q1 2026
- Gate.io (Tier 2 CEX) - Q2 2026
- Binance (Tier 1 CEX) - Q3 2026 (Target)

---

## 📞 Technical Support

### For Exchange Integration

- **Email**: akassectakc@gmail.com
- **Telegram**: @ainova_tech
- **Discord**: https://discord.gg/ainova
- **Response Time**: Within 24 hours

### Integration Support Includes

✅ API Documentation
✅ Test Environment Access
✅ Integration Testing
✅ Technical Consultation
✅ Post-Integration Support

---

## 📎 Additional Resources

### Official Links

- **Website**: https://ainova.io
- **Documentation**: https://docs.ainova.io
- **GitHub**: https://github.com/akassectakc-a11y/AKC-COIN
- **Medium**: https://medium.com/@ainova

### Technical Resources

- **Contract Source Code**: [BscScan](#)
- **Whitepaper**: https://ainova.io/whitepaper.pdf
- **Audit Reports**: https://ainova.io/audits
- **API Documentation**: https://docs.ainova.io/api

---

## ⚠️ Important Notes

### For Exchanges

1. **Deposit/Withdrawal Settings**
   - Minimum Deposit: 10 AKC
   - Minimum Withdrawal: 10 AKC
   - Withdrawal Fee: 0.5-1 AKC (Recommended)

2. **Confirmations**
   - Deposit Confirmations: 15 blocks (~45 seconds)
   - Withdrawal Confirmations: 30 blocks (~90 seconds)

3. **Contract Interaction**
   - Use standard BEP-20 transfer methods
   - No special fees or mechanics
   - Fully compatible with standard exchange infrastructure

### Risk Warnings

- Cryptocurrency investments carry risk
- Do your own research (DYOR)
- AKC is a utility token, not a security
- No guarantee of returns

---

**Document Version**: 1.0  
**Last Updated**: 2025-10-31  
**Next Review**: 2026-01-31

**Contact**: akassectakc@gmail.com
