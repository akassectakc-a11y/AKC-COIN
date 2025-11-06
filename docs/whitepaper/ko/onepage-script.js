// 면책조항 처리
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('disclaimerModal');
    const checkbox = document.getElementById('acceptDisclaimer');
    const acceptBtn = document.getElementById('acceptBtn');
    const declineBtn = document.getElementById('declineBtn');
    const mainContent = document.getElementById('mainContent');

    // 체크박스 이벤트
    checkbox.addEventListener('change', function() {
        acceptBtn.disabled = !this.checked;
    });

    // 동의 버튼
    acceptBtn.addEventListener('click', function() {
        modal.classList.remove('active');
        mainContent.style.display = 'block';
        initScrollEffects();
    });

    // 거부 버튼
    declineBtn.addEventListener('click', function() {
        window.location.href = 'about:blank';
    });

    // 스무스 스크롤
    function initScrollEffects() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offset = 80; // 네비게이션 높이
                    const targetPosition = target.offsetTop - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });

        // 스크롤 애니메이션
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, {threshold: 0.1});

        document.querySelectorAll('.section').forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'all 0.8s ease';
            observer.observe(section);
        });
    }
});
