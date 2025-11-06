// full-bleed-pdf.js
// 여백 없는 풀 블리드 A4 PDF 생성기

import puppeteer from "puppeteer";
import fs from "fs";
import path from "path";

// 영문 날짜 생성 함수
function getEnglishDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;
    const day = now.getDate();
    const hour = now.getHours();
    const minute = now.getMinutes();
    
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}_${hour.toString().padStart(2, '0')}-${minute.toString().padStart(2, '0')}`;
}

(async () => {
    console.log("📄 AKASSECT 풀 블리드 PDF 생성 시작...");
    
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: true,
            args: [
                "--no-sandbox", 
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-extensions",
                "--disable-plugins",
                "--disable-infobars",
                "--no-first-run"
            ],
            devtools: false // 개발자 도구 완전 비활성화
        });

        const page = await browser.newPage();
        
        // A4 크기 정확히 맞추기 (여백 없음)
        await page.setViewport({
            width: 794,  // A4 너비 (픽셀)
            height: 1123, // A4 높이 (픽셀)
            deviceScaleFactor: 1
        });

        // 풀 블리드 HTML 생성
        const fullBleedHTML = `
        <!DOCTYPE html>
        <html lang="ko">
        <head>
            <meta charset="UTF-8">
            <style>
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                    font-size: 11px;
                    line-height: 1.3;
                    color: #1a1a1a;
                    background: white;
                    width: 100vw;
                    height: 100vh;
                    padding: 0;
                    margin: 0;
                    overflow: hidden;
                }
                
                .container {
                    width: 100%;
                    height: 100%;
                    padding: 10px;
                    display: flex;
                    flex-direction: column;
                }
                
                .header {
                    text-align: center;
                    margin-bottom: 8px;
                    padding-bottom: 6px;
                    border-bottom: 2px solid #667eea;
                }
                
                .title {
                    font-size: 18px;
                    font-weight: 800;
                    color: #667eea;
                    margin-bottom: 2px;
                }
                
                .subtitle {
                    font-size: 11px;
                    color: #666;
                    font-weight: 500;
                }
                
                .content {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 8px;
                    flex: 1;
                }
                
                .section {
                    background: #f8fafc;
                    border-radius: 3px;
                    padding: 6px;
                    border-left: 3px solid #667eea;
                    margin-bottom: 4px;
                }
                
                .section h3 {
                    font-size: 12px;
                    font-weight: 700;
                    color: #667eea;
                    margin-bottom: 4px;
                }
                
                .section p {
                    font-size: 9px;
                    line-height: 1.4;
                    margin-bottom: 3px;
                }
                
                .highlight {
                    background: linear-gradient(135deg, #667eea, #764ba2);
                    color: white;
                    padding: 4px;
                    border-radius: 3px;
                    text-align: center;
                    margin: 4px 0;
                    font-weight: 600;
                }
                
                .stats {
                    display: flex;
                    justify-content: space-between;
                    margin: 4px 0;
                }
                
                .stat {
                    text-align: center;
                    flex: 1;
                }
                
                .stat-number {
                    font-size: 14px;
                    font-weight: 700;
                    color: #667eea;
                }
                
                .stat-label {
                    font-size: 8px;
                    color: #666;
                }
                
                .footer {
                    text-align: center;
                    font-size: 8px;
                    color: #666;
                    border-top: 1px solid #eee;
                    padding-top: 4px;
                    margin-top: 4px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <!-- 헤더 -->
                <div class="header">
                    <div class="title">AKASSECT (AKC)</div>
                    <div class="subtitle">AI 기반 P2P 결제 및 안전거래 시스템 - 기술 백서</div>
                </div>
                
                <!-- 메인 콘텐츠 -->
                <div class="content">
                    <!-- 왼쪽 컬럼 -->
                    <div class="left-column">
                        <!-- 프로젝트 개요 -->
                        <div class="section">
                            <h3>🚀 프로젝트 개요</h3>
                            <p><strong>AKASSECT</strong>는 AI 기반 가상 P2P 결제 및 안전거래 시스템입니다.</p>
                            <p>• <strong>블록체인:</strong> BSC (BEP-20)</p>
                            <p>• <strong>총 발행량:</strong> 300,000,000 AKC</p>
                            <p>• <strong>컨트랙트:</strong> 0x02D8b729885290a3CA724F3Df5793b74Ff226A17</p>
                            <div class="highlight">
                                AI 위험분석으로 99.4% 정확도의 안전거래 실현
                            </div>
                        </div>
                        
                        <!-- 핵심 기술 -->
                        <div class="section">
                            <h3>⚡ 핵심 기술</h3>
                            <p><strong>1. AI 위험분석 시스템</strong></p>
                            <p>• 150개 이상 거래 파라미터 실시간 분석</p>
                            <p>• 머신러닝 기반 사기 탐지 (95% 사기 감소)</p>
                            
                            <p><strong>2. 자동 에스크로</strong></p>
                            <p>• 스마트 컨트랙트 기반 자동 거래 보호</p>
                            <p>• 3초 이내 거래 완료</p>
                            
                            <p><strong>3. 분산 네트워크</strong></p>
                            <p>• 24/7 무중단 서비스</p>
                            <p>• 글로벌 노드 네트워크</p>
                        </div>
                        
                        <!-- 토큰 분배 -->
                        <div class="section">
                            <h3>💰 토큰 분배</h3>
                            <div class="stats">
                                <div class="stat">
                                    <div class="stat-number">40%</div>
                                    <div class="stat-label">생태계</div>
                                </div>
                                <div class="stat">
                                    <div class="stat-number">25%</div>
                                    <div class="stat-label">개발팀</div>
                                </div>
                                <div class="stat">
                                    <div class="stat-number">20%</div>
                                    <div class="stat-label">마케팅</div>
                                </div>
                                <div class="stat">
                                    <div class="stat-number">15%</div>
                                    <div class="stat-label">예비금</div>
                                </div>
                            </div>
                            <p>• <strong>락업 기간:</strong> 팀 토큰 24개월</p>
                            <p>• <strong>베스팅:</strong> 선형 해제 방식</p>
                        </div>
                    </div>
                    
                    <!-- 오른쪽 컬럼 -->
                    <div class="right-column">
                        <!-- 시장 기회 -->
                        <div class="section">
                            <h3>📈 시장 기회</h3>
                            <div class="stats">
                                <div class="stat">
                                    <div class="stat-number">$2.8T</div>
                                    <div class="stat-label">글로벌 결제시장</div>
                                </div>
                                <div class="stat">
                                    <div class="stat-number">15%</div>
                                    <div class="stat-label">연평균 성장률</div>
                                </div>
                            </div>
                            <p><strong>문제점:</strong></p>
                            <p>• 높은 거래 수수료 (3-5%)</p>
                            <p>• 사기 거래 증가 (연간 $32B 손실)</p>
                            <p>• 느린 정산 시간 (2-7일)</p>
                            
                            <p><strong>AKASSECT 해결책:</strong></p>
                            <p>• 0.1% 저렴한 수수료</p>
                            <p>• AI 기반 사기 방지</p>
                            <p>• 즉시 정산 (3초 이내)</p>
                        </div>
                        
                        <!-- 로드맵 -->
                        <div class="section">
                            <h3>🗓️ 로드맵</h3>
                            <p><strong>2024 Q4:</strong> 메인넷 런칭</p>
                            <p><strong>2025 Q1:</strong> AI 엔진 v2.0</p>
                            <p><strong>2025 Q2:</strong> 글로벌 파트너십</p>
                            <p><strong>2025 Q3:</strong> 모바일 앱 출시</p>
                            <p><strong>2025 Q4:</strong> DeFi 통합</p>
                            
                            <div class="highlight">
                                목표: 2025년 말 100만 사용자 달성
                            </div>
                        </div>
                        
                        <!-- 팀 & 연락처 -->
                        <div class="section">
                            <h3>👥 팀 & 연락처</h3>
                            <p><strong>핵심 팀:</strong></p>
                            <p>• AI/ML 전문가 5명</p>
                            <p>• 블록체인 개발자 8명</p>
                            <p>• 금융 전문가 3명</p>
                            
                            <p><strong>연락처:</strong></p>
                            <p>• 웹사이트: akassect.com</p>
                            <p>• 이메일: info@akassect.com</p>
                            <p>• 텔레그램: @akassect</p>
                        </div>
                    </div>
                </div>
                
                <!-- 푸터 -->
                <div class="footer">
                    © 2024 AKASSECT Project Team | BSC: 0x02D8b729885290a3CA724F3Df5793b74Ff226A17
                </div>
            </div>
        </body>
        </html>
        `;

        await page.setContent(fullBleedHTML);
        await page.waitForTimeout(2000);

        // 파일 경로 설정
        const englishDateTime = getEnglishDateTime();
        const currentDir = process.cwd();
        const outputDir = path.join(currentDir, 'ko_pdf');
        
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
            console.log("📁 ko_pdf 폴더 생성 완료");
        }

        const pdfPath = path.join(outputDir, `AKASSECT_FullBleed_${englishDateTime}.pdf`);
        
        console.log("📄 풀 블리드 PDF 생성 중...");
        
        // 완전히 여백 없는 PDF 생성
        await page.pdf({
            path: pdfPath,
            width: '210mm',
            height: '297mm',
            printBackground: true,
            margin: { 
                top: 0, 
                right: 0, 
                bottom: 0, 
                left: 0 
            },
            scale: 1.0,
            preferCSSPageSize: false
        });

        console.log("\n📄 풀 블리드 PDF 생성 완료!");
        
        if (fs.existsSync(pdfPath)) {
            const stats = fs.statSync(pdfPath);
            const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);
            
            console.log(`📁 파일 위치: ${pdfPath}`);
            console.log(`📊 파일 크기: ${fileSizeMB} MB`);
            console.log(`🕐 생성 시간: ${englishDateTime}`);
            console.log("\n✨ 특징:");
            console.log("  • 완전히 여백 없는 풀 블리드 디자인");
            console.log("  • A4 전체 면적 활용");
            console.log("  • 이모지로 시각적 구분");
            console.log("  • 최대 콘텐츠 밀도");
            console.log("  • 시간 절약형 레이아웃");
            
        } else {
            console.error("❌ PDF 파일 생성 실패");
        }

    } catch (error) {
        console.error("💥 오류 발생:", error.message);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
})();
