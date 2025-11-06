// 면책조항 처리
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('disclaimerModal');
    const acceptCheckbox = document.getElementById('acceptDisclaimer');
    const acceptBtn = document.getElementById('acceptBtn');
    const declineBtn = document.getElementById('declineBtn');
    const mainContent = document.getElementById('mainContent');

    // 체크박스 상태에 따라 버튼 활성화
    acceptCheckbox.addEventListener('change', function() {
        acceptBtn.disabled = !this.checked;
    });

    // 동의 버튼 클릭
    acceptBtn.addEventListener('click', function() {
        modal.classList.remove('active');
        mainContent.style.display = 'block';
        mainContent.innerHTML = whitepaperHTML;
        initScrollEffects();
    });

    // 거부 버튼 클릭
    declineBtn.addEventListener('click', function() {
        window.location.href = 'about:blank';
    });
});

// 스크롤 효과 초기화
function initScrollEffects() {
    // 스무스 스크롤
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // 스크롤 애니메이션
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });
}

function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}
