const sideModalOverlay = document.getElementById('side-modal-overlay');
const sideModal = document.getElementById('side-modal');
let currentLanguage = 'vi';

function applyLanguage(lang) {
    const texts = {
        vi: {
            navHome: 'Trang chủ',
            navAbout: 'Giới thiệu',
            navServices: 'Dịch vụ',
            navContact: 'Liên hệ',
            getStarted: 'Bắt đầu',
            badge: 'Tính năng mới',
            heroSubtitle: 'Chúng tôi giúp bạn xây dựng thương hiệu và phát triển doanh nghiệp với quy trình sáng tạo đột phá.',
            contactBtn: 'Liên hệ',
            learnMoreBtn: 'Tìm hiểu thêm',
            modalTitle: 'Khám Phá',
            modalDescription: 'Khám phá các dự án và đánh giá nổi bật từ các đối tác trang web khác của chúng tôi dưới đây.',
            modalConnect: 'Kết Nối Ngay',
            langLabel: 'Tiếng Việt',
            langFlag: 'https://flagcdn.com/w20/vn.png',
            langAlt: 'Vietnam flag'
        },
        en: {
            navHome: 'Home',
            navAbout: 'About',
            navServices: 'Services',
            navContact: 'Contact',
            getStarted: 'Get Started!',
            badge: 'New Feature',
            heroSubtitle: 'We help you build your brand and grow your business with a breakthrough creative process.',
            contactBtn: 'Contact Us',
            learnMoreBtn: 'Learn more',
            modalTitle: 'Explore',
            modalDescription: 'Explore standout projects and reviews from our partner websites below.',
            modalConnect: 'Connect Now',
            langLabel: 'English',
            langFlag: 'https://flagcdn.com/w20/gb.png',
            langAlt: 'UK flag'
        }
    };

    const t = texts[lang];
    document.getElementById('nav-home').textContent = t.navHome;
    document.getElementById('nav-about').textContent = t.navAbout;
    document.getElementById('nav-services').textContent = t.navServices;
    document.getElementById('nav-contact').textContent = t.navContact;
    document.getElementById('get-started-btn').textContent = t.getStarted;
    document.getElementById('badge-text').textContent = t.badge;
    document.getElementById('hero-subtitle').textContent = t.heroSubtitle;
    document.getElementById('contact-btn').textContent = t.contactBtn;
    document.getElementById('learn-more-btn').textContent = t.learnMoreBtn;
    document.getElementById('modal-title-text').textContent = t.modalTitle;
    document.getElementById('modal-description').textContent = t.modalDescription;
    document.getElementById('modal-connect-btn').textContent = t.modalConnect;
    document.getElementById('lang-toggle').innerHTML = `<img src="${t.langFlag}" alt="${t.langAlt}" class="w-4 h-4 rounded-full object-cover"><span>${t.langLabel}</span>`;
}

function toggleLanguage() {
    currentLanguage = currentLanguage === 'vi' ? 'en' : 'vi';
    applyLanguage(currentLanguage);
}

function openSideModal() {
    sideModalOverlay.classList.remove('hidden');
    setTimeout(() => {
        sideModalOverlay.classList.remove('opacity-0');
        sideModal.classList.remove('translate-x-[150%]');
    }, 10);
}

function closeSideModal() {
    sideModalOverlay.classList.add('opacity-0');
    sideModal.classList.add('translate-x-[150%]');
    setTimeout(() => {
        sideModalOverlay.classList.add('hidden');
    }, 300);
}

let ytPlayer;
let isMusicPlaying = false;
let hasUserInteractedForAudio = false;
const MUSIC_VIDEO_ID = 'KOn_gNbzQ5Q';

function closeMusicPanel() {
    const panel = document.getElementById('music-panel');
    const openBtn = document.getElementById('music-open-btn');
    if (panel.classList.contains('hidden')) return;

    panel.classList.add('opacity-0', 'translate-y-2', 'scale-95', 'pointer-events-none');
    panel.classList.remove('opacity-100', 'translate-y-0', 'scale-100');
    setTimeout(() => {
        panel.classList.add('hidden');
        openBtn.classList.remove('hidden');
    }, 300);
}

