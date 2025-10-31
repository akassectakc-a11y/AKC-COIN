# 🤝 Contributing to AKC Token

> **Thank you for your interest in contributing to AKASSECT!**

---

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Process](#development-process)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)

---

## 📜 Code of Conduct

This project adheres to a Code of Conduct. By participating, you are expected to uphold this code.

### Our Standards

✅ **DO**:
- Be respectful and inclusive
- Welcome newcomers
- Accept constructive criticism
- Focus on what is best for the community

❌ **DON'T**:
- Use sexualized language or imagery
- Make personal attacks
- Harass others
- Publish private information

---

## 🚀 Getting Started

### Prerequisites

```bash
# Required
- Node.js >= 18.20.4
- pnpm >= 9.0.0
- Git

# Recommended
- VS Code with Solidity extension
- MetaMask wallet
```

### Setup Development Environment

```bash
# 1. Fork the repository
# Click "Fork" on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/AKC-COIN.git
cd AKC-COIN

# 3. Add upstream remote
git remote add upstream https://github.com/akassectakc-a11y/AKC-COIN.git

# 4. Install dependencies
pnpm install

# 5. Create a feature branch
git checkout -b feature/your-feature-name
```

---

## 💻 Development Process

### 1. Sync with Upstream

```bash
# Fetch upstream changes
git fetch upstream

# Merge upstream main into your main
git checkout main
git merge upstream/main

# Push to your fork
git push origin main
```

### 2. Create Feature Branch

```bash
# Create and switch to new branch
git checkout -b feature/amazing-feature

# Or for bug fixes
git checkout -b bugfix/fix-issue-123
```

### Branch Naming Convention

```
feature/    - New features
bugfix/     - Bug fixes
hotfix/     - Emergency fixes
docs/       - Documentation updates
refactor/   - Code refactoring
test/       - Test improvements
```

### 3. Make Changes

```bash
# Edit files
# Follow coding standards (see below)

# Test your changes
pnpm hardhat test

# Compile contracts
pnpm hardhat compile
```

### 4. Commit Changes

```bash
# Stage changes
git add .

# Commit with meaningful message
git commit -m "feat: add awesome feature"
```

#### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Maintenance

**Examples**:
```bash
git commit -m "feat(contract): add burn function"
git commit -m "fix(deploy): resolve gas estimation issue"
git commit -m "docs(readme): update installation guide"
```

### 5. Push Changes

```bash
# Push to your fork
git push origin feature/your-feature-name
```

---

## 🔄 Pull Request Process

### 1. Create Pull Request

1. Go to your fork on GitHub
2. Click "Pull Request"
3. Select base: `main` ← compare: `feature/your-feature-name`
4. Fill out the PR template

### 2. PR Template

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix (non-breaking change)
- [ ] New feature (non-breaking change)
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots (if applicable)
[Add screenshots]

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have performed a self-review
- [ ] I have commented my code
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix/feature works
- [ ] New and existing tests pass locally
```

### 3. Code Review Process

**Requirements**:
- ✅ 2+ approvals from maintainers
- ✅ All CI checks pass
- ✅ No merge conflicts
- ✅ Code coverage maintained (>95%)

**Timeline**:
- Initial review: Within 48 hours
- Follow-up reviews: Within 24 hours
- Merge: After all approvals

### 4. Addressing Feedback

```bash
# Make changes based on review
# Edit files...

# Commit changes
git add .
git commit -m "fix: address review comments"

# Push to update PR
git push origin feature/your-feature-name
```

---

## 📐 Coding Standards

### Solidity Style Guide

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

/**
 * @title AKC Token Contract
 * @dev BEP-20 token implementation
 */
contract AKC {
    // Constants in UPPER_CASE
    uint256 public constant TOTAL_SUPPLY = 300_000_000 * 10**18;
    
    // Private variables with underscore prefix
    uint256 private _totalSupply;
    
    // Events with past tense
    event TokensMinted(address indexed to, uint256 amount);
    
    /**
     * @dev Constructor initializes the contract
     * @param treasury Address to receive initial supply
     */
    constructor(address treasury) {
        require(treasury != address(0), "Invalid treasury address");
        _mint(treasury, TOTAL_SUPPLY);
    }
}
```

### JavaScript/TypeScript Style

```javascript
// Use const/let, not var
const contractAddress = "0x...";

// Arrow functions
const deploy = async () => {
  const AKC = await ethers.getContractFactory("AKC");
  return await AKC.deploy(treasuryAddress);
};

// Descriptive variable names
const averageGasUsed = calculateAverageGas(results);

// Comments for complex logic
// Calculate success rate as percentage
const successRate = (successCount / totalCount) * 100;
```

### Documentation

```javascript
/**
 * Deploy AKC token to specified network
 * @param {string} network - Network name (localhost, bscTestnet, bscMainnet)
 * @param {string} treasuryAddress - Treasury wallet address
 * @returns {Promise<Contract>} Deployed contract instance
 */
async function deployAKC(network, treasuryAddress) {
  // Implementation
}
```

---

## 🧪 Testing Guidelines

### Unit Tests

```javascript
describe("AKC Token", function () {
  it("should have correct name and symbol", async function () {
    expect(await akc.name()).to.equal("AKASSECT");
    expect(await akc.symbol()).to.equal("AKC");
  });
  
  it("should mint total supply to treasury", async function () {
    const balance = await akc.balanceOf(treasury.address);
    expect(balance).to.equal(TOTAL_SUPPLY);
  });
});
```

### Running Tests

```bash
# Run all tests
pnpm hardhat test

# Run specific test file
pnpm hardhat test test/AKC.test.js

# Run with gas reporting
REPORT_GAS=true pnpm hardhat test

# Run with coverage
pnpm hardhat coverage
```

### Test Coverage Requirements

- **Minimum**: 95% coverage
- **Statements**: 95%
- **Branches**: 90%
- **Functions**: 95%
- **Lines**: 95%

---

## 🔒 Security Guidelines

### Before Submitting

- [ ] No private keys in code
- [ ] No API keys in code
- [ ] No sensitive data exposed
- [ ] Security audit completed
- [ ] Slither analysis passed

### Security Checklist

```bash
# Run Slither
slither contracts/AKC.sol

# Check for common vulnerabilities
# - Reentrancy
# - Integer overflow/underflow
# - Unprotected functions
# - Delegatecall issues
```

---

## 📝 Documentation

### Required Documentation

When adding new features, update:
- [ ] README.md
- [ ] Inline code comments
- [ ] Function documentation
- [ ] User guides
- [ ] API documentation

### Documentation Style

```markdown
# Feature Name

## Overview
Brief description of what it does

## Usage
```bash
# Example command
pnpm hardhat deploy
```

## Parameters
- `param1`: Description
- `param2`: Description

## Returns
Description of return value

## Examples
Practical usage examples
```

---

## 🏆 Recognition

### Contributors Wall

All contributors are recognized in:
- README.md Contributors section
- CONTRIBUTORS.md file
- Release notes

### Contribution Levels

🥉 **Bronze**: 1-5 PRs merged  
🥈 **Silver**: 6-20 PRs merged  
🥇 **Gold**: 21+ PRs merged  
💎 **Diamond**: Core maintainer

---

## ❓ Questions?

### Get Help

- 💬 GitHub Discussions: [Ask a question](https://github.com/akassectakc-a11y/AKC-COIN/discussions)
- 📧 Email: akassectakc@gmail.com
- 💬 Telegram: https://t.me/ainova_dev
- 📖 Documentation: https://docs.ainova.io

### Common Issues

**Q: My PR was rejected, why?**
A: Check the review comments. Common reasons:
- Tests not passing
- Code coverage below 95%
- Style guide violations
- Missing documentation

**Q: How long until my PR is reviewed?**
A: Initial review within 48 hours. Please be patient!

**Q: Can I work on multiple features at once?**
A: Yes, but create separate branches for each feature.

---

## 📜 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to AKC Token!** 🎉

Every contribution, no matter how small, makes a difference.
