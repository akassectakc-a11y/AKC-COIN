require('dotenv').config();
const { ethers } = require('ethers');

/**
 * 스왑 컨트랙트 정밀 테스트 스크립트
 * 1inch, Uniswap, PancakeSwap 등의 스왑 컨트랙트 여부를 확인합니다.
 */

// 테스트할 컨트랙트 주소
const CONTRACT_ADDRESS = '0x6CE8903FD7advddAde2ec919450544f305708BB8A19a1f';

// BSC 메인넷 RPC (공용)
const BSC_RPC = 'https://bsc-dataseed1.binance.org';

// 알려진 스왑 함수 시그니처들
const SWAP_FUNCTION_SIGNATURES = [
  // Uniswap V2 스타일
  'swapExactTokensForTokens(uint256,uint256,address[],address,uint256)',
  'swapTokensForExactTokens(uint256,uint256,address[],address,uint256)',
  'swapExactETHForTokens(uint256,address[],address,uint256)',
  'swapTokensForExactETH(uint256,uint256,address[],address,uint256)',
  'swapExactTokensForETH(uint256,uint256,address[],address,uint256)',
  'swapETHForExactTokens(uint256,address[],address,uint256)',
  
  // Uniswap V3 스타일
  'exactInputSingle((address,address,uint24,address,uint256,uint256,uint256,uint160))',
  'exactInput((bytes,address,uint256,uint256,uint256))',
  'exactOutputSingle((address,address,uint24,address,uint256,uint256,uint256,uint160))',
  'exactOutput((bytes,address,uint256,uint256,uint256))',
  
  // 1inch 스타일
  'swap(address,(address,address,address,address,uint256,uint256,uint256),bytes,bytes)',
  'unoswap(address,uint256,uint256,uint256[])',
  'uniswapV3Swap(uint256,uint256,uint256[])',
  
  // PancakeSwap 스타일
  'swapExactTokensForTokensSupportingFeeOnTransferTokens(uint256,uint256,address[],address,uint256)',
  'swapExactETHForTokensSupportingFeeOnTransferTokens(uint256,address[],address,uint256)',
  'swapExactTokensForETHSupportingFeeOnTransferTokens(uint256,uint256,address[],address,uint256)',
  
  // 일반 스왑 함수
  'swap(uint256,uint256,address,bytes)',
  'swap(address,address,uint256)',
];

// 알려진 스왑 이벤트 시그니처들
const SWAP_EVENT_SIGNATURES = [
  'Swap(address,uint256,uint256,uint256,uint256,address)', // Uniswap V2
  'Swap(address,address,int256,int256,uint160,uint128,int24)', // Uniswap V3
  'Swapped(address,address,address,uint256,uint256)', // 1inch
];

// 알려진 스왑 프로토콜 인터페이스
const KNOWN_INTERFACES = {
  'IUniswapV2Router': '0x7a250d56',
  'IUniswapV3Router': '0xc45a0155',
  'IAggregationRouterV4': '0x2e7ba6ef', // 1inch V4
  'IAggregationRouterV5': '0x12aa3caf', // 1inch V5
  'IPancakeRouter02': '0x7a250d56',
};

