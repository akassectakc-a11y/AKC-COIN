require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const path = require("path");

async function verifyContractDirect() {
  console.log("🔍 BscScan API를 사용한 직접 컨트랙트 검증 시작...\n");

  const contractAddress = "0x02D8b729885290a3CA724F3Df5793b74Ff226A17";
  const treasuryAddress = "0xb6fbdb9af4c956ca953c4536fec5b28361cadac1";
  const apiKey = process.env.BSCSCAN_API_KEY;

  if (!apiKey) {
    console.error("❌ BSCSCAN_API_KEY가 .env 파일에 설정되지 않았습니다.");
    return;
  }

  console.log(`📍 컨트랙트 주소: ${contractAddress}`);
  console.log(`🏦 Treasury 주소: ${treasuryAddress}`);
  console.log(`🔑 API 키: ${apiKey.substring(0, 8)}...`);
  console.log(`🌐 네트워크: BSC 메인넷\n`);

  // 컨트랙트 소스코드 읽기
  const contractPath = path.join(__dirname, "../contracts/AKC.sol");
  const sourceCode = fs.readFileSync(contractPath, "utf8");

  // V1 API로 다시 시도 (form-data 형식)
  const verificationData = {
    apikey: apiKey,
    module: "contract",
    action: "verifysourcecode",
    contractaddress: contractAddress,
    sourceCode: sourceCode,
    codeformat: "solidity-single-file",
    contractname: "AKC",
    compilerversion: "v0.8.19+commit.7dd6d404",
    optimizationUsed: "1",
    runs: "200",
    constructorArguements: treasuryAddress.replace("0x", "").padStart(64, "0"),
    evmversion: "default",
    licenseType: "3"
  };

  try {
    console.log("📤 BscScan API에 검증 요청 전송 중...");
    console.log("📋 검증 데이터:", {
      contractaddress: contractAddress,
      contractname: "AKC",
      compilerversion: "v0.8.19+commit.7dd6d404",
      constructorArguements: verificationData.constructorArguements
    });
    
    const response = await axios.post(
      "https://api.bscscan.com/api",
      new URLSearchParams(verificationData),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );

    console.log("📥 응답 받음:", response.data);

    if (response.data.status === "1") {
      const guid = response.data.result;
      console.log(`✅ 검증 요청 성공! GUID: ${guid}`);
      console.log("⏳ 검증 처리 중... (1-2분 소요)");
      
      // 검증 상태 확인
      await checkVerificationStatus(apiKey, guid);
    } else {
      console.error("❌ 검증 요청 실패:", response.data.result);
    }

  } catch (error) {
    console.error("❌ 검증 요청 중 오류 발생:", error.message);
    if (error.response) {
      console.error("응답 데이터:", error.response.data);
    }
  }
}

async function checkVerificationStatus(apiKey, guid) {
  const maxAttempts = 10;
  let attempts = 0;

  while (attempts < maxAttempts) {
    try {
      await new Promise(resolve => setTimeout(resolve, 15000)); // 15초 대기
      
      const statusResponse = await axios.get(
        `https://api.bscscan.com/api?module=contract&action=checkverifystatus&guid=${guid}&apikey=${apiKey}`
      );

      console.log(`🔄 검증 상태 확인 (${attempts + 1}/${maxAttempts}):`, statusResponse.data);

      if (statusResponse.data.status === "1") {
        console.log("🎉 컨트랙트 검증 완료!");
        console.log("✅ 결과:", statusResponse.data.result);
        console.log("\n🔗 검증된 컨트랙트 확인:");
        console.log(`https://bscscan.com/address/0x02D8b729885290a3CA724F3Df5793b74Ff226A17#code`);
        return;
      } else if (statusResponse.data.result === "Pending in queue") {
        console.log("⏳ 검증 대기 중...");
      } else {
        console.error("❌ 검증 실패:", statusResponse.data.result);
        return;
      }

      attempts++;
    } catch (error) {
      console.error("상태 확인 중 오류:", error.message);
      attempts++;
    }
  }

  console.log("⚠️ 최대 시도 횟수 초과. 수동으로 확인해주세요:");
  console.log(`https://bscscan.com/address/0x02D8b729885290a3CA724F3Df5793b74Ff226A17#code`);
}

verifyContractDirect();
