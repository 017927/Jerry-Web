const { useEffect, useMemo, useRef, useState } = React;

function App() {
  const [lang, setLang] = useState('vi');
  const [modalOpen, setModalOpen] = useState(false);
  const [splashHidden, setSplashHidden] = useState(false);
  const [musicPanelOpen, setMusicPanelOpen] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [musicCurrent, setMusicCurrent] = useState(0);
  const [musicDuration, setMusicDuration] = useState(0);
  const [musicVolume, setMusicVolume] = useState(100);

  const mouseGlowRef = useRef(null);
  const musicWidgetRef = useRef(null);
  const ytPlayerRef = useRef(null);
  const interactedRef = useRef(false);
  const intervalRef = useRef(null);
  const musicVolumeRef = useRef(100);

  useEffect(() => {
    musicVolumeRef.current = musicVolume;
  }, [musicVolume]);

  const MUSIC_VIDEO_ID = 'KOn_gNbzQ5Q';

  const texts = useMemo(() => ({
    vi: {
      navHome: 'Trang chủ', navAbout: 'Giới thiệu', navServices: 'Dịch vụ', navContact: 'Liên hệ',
      getStarted: 'Bắt đầu!', badge: 'Tính năng mới',
      heroSubtitle: 'Chúng tôi giúp bạn xây dựng thương hiệu và phát triển doanh nghiệp với quy trình sáng tạo đột phá.',
      contactBtn: 'Liên hệ', learnMoreBtn: 'Tìm hiểu thêm',
      modalTitle: 'Khám Phá',
      modalDescription: 'Khám phá các dự án và đánh giá nổi bật từ các đối tác trang web khác của chúng tôi dưới đây.',
      modalConnect: 'Kết Nối Ngay',
      langLabel: 'Tiếng Việt', langFlag: 'https://flagcdn.com/w20/vn.png', langAlt: 'Vietnam flag'
    },
    en: {
      navHome: 'Home', navAbout: 'About', navServices: 'Services', navContact: 'Contact',
      getStarted: 'Get Started!', badge: 'New Feature',
      heroSubtitle: 'We help you build your brand and grow your business with a breakthrough creative process.',
      contactBtn: 'Contact Us', learnMoreBtn: 'Learn more',
      modalTitle: 'Explore',
      modalDescription: 'Explore standout projects and reviews from our partner websites below.',
      modalConnect: 'Connect Now',
      langLabel: 'English', langFlag: 'https://flagcdn.com/w20/gb.png', langAlt: 'UK flag'
    }
  }), []);

  const t = texts[lang];

  useEffect(() => {
    const timer = setTimeout(() => setSplashHidden(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const glow = mouseGlowRef.current;
    if (!glow) return;

    const onMove = (e) => {
      requestAnimationFrame(() => {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      });
      const target = document.elementFromPoint(e.clientX, e.clientY);
      if (target && target.closest('h1, h2, h3, p, span, a, button')) glow.classList.add('glow-hover');
      else glow.classList.remove('glow-hover');
    };

    const onLeave = () => glow.classList.remove('glow-hover');

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseleave', onLeave);

    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  useEffect(() => {
    const unlock = () => {
      interactedRef.current = true;
      const p = ytPlayerRef.current;
      if (p) {
        p.unMute?.();
        p.setVolume?.(musicVolumeRef.current);
        p.playVideo?.();
      }
    };

    document.addEventListener('click', unlock, { capture: true, once: true });

    const initPlayer = () => {
      if (ytPlayerRef.current || !window.YT || !window.YT.Player) return;

      ytPlayerRef.current = new window.YT.Player('yt-player', {
        width: '1',
        height: '1',
        videoId: MUSIC_VIDEO_ID,
        playerVars: { autoplay: 0, loop: 1, playlist: MUSIC_VIDEO_ID, playsinline: 1, mute: 1 },
        events: {
          onReady: () => {
            const p = ytPlayerRef.current;
            p.mute();
            p.pauseVideo();
            if (interactedRef.current) {
              p.unMute();
              p.setVolume(musicVolumeRef.current);
              p.playVideo();
            }

            intervalRef.current = setInterval(() => {
              setMusicCurrent(p.getCurrentTime?.() || 0);
              setMusicDuration(p.getDuration?.() || 0);
            }, 500);
          },
          onStateChange: (event) => {
            if (!window.YT || !window.YT.PlayerState) return;
            if (event.data === window.YT.PlayerState.PLAYING) setIsMusicPlaying(true);
            if (event.data === window.YT.PlayerState.PAUSED || event.data === window.YT.PlayerState.ENDED) setIsMusicPlaying(false);
          }
        }
      });
    };

    window.onYouTubeIframeAPIReady = initPlayer;
    if (window.YT && window.YT.Player) initPlayer();

    return () => {
      document.removeEventListener('click', unlock, true);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { Application } = await import('https://unpkg.com/@splinetool/runtime?module');
        if (!mounted) return;
        const canvas = document.getElementById('canvas3d');
        if (!canvas) return;
        const app = new Application(canvas);
        app.load('https://prod.spline.design/s8mFNdXKjCBGG-wI/scene.splinecode');
      } catch (e) {
        console.error('Spline load error', e);
      }
    })();

    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    const onEsc = (e) => {
      if (e.key === 'Escape') setModalOpen(false);
    };

    document.addEventListener('keydown', onEsc);
    return () => document.removeEventListener('keydown', onEsc);
  }, []);

  useEffect(() => {
    if (!musicPanelOpen) return;

    const onPointerDownOutside = (e) => {
      const widget = musicWidgetRef.current;
      if (!widget) return;
      if (widget.contains(e.target)) return;
      setMusicPanelOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDownOutside, true);
    return () => document.removeEventListener('pointerdown', onPointerDownOutside, true);
  }, [musicPanelOpen]);

  const openDiscord = () => window.open('https://discord.com/users/907464203663720480', '_blank');

  const seekValue = musicDuration > 0 ? (musicCurrent / musicDuration) * 100 : 0;
  const timeText = `${Math.floor(musicCurrent / 60)}:${String(Math.floor(musicCurrent % 60)).padStart(2, '0')} / ${Math.floor(musicDuration / 60)}:${String(Math.floor(musicDuration % 60)).padStart(2, '0')}`;

  const onSeek = (e) => {
    const p = ytPlayerRef.current;
    if (!p || !musicDuration) return;
    p.seekTo((Number(e.target.value) / 100) * musicDuration, true);
  };

  const toggleMusic = () => {
    const p = ytPlayerRef.current;
    if (!p) return;

    if (isMusicPlaying) {
      p.pauseVideo();
      return;
    }

    p.playVideo();
    if (interactedRef.current) {
      p.unMute();
      p.setVolume(musicVolume);
    }
  };

  const onVolumeChange = (e) => {
    const nextVolume = Number(e.target.value);
    setMusicVolume(nextVolume);

    const p = ytPlayerRef.current;
    if (!p) return;

    p.setVolume(nextVolume);
    if (interactedRef.current && p.isMuted && p.isMuted()) {
      p.unMute();
    }
  };

  const volumeIcon = musicVolume === 0 ? '🔇' : musicVolume < 50 ? '🔉' : '🔊';

  const cards = [
    {
      href: 'https://example.com/review1',
      img: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?auto=format&fit=crop&w=400&q=80',
      tag: 'Review',
      title: 'Digital Agency'
    },
    {
      href: 'https://example.com/review2',
      img: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=400&q=80',
      tag: 'Dự Án Mới',
      title: 'Tech Blog 3D'
    },
    {
      href: 'https://example.com/review3',
      img: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=400&q=80',
      tag: 'Case Study',
      title: 'Portfolio Sáng Tạo'
    },
    {
      href: 'https://example.com/review4',
      img: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&w=400&q=80',
      tag: 'Đánh Giá',
      title: 'E-Commerce App'
    }
  ];

  return (
    <>
      <div id="splash-screen" className={`fixed inset-0 z-[10010] bg-black flex justify-center items-center transition-opacity duration-1000 ${splashHidden ? 'opacity-0 pointer-events-none' : ''}`}>
        <div className="animate-splash-wrapper">
          <img src="image_898a1f.png" alt="Loading Logo" className="w-48 h-auto animate-spin-smooth" />
        </div>
      </div>

      <div id="mouse-glow" ref={mouseGlowRef}></div>
      <canvas id="canvas3d"></canvas>

      <div id="ui-layer">
        <nav className="w-full px-8 py-6 md:px-16 flex justify-between items-center pointer-events-auto animate-smooth-fade-in" style={{ animationDelay: '2100ms' }}>
          <div className="cursor-pointer flex items-center gap-3">
            <img src="image_898a1f.png" alt="Logo" className="h-10 w-auto opacity-50 hover:opacity-70 transition-opacity duration-300" />
            <span className="h-10 inline-flex items-center text-white/80 text-lg leading-none font-semibold tracking-wide [transform:scaleY(1.25)] origin-left">Jerry Web</span>
          </div>

          <div className="hidden md:flex items-center gap-10 text-white/70 text-[15px] font-medium">
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors duration-300">{t.navHome}</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setModalOpen(true); }} className="hover:text-white transition-colors duration-300">{t.navAbout}</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="hover:text-white transition-colors duration-300">{t.navServices}</a>
            <a href="https://discord.com/users/907464203663720480" target="_blank" rel="noreferrer" className="hover:text-white transition-colors duration-300">{t.navContact}</a>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setLang((v) => v === 'vi' ? 'en' : 'vi')} className="w-40 py-2.5 rounded-full bg-white/5 border border-white/10 text-white text-[15px] font-medium backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer hover:scale-105 active:scale-95 duration-300 flex items-center justify-center gap-2">
              <img src={t.langFlag} alt={t.langAlt} className="w-4 h-4 rounded-full object-cover" />
              <span>{t.langLabel}</span>
            </button>
            <button onClick={openDiscord} className="w-40 py-2.5 rounded-full bg-white/5 border border-white/10 text-white text-[15px] font-medium backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer hover:scale-105 active:scale-95 duration-300">
              {t.getStarted}
            </button>
          </div>
        </nav>

        <main className="flex-1 flex flex-col justify-center px-8 md:px-24 pb-20 pointer-events-none">
          <div className="max-w-xl pointer-events-auto">
            <div onClick={() => setModalOpen(true)} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8 animate-smooth-fade-up cursor-pointer hover:bg-white/10 transition-colors" style={{ animationDelay: '2300ms' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-yellow-400">
                <path d="M12 2l2.4 7.6h8l-6.4 4.8 2.4 7.6-6.4-4.8-6.4 4.8 2.4-7.6-6.4-4.8h8z" />
              </svg>
              <span className="text-sm font-medium text-white/90">{t.badge}</span>
            </div>

            <h1 className="text-[56px] md:text-[84px] font-bold text-white leading-[1.05] tracking-tight mb-6 animate-smooth-fade-up" style={{ animationDelay: '2500ms' }}>
              Creative<br />Process
            </h1>

            <p className="text-[17px] md:text-[19px] text-white/60 mb-10 max-w-[420px] leading-relaxed animate-smooth-fade-up" style={{ animationDelay: '2700ms' }}>
              {t.heroSubtitle}
            </p>

            <div className="flex flex-wrap items-center gap-4 animate-smooth-fade-up" style={{ animationDelay: '2900ms' }}>
              <button onClick={openDiscord} className="px-8 py-3.5 rounded-full bg-white text-black text-[15px] font-semibold hover:bg-gray-100 transition-all cursor-pointer shadow-lg hover:scale-105 active:scale-95 duration-300 inline-flex items-center gap-2">
                <span aria-hidden="true" className="text-sm leading-none">🎉</span>
                <span>{t.contactBtn}</span>
              </button>
              <button onClick={() => setModalOpen(true)} className="px-8 py-3.5 rounded-full bg-white/5 border border-white/10 text-white text-[15px] font-semibold backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer hover:scale-105 active:scale-95 duration-300">
                {t.learnMoreBtn}
              </button>
            </div>
          </div>
        </main>
      </div>

      {!modalOpen && (
        <button
          onClick={() => setModalOpen(true)}
          className="fixed right-5 md:right-8 top-[18vh] z-[10002] w-11 h-11 rounded-full bg-white/5 border border-white/10 text-white text-xl font-medium backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer hover:scale-105 active:scale-95 duration-700 pointer-events-auto flex items-center justify-center"
          aria-label="Open modal"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M2 10.75A1.75 1.75 0 0 1 3.75 9h2.69a.75.75 0 0 1 .75.75v9.5a.75.75 0 0 1-.75.75H3.75A1.75 1.75 0 0 1 2 18.25v-7.5ZM8.7 9.06a2.25 2.25 0 0 0-.2.93v8.26c0 .41.34.75.75.75h7.33a2.5 2.5 0 0 0 2.42-1.86l1.35-5A2.5 2.5 0 0 0 17.93 9H14V5.75A1.75 1.75 0 0 0 12.25 4h-.2a.75.75 0 0 0-.73.58l-.72 3.2a2.25 2.25 0 0 1-.9 1.28Z" />
          </svg>
        </button>
      )}

      <div onClick={() => setModalOpen(false)} className={`fixed inset-0 bg-black/20 backdrop-blur-[2px] z-[10000] transition-opacity duration-300 ${modalOpen ? 'opacity-100' : 'hidden opacity-0'}`}></div>

      <div className={`fixed top-[15vh] right-4 md:right-8 h-[70vh] w-[calc(100%-2rem)] max-w-md bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl z-[10001] transform transition-transform duration-500 ease-out flex flex-col pointer-events-auto ${modalOpen ? 'translate-x-0' : 'translate-x-[150%]'}`}>
        <div className="flex justify-between items-center p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <span>{t.modalTitle}</span>
          </h2>
          <button onClick={() => setModalOpen(false)} className="text-white/50 hover:text-white transition-colors cursor-pointer p-1">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          <p className="text-[15px] text-white/70 leading-relaxed mb-6">{t.modalDescription}</p>

          <div className="grid grid-cols-1 gap-4">
            {cards.map((card) => (
              <a key={card.href} href={card.href} target="_blank" rel="noreferrer" className="group relative block aspect-[16/9] overflow-hidden rounded-2xl border border-white/10 hover:border-white/30 transition-all cursor-pointer">
                <img src={card.img} alt={card.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-3">
                  <span className="text-[10px] font-semibold text-white/60 uppercase tracking-wider mb-1">{card.tag}</span>
                  <h3 className="text-white text-sm font-medium leading-tight transition-colors">{card.title}</h3>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-white/10">
          <button onClick={openDiscord} className="w-full py-3.5 rounded-xl bg-white text-black font-semibold hover:bg-gray-200 transition-colors cursor-pointer flex justify-center items-center gap-2">
            {t.modalConnect}
          </button>
        </div>
      </div>

      <div ref={musicWidgetRef} className="fixed bottom-3 left-5 z-[10002] pointer-events-auto">
        {!musicPanelOpen && (
          <button onClick={() => setMusicPanelOpen(true)} className="w-11 h-11 rounded-full bg-white/5 border border-white/10 text-white text-xl font-medium backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer hover:scale-105 active:scale-95 duration-300">
            ♪
          </button>
        )}

        <div className={`${musicPanelOpen ? 'opacity-100 translate-y-0 scale-100 pointer-events-auto' : 'opacity-0 translate-y-3 scale-95 pointer-events-none'} w-[320px] bg-black/70 border border-white/10 backdrop-blur-2xl rounded-2xl p-3 shadow-2xl transform transition-all duration-500 ease-out`}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-white text-sm font-semibold">Asher Fulero - Glimpsing Infinity</p>
            <button onClick={() => setMusicPanelOpen(false)} className="w-8 h-8 rounded-full bg-white/5 border border-white/10 text-white text-base backdrop-blur-md hover:bg-white/10 transition-all cursor-pointer">
              ♪
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={toggleMusic} className="w-9 h-9 rounded-full bg-white text-black text-sm font-bold hover:bg-gray-200 transition-colors">
              {isMusicPlaying ? '⏸' : '▶'}
            </button>
            <input type="range" min="0" max="100" value={seekValue} onChange={onSeek} className="flex-1 accent-white" />
            <span className="text-white/80 text-xs min-w-[76px] text-right">{timeText}</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-white/80 text-xs w-5 text-center">{volumeIcon}</span>
            <input type="range" min="0" max="100" value={musicVolume} onChange={onVolumeChange} className="flex-1 accent-white" />
            <span className="text-white/70 text-xs min-w-[34px] text-right">{musicVolume}%</span>
          </div>
        </div>
      </div>

      <div id="yt-player" style={{ position: 'fixed', left: '-9999px', top: '-9999px', width: '1px', height: '1px' }} aria-hidden="true"></div>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