class SwapContractTester {
  constructor(contractAddress) {
    this.contractAddress = contractAddress;
    this.provider = new ethers.JsonRpcProvider(BSC_RPC);
    this.results = {
      contractAddress: contractAddress,
      isSwapContract: false,
      confidence: 0,
      findings: [],
      detectedProtocols: [],
      detectedFunctions: [],
      detectedEvents: [],
      bytecodeAnalysis: {},
      transactionAnalysis: {},
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * 1. 컨트랙트 존재 여부 확인
   */
  async checkContractExists() {
    try {
      const code = await this.provider.getCode(this.contractAddress);
      if (code === '0x' || code === '0x0') {
        this.results.findings.push({
          test: 'Contract Existence',
          status: 'FAIL',
          message: '컨트랙트가 존재하지 않습니다 (EOA이거나 배포되지 않음)',
        });
        return false;
      }
      this.results.findings.push({
        test: 'Contract Existence',
        status: 'PASS',
        message: '컨트랙트 코드 확인됨',
        details: { bytecodeLength: code.length },
      });
      this.results.bytecodeAnalysis.bytecode = code;
      this.results.bytecodeAnalysis.bytecodeLength = code.length;
      return true;
    } catch (error) {
      this.results.findings.push({
        test: 'Contract Existence',
        status: 'ERROR',
        message: error.message,
      });
      return false;
    }
  }

  /**
   * 2. 스왑 함수 시그니처 확인
   */
  async checkSwapFunctions() {
    const foundFunctions = [];
    
    for (const signature of SWAP_FUNCTION_SIGNATURES) {
      try {
        // 함수 selector 생성
        const functionHash = ethers.id(signature).substring(0, 10);
        
        // 바이트코드에서 함수 selector 검색
        if (this.results.bytecodeAnalysis.bytecode.includes(functionHash.substring(2))) {
          foundFunctions.push({
            signature,
            selector: functionHash,
            found: true,
          });
        }
      } catch (error) {
        // 무시
      }
    }

    if (foundFunctions.length > 0) {
      this.results.findings.push({
        test: 'Swap Function Detection',
        status: 'PASS',
        message: `${foundFunctions.length}개의 스왑 관련 함수 발견`,
        details: foundFunctions,
      });
      this.results.detectedFunctions = foundFunctions;
      this.results.confidence += 30;
      return true;
    } else {
      this.results.findings.push({
        test: 'Swap Function Detection',
        status: 'FAIL',
        message: '알려진 스왑 함수가 발견되지 않음',
      });
      return false;
    }
  }

  /**
   * 3. 이벤트 시그니처 확인
   */
  async checkSwapEvents() {
    const foundEvents = [];
    
    for (const signature of SWAP_EVENT_SIGNATURES) {
      try {
        const eventHash = ethers.id(signature);
        
        // 최근 트랜잭션에서 이벤트 검색
        const filter = {
          address: this.contractAddress,
          topics: [eventHash],
          fromBlock: 'latest',
          toBlock: 'latest',
        };
        
        // 바이트코드에서 이벤트 시그니처 검색
        if (this.results.bytecodeAnalysis.bytecode.includes(eventHash.substring(2, 10))) {
          foundEvents.push({
            signature,
            hash: eventHash,
            found: true,
          });
        }
      } catch (error) {
        // 무시
      }
    }

    if (foundEvents.length > 0) {
      this.results.findings.push({
        test: 'Swap Event Detection',
        status: 'PASS',
        message: `${foundEvents.length}개의 스왑 관련 이벤트 발견`,
        details: foundEvents,
      });
      this.results.detectedEvents = foundEvents;
      this.results.confidence += 20;
      return true;
    } else {
      this.results.findings.push({
        test: 'Swap Event Detection',
        status: 'FAIL',
        message: '알려진 스왑 이벤트가 발견되지 않음',
      });
      return false;
    }
  }

  /**
   * 4. ERC165 인터페이스 확인
   */
  async checkInterfaces() {
    const detectedInterfaces = [];
    
    for (const [name, interfaceId] of Object.entries(KNOWN_INTERFACES)) {
      try {
        const contract = new ethers.Contract(
          this.contractAddress,
          ['function supportsInterface(bytes4) view returns (bool)'],
          this.provider
        );
        
        const supported = await contract.supportsInterface(interfaceId);
        if (supported) {
          detectedInterfaces.push({ name, interfaceId, supported: true });
        }
      } catch (error) {
        // ERC165를 지원하지 않을 수 있음
      }
    }

    if (detectedInterfaces.length > 0) {
      this.results.findings.push({
        test: 'Interface Detection',
        status: 'PASS',
        message: `${detectedInterfaces.length}개의 알려진 인터페이스 감지`,
        details: detectedInterfaces,
      });
      this.results.detectedProtocols = detectedInterfaces.map(i => i.name);
      this.results.confidence += 40;
      return true;
    } else {
      this.results.findings.push({
        test: 'Interface Detection',
        status: 'INFO',
        message: 'ERC165 인터페이스 미지원 또는 알려진 인터페이스 없음',
      });
      return false;
    }
  }

  /**
   * 5. 최근 트랜잭션 분석
   */
  async analyzeRecentTransactions() {
    try {
      // 최근 블록 번호 가져오기
      const currentBlock = await this.provider.getBlockNumber();
      const fromBlock = currentBlock - 1000; // 최근 1000 블록

      // 컨트랙트로의 트랜잭션 검색
      const logs = await this.provider.getLogs({
        address: this.contractAddress,
        fromBlock: fromBlock,
        toBlock: 'latest',
      });

      if (logs.length > 0) {
        this.results.findings.push({
          test: 'Transaction Activity',
          status: 'PASS',
          message: `최근 ${logs.length}개의 이벤트/트랜잭션 발견`,
          details: {
            eventCount: logs.length,
            blockRange: `${fromBlock} - ${currentBlock}`,
          },
        });
        this.results.transactionAnalysis = {
          recentEventCount: logs.length,
          blockRange: { from: fromBlock, to: currentBlock },
        };
        this.results.confidence += 10;
        return true;
      } else {
        this.results.findings.push({
          test: 'Transaction Activity',
          status: 'INFO',
          message: '최근 활동 없음',
        });
        return false;
      }
    } catch (error) {
      this.results.findings.push({
        test: 'Transaction Activity',
        status: 'ERROR',
        message: error.message,
      });
      return false;
    }
  }

  /**
   * 6. 바이트코드 패턴 분석
   */
  analyzeBytecodePatterns() {
    const bytecode = this.results.bytecodeAnalysis.bytecode;
    const patterns = {
      hasSwapKeyword: bytecode.toLowerCase().includes('swap'),
      hasRouterKeyword: bytecode.toLowerCase().includes('router'),
      hasExchangeKeyword: bytecode.toLowerCase().includes('exchange'),
      hasPairKeyword: bytecode.toLowerCase().includes('pair'),
      hasFactoryKeyword: bytecode.toLowerCase().includes('factory'),
    };

    const foundPatterns = Object.entries(patterns)
      .filter(([, found]) => found)
      .map(([pattern]) => pattern);

    if (foundPatterns.length > 0) {
      this.results.findings.push({
        test: 'Bytecode Pattern Analysis',
        status: 'PASS',
        message: `${foundPatterns.length}개의 관련 패턴 발견`,
        details: patterns,
      });
      this.results.bytecodeAnalysis.patterns = patterns;
      this.results.confidence += foundPatterns.length * 5;
      return true;
    } else {
      this.results.findings.push({
        test: 'Bytecode Pattern Analysis',
        status: 'INFO',
        message: '관련 패턴 없음',
      });
      return false;
    }
  }

  /**
   * 모든 테스트 실행
   */
  async runAllTests() {
    console.log(`\n🔍 스왑 컨트랙트 테스트 시작: ${this.contractAddress}\n`);

    // 1. 컨트랙트 존재 확인
    const exists = await this.checkContractExists();
    if (!exists) {
      this.results.isSwapContract = false;
      return this.results;
    }

    // 2-6. 모든 테스트 실행
    await this.checkSwapFunctions();
    await this.checkSwapEvents();
    await this.checkInterfaces();
    await this.analyzeRecentTransactions();
    this.analyzeBytecodePatterns();

    // 최종 판정
    this.results.isSwapContract = this.results.confidence >= 50;
    
    if (this.results.isSwapContract) {
      console.log(`\n✅ 결론: 스왑 컨트랙트로 판정 (신뢰도: ${this.results.confidence}%)\n`);
    } else {
      console.log(`\n❌ 결론: 스왑 컨트랙트가 아님 (신뢰도: ${this.results.confidence}%)\n`);
    }

    return this.results;
  }
}

// 메인 실행 함수
async function main() {
  try {
    const tester = new SwapContractTester(CONTRACT_ADDRESS);
    const results = await tester.runAllTests();
    
    // 결과를 JSON 파일로 저장
    const fs = require('fs');
    const path = require('path');
    const outputPath = path.join(__dirname, 'test-results.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    
    console.log(`\n📄 상세 결과가 저장되었습니다: ${outputPath}\n`);
    
    return results;
  } catch (error) {
    console.error('❌ 테스트 실행 중 오류:', error);
    process.exit(1);
  }
}

// 스크립트 직접 실행 시
if (require.main === module) {
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

module.exports = { SwapContractTester };
