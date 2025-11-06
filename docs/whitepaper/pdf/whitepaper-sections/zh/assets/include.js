/**
 * AKASSECT 백서 섹션 동적 로딩 시스템
 * 각 섹션을 개별 HTML 파일에서 로드하여 메인 페이지에 삽입
 */

document.addEventListener('DOMContentLoaded', function() {
    const includeElements = document.querySelectorAll('[data-include]');
    let loadedCount = 0;
    const totalCount = includeElements.length;

    console.log(`총 ${totalCount}개 섹션 로딩 시작...`);

    includeElements.forEach((element, index) => {
        const file = element.getAttribute('data-include');
        
        console.log(`섹션 로딩 시도: ${file}`);
        
        fetch(file)
            .then(response => {
                console.log(`응답 상태: ${file} - ${response.status}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status} for file: ${file}`);
                }
                return response.text();
            })
            .then(data => {
                element.innerHTML = data;
                loadedCount++;
                console.log(`섹션 로드 완료: ${file} (${loadedCount}/${totalCount})`);
                
                if (loadedCount === totalCount) {
                    console.log('모든 섹션 로드 완료');
                    // 모든 섹션 로드 후 추가 초기화 작업
                    initializeLoadedContent();
                }
            })
            .catch(error => {
                console.error(`섹션 로드 실패: ${file}`, error);
                element.innerHTML = `
                    <div class="error-message">
                        <h3>섹션 로드 오류</h3>
                        <p>파일을 찾을 수 없습니다: ${file}</p>
                        <p>잠시 후 다시 시도해주세요.</p>
                    </div>
                `;
                loadedCount++;
                
                if (loadedCount === totalCount) {
                    console.log('모든 섹션 로드 완료 (일부 오류 포함)');
                    initializeLoadedContent();
                }
            });
    });
});

/**
 * 모든 섹션 로드 후 초기화 작업
 */
function initializeLoadedContent() {
    // 이미지 지연 로딩
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
        img.src = img.getAttribute('data-src');
        img.removeAttribute('data-src');
    });
    
    // 애니메이션 효과 초기화
    const animatedElements = document.querySelectorAll('.animate-on-load');
    animatedElements.forEach(element => {
        element.classList.add('loaded');
    });
    
    // 차트 초기화 (필요한 경우)
    initializeCharts();
}

/**
 * 차트 초기화 함수
 */
function initializeCharts() {
    // 성장 바 차트 애니메이션
    const growthBars = document.querySelectorAll('.growth-bar');
    growthBars.forEach((bar, index) => {
        setTimeout(() => {
            bar.style.opacity = '1';
            bar.style.transform = 'translateY(0)';
        }, index * 200);
    });
    
    // 타임라인 애니메이션
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 300);
    });
}

/**
 * PDF 다운로드 함수
 */
function downloadPDF() {
    // 웹 배너 숨기기
    const banner = document.querySelector('.web-banner');
    if (banner) {
        banner.style.display = 'none';
    }
    
    // 인쇄 스타일 적용
    document.body.classList.add('pdf-mode');
    
    // 브라우저 인쇄 다이얼로그 열기
    window.print();
    
    // 인쇄 후 원래 상태로 복원
    setTimeout(() => {
        if (banner) {
            banner.style.display = 'flex';
        }
        document.body.classList.remove('pdf-mode');
    }, 1000);
}

/**
 * 섹션 네비게이션 함수
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * 다크 모드 토글 (향후 확장용)
 */
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
}

// 페이지 로드 시 다크 모드 설정 복원
document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
    }
});

// 전역 함수로 내보내기
window.downloadPDF = downloadPDF;
window.scrollToSection = scrollToSection;
window.toggleDarkMode = toggleDarkMode;
