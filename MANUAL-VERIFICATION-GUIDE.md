# 🔍 BscScan 수동 컨트랙트 검증 가이드

## 📋 **검증 정보**

### **컨트랙트 정보**
- **컨트랙트 주소**: `0x02D8b729885290a3CA724F3Df5793b74Ff226A17`
- **컨트랙트 이름**: `AKC`
- **네트워크**: BSC 메인넷 (Chain ID: 56)

### **컴파일러 설정**
- **Solidity 버전**: `0.8.19`
- **최적화**: 활성화 (200 runs)
- **EVM 버전**: default
- **라이센스**: MIT

### **생성자 인수**
- **Treasury 주소**: `0xb6fbdb9af4c956ca953c4536fec5b28361cadac1`
- **ABI 인코딩**: `000000000000000000000000b6fbdb9af4c956ca953c4536fec5b28361cadac1`

---

## 🚀 **수동 검증 단계**

### **1단계: BscScan 접속**
1. https://bscscan.com/address/0x02D8b729885290a3CA724F3Df5793b74Ff226A17 접속
2. **"Contract"** 탭 클릭
3. **"Verify and Publish"** 버튼 클릭

### **2단계: 검증 양식 작성**

#### **기본 정보**
- **Contract Address**: `0x02D8b729885290a3CA724F3Df5793b74Ff226A17` (자동 입력됨)
- **Compiler Type**: `Solidity (Single file)`
- **Compiler Version**: `v0.8.19+commit.7dd6d404`
- **Open Source License Type**: `MIT License (MIT)`

#### **소스코드**
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title AKC - AKASSECT Token
 * @dev BEP-20 Token on Binance Smart Chain
 * @notice AI-powered payment gateway token for AKASSECT ecosystem
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
```

#### **최적화 설정**
- **Optimization**: `Yes`
- **Runs**: `200`

#### **생성자 인수**
```
000000000000000000000000b6fbdb9af4c956ca953c4536fec5b28361cadac1
```

### **3단계: 검증 제출**
1. **"Verify and Publish"** 버튼 클릭
2. 처리 완료까지 1-2분 대기
3. 성공 시 초록색 체크마크 표시

---

## ✅ **검증 완료 확인사항**

### **성공 지표**
- [ ] 컨트랙트 주소 옆에 초록색 체크마크 ✅
- [ ] **Contract** 탭에서 소스코드 보기 가능
- [ ] **Read Contract** 기능 활성화
- [ ] **Write Contract** 기능 활성화 (지갑 연결 시)

### **확인 링크**
- **검증된 컨트랙트**: https://bscscan.com/address/0x02D8b729885290a3CA724F3Df5793b74Ff226A17#code
- **토큰 정보**: https://bscscan.com/token/0x02D8b729885290a3CA724F3Df5793b74Ff226A17

---

## 🔧 **문제 해결**

### **일반적인 오류**
1. **컴파일러 버전 불일치**: 정확히 `v0.8.19+commit.7dd6d404` 사용
2. **생성자 인수 오류**: ABI 인코딩된 값 사용 필수
3. **최적화 설정 불일치**: 200 runs로 설정
4. **라이센스 타입**: MIT 선택

### **도움말**
- BscScan 검증이 실패하면 위 정보를 다시 확인
- 모든 설정이 배포 시와 동일해야 함
- OpenZeppelin 라이브러리는 자동으로 처리됨

---

## 📞 **지원**

검증 과정에서 문제가 발생하면:
1. 위 설정을 다시 확인
2. BscScan 지원팀에 문의
3. 개발팀에 연락

**검증 완료 후 다음 단계로 진행 가능합니다!**