function toggleMusicPanel() {
    const panel = document.getElementById('music-panel');
    const openBtn = document.getElementById('music-open-btn');
    const isOpening = panel.classList.contains('hidden');

    if (isOpening) {
        openBtn.classList.add('hidden');
        panel.classList.remove('hidden');
        requestAnimationFrame(() => {
            panel.classList.remove('opacity-0', 'translate-y-2', 'scale-95', 'pointer-events-none');
            panel.classList.add('opacity-100', 'translate-y-0', 'scale-100');
        });
        return;
    }

    closeMusicPanel();
}

document.addEventListener('click', (e) => {
    const widget = document.getElementById('music-widget');
    if (widget && !widget.contains(e.target)) {
        closeMusicPanel();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMusicPanel();
});

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function handleUserAudioInteraction() {
    hasUserInteractedForAudio = true;
    document.removeEventListener('pointerdown', handleUserAudioInteraction);
    document.removeEventListener('keydown', handleUserAudioInteraction);

    if (!ytPlayer) return;

    ytPlayer.unMute();
    ytPlayer.playVideo();
}

function unlockAudioPlayback() {
    if (!ytPlayer || !hasUserInteractedForAudio) return;
    ytPlayer.unMute();
    ytPlayer.playVideo();
}

document.addEventListener('pointerdown', handleUserAudioInteraction);
document.addEventListener('keydown', handleUserAudioInteraction);

function tryAutoplayMuted() {
    if (!ytPlayer) return;
    ytPlayer.mute();
    ytPlayer.playVideo();
}

function handleMusicStateChange(event) {
    const toggle = document.getElementById('music-toggle');
    if (!toggle || !window.YT || !YT.PlayerState) return;

    if (event.data === YT.PlayerState.PLAYING) {
        isMusicPlaying = true;
        toggle.textContent = '⏸';
    } else if (event.data === YT.PlayerState.PAUSED || event.data === YT.PlayerState.ENDED) {
        isMusicPlaying = false;
        toggle.textContent = '▶';
    }
}

function onYouTubeIframeAPIReady() {
    if (ytPlayer) return;

    ytPlayer = new YT.Player('yt-player', {
        width: '1',
        height: '1',
        videoId: MUSIC_VIDEO_ID,
        playerVars: {
            autoplay: 1,
            loop: 1,
            playlist: MUSIC_VIDEO_ID,
            playsinline: 1,
            mute: 1
        },
        events: {
            onReady: () => {
                const seek = document.getElementById('music-seek');
                const time = document.getElementById('music-time');
                const toggle = document.getElementById('music-toggle');

                tryAutoplayMuted();
                unlockAudioPlayback();

                setInterval(() => {
                    if (!ytPlayer || typeof ytPlayer.getCurrentTime !== 'function') return;
                    const current = ytPlayer.getCurrentTime() || 0;
                    const duration = ytPlayer.getDuration() || 0;
                    if (duration > 0 && document.activeElement !== seek) {
                        seek.value = (current / duration) * 100;
                    }
                    time.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
                }, 500);

                seek.addEventListener('input', (e) => {
                    const duration = ytPlayer.getDuration() || 0;
                    if (!duration) return;
                    const nextTime = (Number(e.target.value) / 100) * duration;
                    ytPlayer.seekTo(nextTime, true);
                });

                toggle.addEventListener('click', () => {
                    if (isMusicPlaying) {
                        ytPlayer.pauseVideo();
                    } else {
                        ytPlayer.playVideo();
                        unlockAudioPlayback();
                    }
                });
            },
            onStateChange: handleMusicStateChange
        }
    });
}

window.onYouTubeIframeAPIReady = onYouTubeIframeAPIReady;

applyLanguage(currentLanguage);
