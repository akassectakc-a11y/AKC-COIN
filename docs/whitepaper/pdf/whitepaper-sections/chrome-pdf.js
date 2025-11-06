#!/usr/bin/env node

/**
 * AKASSECT 백서 Chrome 헤드리스 PDF 생성기
 * 사용자 제안 방식: Chrome 직접 실행으로 PDF 생성
 */

import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import os from 'os';

const execAsync = promisify(exec);

// 한글 날짜 생성 함수
function getKoreanDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hour = now.getHours().toString().padStart(2, '0');
    const minute = now.getMinutes().toString().padStart(2, '0');
    
    return `${year}년${month}월${day}일_${hour}시${minute}분`;
}

// Chrome 실행 파일 경로 찾기
function getChromePath() {
    const platform = os.platform();
    
    if (platform === 'win32') {
        // Windows
        const possiblePaths = [
            'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
            process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe'
        ];
        
        for (const chromePath of possiblePaths) {
            if (fs.existsSync(chromePath)) {
                return `"${chromePath}"`;
            }
        }
    } else if (platform === 'darwin') {
        // macOS
        const possiblePaths = [
            '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
            '/Applications/Chromium.app/Contents/MacOS/Chromium'
        ];
        
        for (const chromePath of possiblePaths) {
            if (fs.existsSync(chromePath)) {
                return `"${chromePath}"`;
            }
        }
    } else {
        // Linux
        const possiblePaths = [
            '/usr/bin/google-chrome',
            '/usr/bin/chromium-browser',
            '/usr/bin/google-chrome-stable'
        ];
        
        for (const chromePath of possiblePaths) {
            if (fs.existsSync(chromePath)) {
                return chromePath;
            }
        }
    }
    
    // 기본값으로 chrome 명령어 시도
    return 'chrome';
}

async function generateChromeHeadlessPDF() {
    console.log('🚀 AKASSECT Chrome 헤드리스 PDF 생성 시작...');
    
    try {
        // ko_pdf 폴더 기반 파일명 생성 (한글 날짜)
        const currentDir = process.cwd();
        const outputDir = path.join(currentDir, 'ko_pdf');
        
        // ko_pdf 폴더가 없으면 생성
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
            console.log('📁 ko_pdf 폴더 생성 완료');
        }
        
        const koreanDate = getKoreanDate();
        const filename = `AKASSECT_백서_${koreanDate}.pdf`;
        const outputPath = path.join(outputDir, filename);
        
        console.log('📁 현재 폴더:', currentDir);
        console.log('📅 한글 날짜:', koreanDate);
        console.log('📄 파일명:', filename);
        
        // Chrome 경로 찾기
        const chromePath = getChromePath();
        console.log('🌐 Chrome 경로:', chromePath);
        
        // 사용자 제안 URL
        const url = 'http://127.0.0.1:52306/ko/';
        console.log('🔗 URL:', url);
        
        // Chrome 헤드리스 명령어 구성 (사용자 제안 방식)
        let chromeCommand;
        
        if (os.platform() === 'win32') {
            // Windows 방식 (사용자 제안)
            chromeCommand = `${chromePath} ^
--headless ^
--print-to-pdf="${outputPath}" ^
--print-to-pdf-no-header ^
--no-margins ^
--disable-gpu ^
--no-sandbox ^
--disable-setuid-sandbox ^
--virtual-time-budget=10000 ^
--run-all-compositor-stages-before-draw ^
--disable-background-timer-throttling ^
--disable-renderer-backgrounding ^
--disable-backgrounding-occluded-windows ^
"${url}"`.replace(/\^/g, '').replace(/\n/g, ' ');
        } else {
            // macOS/Linux 방식
            chromeCommand = `${chromePath} \
--headless \
--print-to-pdf="${outputPath}" \
--print-to-pdf-no-header \
--no-margins \
--disable-gpu \
--no-sandbox \
--disable-setuid-sandbox \
--virtual-time-budget=10000 \
--run-all-compositor-stages-before-draw \
--disable-background-timer-throttling \
--disable-renderer-backgrounding \
--disable-backgrounding-occluded-windows \
"${url}"`.replace(/\\\n/g, ' ');
        }
        
        console.log('⚡ Chrome 헤드리스 실행 중...');
        console.log('🎯 옵션:');
        console.log('   - 헤더 제거: --print-to-pdf-no-header');
        console.log('   - 여백 제거: --no-margins');
        console.log('   - 렌더링 대기: --virtual-time-budget=10000');
        console.log('   - GPU 비활성화: --disable-gpu');
        
        // Chrome 명령어 실행
        const { stdout, stderr } = await execAsync(chromeCommand, {
            timeout: 30000  // 30초 타임아웃
        });
        
        if (stderr && !stderr.includes('DevTools')) {
            console.warn('⚠️  경고:', stderr);
        }
        
        // 파일 생성 확인
        if (fs.existsSync(outputPath)) {
            const stats = fs.statSync(outputPath);
            const fileSizeMB = (stats.size / 1024 / 1024).toFixed(2);
            
            console.log('✅ Chrome 헤드리스 PDF 생성 완료!');
            console.log(`📁 파일명: ${filename}`);
            console.log(`📍 경로: ${outputPath}`);
            console.log(`📏 파일 크기: ${fileSizeMB} MB`);
            console.log('🎯 방식: Chrome 헤드리스 직접 실행');
            console.log('🌈 품질: 브라우저 네이티브 품질');
            
            // Chrome flags 정보 출력
            console.log('\n💡 Chrome 플래그 정보:');
            console.log('   chrome://flags/#headless');
            console.log('   - 헤드리스 모드에서 더 많은 옵션 사용 가능');
            
        } else {
            throw new Error('PDF 파일이 생성되지 않았습니다.');
        }
        
    } catch (error) {
        console.error('❌ Chrome 헤드리스 PDF 생성 실패:', error.message);
        console.log('\n💡 해결 방법:');
        console.log('1. Chrome이 설치되어 있는지 확인');
        console.log('2. 서버가 http://127.0.0.1:52306/ko/ 에서 실행 중인지 확인');
        console.log('3. Chrome 경로가 올바른지 확인');
        console.log('4. chrome://flags/#headless 에서 헤드리스 설정 확인');
        console.log('5. 관리자 권한으로 실행 시도');
    }
}

// 스크립트 실행
if (import.meta.url === `file://${process.argv[1]}`) {
    generateChromeHeadlessPDF().catch(console.error);
}

export { generateChromeHeadlessPDF };
