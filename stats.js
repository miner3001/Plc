document.addEventListener('DOMContentLoaded', () => {
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const statsTitle = document.getElementById('stats-title');
    const statsPages = document.querySelectorAll('.stats-page');

    let currentIndex = 0;
    const totalPages = statsPages.length;    const titles = [
        'Produzione Giornaliera',
        'OEE e Prestazioni', 
        'Consumi e Energia',
        'Manutenzione e Allarmi'
    ];

    function showPage(index) {
        if (index >= totalPages) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = totalPages - 1;
        } else {
            currentIndex = index;
        }

        // Hide all pages
        statsPages.forEach(page => {
            page.classList.remove('active');
        });

        // Show current page
        statsPages[currentIndex].classList.add('active');
        
        // Update title
        statsTitle.textContent = titles[currentIndex];

        // Add animation effect to panels
        const activePanels = statsPages[currentIndex].querySelectorAll('.data-panel');
        activePanels.forEach((panel, index) => {
            panel.style.animationDelay = `${index * 0.1}s`;
            panel.classList.remove('fade-in');
            setTimeout(() => {
                panel.classList.add('fade-in');
            }, 10);
        });
    }

    prevBtn.addEventListener('click', () => {
        showPage(currentIndex - 1);
    });

    nextBtn.addEventListener('click', () => {
        showPage(currentIndex + 1);
    });

    // Initialize first page
    showPage(0);

    // Auto-update time and date
    function updateTime() {
        const timeElement = document.getElementById('time');
        const dateElement = document.getElementById('date');
        if (timeElement && dateElement) {
            const now = new Date();
            timeElement.textContent = now.toLocaleTimeString('it-IT');
            dateElement.textContent = now.toLocaleDateString('it-IT');
        }
    }

    setInterval(updateTime, 1000);
    updateTime();
});
