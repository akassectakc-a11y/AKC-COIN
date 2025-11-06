@echo off
REM AKASSECT 백서 Chrome 헤드리스 PDF 생성기 (Windows 배치 파일)
REM 사용자 제안 방식: Chrome 직접 실행

echo 🚀 AKASSECT Chrome 헤드리스 PDF 생성 시작...

REM 한글 날짜 생성
for /f "tokens=1-4 delims=/ " %%a in ('date /t') do (
    set YEAR=%%d
    set MONTH=%%b
    set DAY=%%c
)

for /f "tokens=1-2 delims=: " %%a in ('time /t') do (
    set HOUR=%%a
    set MINUTE=%%b
)

REM 한글 날짜 형식으로 파일명 생성
set KOREAN_DATE=%YEAR%년%MONTH%월%DAY%일_%HOUR%시%MINUTE%분
set FILENAME=AKASSECT_백서_%KOREAN_DATE%.pdf
set OUTPUT_PATH=%CD%\%FILENAME%

echo 📁 현재 폴더: %CD%
echo 📅 한글 날짜: %KOREAN_DATE%
echo 📄 파일명: %FILENAME%

REM Chrome 경로 찾기
set CHROME_PATH=""
if exist "C:\Program Files\Google\Chrome\Application\chrome.exe" (
    set CHROME_PATH="C:\Program Files\Google\Chrome\Application\chrome.exe"
) else if exist "C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" (
    set CHROME_PATH="C:\Program Files (x86)\Google\Chrome\Application\chrome.exe"
) else if exist "%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe" (
    set CHROME_PATH="%LOCALAPPDATA%\Google\Chrome\Application\chrome.exe"
) else (
    echo ❌ Chrome을 찾을 수 없습니다.
    echo 💡 Chrome을 설치하거나 경로를 확인해주세요.
    pause
    exit /b 1
)

echo 🌐 Chrome 경로: %CHROME_PATH%

REM 사용자 제안 URL
set URL=http://127.0.0.1:52306/ko/
echo 🔗 URL: %URL%

echo ⚡ Chrome 헤드리스 실행 중...
echo 🎯 옵션:
echo    - 헤더 제거: --print-to-pdf-no-header
echo    - 여백 제거: --no-margins  
echo    - 렌더링 대기: --virtual-time-budget=10000
echo    - GPU 비활성화: --disable-gpu

REM Chrome 헤드리스 명령어 실행 (사용자 제안 방식)
%CHROME_PATH% ^
--headless ^
--print-to-pdf="%OUTPUT_PATH%" ^
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
"%URL%"

REM 파일 생성 확인
if exist "%OUTPUT_PATH%" (
    echo ✅ Chrome 헤드리스 PDF 생성 완료!
    echo 📁 파일명: %FILENAME%
    echo 📍 경로: %OUTPUT_PATH%
    
    REM 파일 크기 확인
    for %%F in ("%OUTPUT_PATH%") do (
        set /a FILE_SIZE_MB=%%~zF/1024/1024
        echo 📏 파일 크기: !FILE_SIZE_MB! MB
    )
    
    echo 🎯 방식: Chrome 헤드리스 직접 실행
    echo 🌈 품질: 브라우저 네이티브 품질
    echo.
    echo 💡 Chrome 플래그 정보:
    echo    chrome://flags/#headless
    echo    - 헤드리스 모드에서 더 많은 옵션 사용 가능
    echo.
    echo 🎉 PDF 생성이 완료되었습니다!
    
) else (
    echo ❌ PDF 파일이 생성되지 않았습니다.
    echo.
    echo 💡 해결 방법:
    echo 1. Chrome이 설치되어 있는지 확인
    echo 2. 서버가 http://127.0.0.1:52306/ko/ 에서 실행 중인지 확인
    echo 3. Chrome 경로가 올바른지 확인
    echo 4. chrome://flags/#headless 에서 헤드리스 설정 확인
    echo 5. 관리자 권한으로 실행 시도
)

echo.
echo 아무 키나 누르면 종료됩니다...
pause >nul
