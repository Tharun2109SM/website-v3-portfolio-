document.addEventListener("DOMContentLoaded", () => {
    // Initialize Lenis
    const lenis = new Lenis({
        duration: 0.9,
        lerp: 0.12,
        smoothWheel: true,
        smoothTouch: false,
        wheelMultiplier: 1.0
    });

    // Generate Seamless Typographic Texture for Quote Section
    document.fonts.ready.then(() => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        const scale = window.devicePixelRatio || 2; // Retina Support
        const textStr = "SMASHING SHUTTLES BUILDING THINGS HAVING FUN ";

        // Base measurement (1x scale)
        ctx.font = '700 13px system-ui, -apple-system, sans-serif';
        const rawWidth = ctx.measureText(textStr).width;

        // Scale canvas memory bounds
        canvas.width = rawWidth * scale;
        canvas.height = 60 * scale;

        // Upscale rendering context
        ctx.scale(scale, scale);

        ctx.font = '700 13px system-ui, -apple-system, sans-serif';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)'; // Slight premium opacity
        ctx.textBaseline = 'middle';

        // Draw rows with alternating offsets for texture density
        ctx.fillText(textStr, 0, 15);
        ctx.fillText(textStr, -rawWidth / 2, 45);
        ctx.fillText(textStr, rawWidth / 2, 45);

        document.documentElement.style.setProperty('--quote-texture', `url(${canvas.toDataURL()})`);
    });

    // Premium Loader Sequence
    const loader = document.getElementById('premium-loader');
    const loaderText = document.getElementById('loader-text');

    if (loader && loaderText) {
        const words = ["Creator", "Builder", "Designer"];
        let currentIndex = 0;

        // Setup initial text
        loaderText.textContent = words[0];

        const cycleText = () => {
            // Animate In
            setTimeout(() => {
                loaderText.className = 'loader-text-window active';
            }, 100);

            // Animate Out
            setTimeout(() => {
                loaderText.className = 'loader-text-window exit';
            }, 1100); // 1 second visible time

            // Prepare next word or finish
            setTimeout(() => {
                loaderText.className = 'loader-text-window'; // Reset to bottom
                currentIndex++;

                if (currentIndex < words.length) {
                    loaderText.textContent = words[currentIndex];
                    cycleText();
                } else {
                    loader.classList.add('fade-out');
                    setTimeout(() => {
                        loader.remove(); // Clean up DOM
                    }, 800);
                }
            }, 1500);
        };

        // Start cycle
        cycleText();
    }

    // Local Time Update
    const timeDisplay = document.getElementById('local-time');
    if (timeDisplay) {
        const updateTime = () => {
            const now = new Date();
            let hours = now.getHours();
            let minutes = now.getMinutes();
            let seconds = now.getSeconds();
            const ampm = hours >= 12 ? 'PM' : 'AM';

            hours = hours % 12;
            hours = hours ? hours : 12;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;

            timeDisplay.textContent = `${hours}:${minutes}:${seconds} ${ampm}`;
        };
        updateTime();
        setInterval(updateTime, 1000);
    }

    // Set background video playback speed
    const bgVideo = document.querySelector('.bg-video');
    if (bgVideo) {
        bgVideo.playbackRate = 0.7;
    }

    // Reveal text animation for elements with .split-text
    const splitTextElements = document.querySelectorAll('.split-text');

    splitTextElements.forEach(element => {
        // Name split character animation
        const nameSpan = element.querySelector('.name');
        if (nameSpan) {
            const text = nameSpan.textContent;
            nameSpan.textContent = '';

            // Create a span for each character for staggered animation
            text.split('').forEach((char, index) => {
                const charSpan = document.createElement('span');
                charSpan.textContent = char;
                charSpan.className = 'char';
                // Apply animation with staggered delay
                charSpan.style.animation = `charDrop 1.2s cubic-bezier(0.165, 0.84, 0.44, 1) forwards`;
                charSpan.style.animationDelay = `${0.3 + (index * 0.08)}s`;
                // Add a space width if the character is a space
                if (char === ' ') {
                    charSpan.style.width = '0.3em';
                }
                nameSpan.appendChild(charSpan);
            });
        }

        // Removed greeting span handled
    });

    // Subtly move the video background with the mouse to create a premium parallax effect
    const videoContainer = document.querySelector('.video-container');
    const heroSection = document.querySelector('.hero-section');

    if (videoContainer && heroSection) {
        let isHovering = false;

        heroSection.addEventListener('mousemove', (e) => {
            if (!isHovering) return;

            // Calculate mouse position relative to the center of the screen
            const x = (e.clientX / window.innerWidth - 0.5) * 20; // Max 20px translation
            const y = (e.clientY / window.innerHeight - 0.5) * 20;

            // Apply slight transform to the video container based on mouse position
            requestAnimationFrame(() => {
                videoContainer.style.transform = `translate(${-x}px, ${-y}px) scale(1.05)`;
            });
        });

        // Reset when mouse leaves
        heroSection.addEventListener('mouseleave', () => {
            isHovering = false;
            requestAnimationFrame(() => {
                videoContainer.style.transform = `translate(0, 0) scale(1.05)`;
                videoContainer.style.transition = `transform 0.8s cubic-bezier(0.165, 0.84, 0.44, 1)`;
            });
        });

        // Remove transition during mousemove for instant precise feedback
        heroSection.addEventListener('mouseenter', () => {
            isHovering = true;
            videoContainer.style.transition = 'transform 0.1s linear';
        });
    }

    // ==========================================
    // LAST.FM MUSIC WIDGET (NOW PLAYING)
    // ==========================================
    // INSERT YOUR LAST.FM DETAILS HERE:
    const LASTFM_USERNAME = 'TharunSM2109';
    const LASTFM_API_KEY = '080b0dc375a55017e9ae7e82ac029572';
    // ==========================================

    const musicLabel = document.getElementById('music-label');
    const musicTrack = document.getElementById('music-track');
    const musicArtist = document.getElementById('music-artist');

    if (musicLabel && musicTrack && musicArtist) {
        let currentTrackName = '';

        const updateNowPlaying = async () => {
            if (LASTFM_USERNAME === 'YOUR_LASTFM_USERNAME' || LASTFM_API_KEY === 'YOUR_LASTFM_API_KEY') {
                musicLabel.textContent = 'Setup Required';
                musicTrack.textContent = 'Add API Key';
                musicArtist.textContent = 'in script.js';
                return;
            }

            try {
                const timestamp = new Date().getTime(); /* Prevent aggressive browser caching */
                const url = `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${LASTFM_USERNAME}&api_key=${LASTFM_API_KEY}&format=json&limit=1&t=${timestamp}`;
                const response = await fetch(url, { cache: 'no-store' });
                if (!response.ok) throw new Error('Network response was not ok');

                const data = await response.json();

                if (data.recenttracks && data.recenttracks.track && data.recenttracks.track.length > 0) {
                    const track = data.recenttracks.track[0];
                    const isPlaying = track['@attr'] && track['@attr'].nowplaying === 'true';

                    const newTrackName = track.name;
                    const newArtistName = track.artist['#text'];

                    // Only apply transition if track changed
                    if (currentTrackName !== newTrackName) {
                        currentTrackName = newTrackName;

                        // Extract album art
                        const images = track.image;
                        let imageUrl = '';
                        if (images && images.length > 0) {
                            const largeImage = images.find(img => img.size === 'extralarge') || images.find(img => img.size === 'large') || images[images.length - 1];
                            imageUrl = largeImage ? largeImage['#text'] : '';
                        }

                        const musicMedia = document.querySelector('.music-media');
                        const musicAlbumArt = document.getElementById('music-album-art');

                        // Fade out
                        musicTrack.style.opacity = '0';
                        musicArtist.style.opacity = '0';

                        setTimeout(() => {
                            musicTrack.textContent = newTrackName;
                            musicArtist.textContent = newArtistName;
                            if (isPlaying) {
                                musicLabel.textContent = 'Now Playing';
                                musicLabel.classList.add('playing');
                            } else {
                                musicLabel.textContent = 'Not listening';
                                musicLabel.classList.remove('playing');
                            }

                            if (imageUrl && musicAlbumArt && musicMedia) {
                                musicAlbumArt.src = imageUrl;
                                musicMedia.classList.add('has-art');
                            } else if (musicMedia && musicAlbumArt) {
                                musicAlbumArt.src = '';
                                musicMedia.classList.remove('has-art');
                            }

                            // Fade in
                            musicTrack.style.opacity = '1';
                            musicArtist.style.opacity = '1';
                        }, 400); // Wait for fade out
                    } else {
                        // Just update play state without track transition
                        if (isPlaying) {
                            musicLabel.textContent = 'Now Playing';
                            musicLabel.classList.add('playing');
                        } else {
                            musicLabel.textContent = 'Not listening';
                            musicLabel.classList.remove('playing');
                        }
                    }
                } else {
                    throw new Error('No tracks found');
                }
            } catch (error) {
                console.error('Last.fm fetch error:', error);
                musicLabel.textContent = 'Error';
                musicLabel.classList.remove('playing');
                musicTrack.textContent = 'Music unavailable';
                musicArtist.textContent = 'Try again later';
            }
        };

        // Initial fetch
        updateNowPlaying();

        // Refresh every 10 seconds
        setInterval(updateNowPlaying, 10000);
    }

    // ==========================================
    // ABOUT SECTION SCROLL ANIMATIONS
    // ==========================================
    const scrollObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, scrollObserverOptions);

    // Observe heading, paragraphs, quotes, beyond section, and master quote
    const animatedElements = document.querySelectorAll('.about-heading, .about-paragraph p, .quote-section, .beyond-section, .master-quote-section');
    animatedElements.forEach(el => scrollObserver.observe(el));

    // ==========================================
    // ADVANCED CINEMATIC WEATHER ENGINE (VIDEO SCRUBBING & GRADIENTS)
    // ==========================================

    const videoElement = document.querySelector('.bg-video');
    const overlayElement = document.querySelector('.color-layer');
    const sequenceCanvas = document.querySelector('.sequence-canvas');
    let seqCtx = null;

    if (sequenceCanvas) {
        seqCtx = sequenceCanvas.getContext('2d');
        // Initial setup for 4K 16:9 aspect
        sequenceCanvas.width = 3840;
        sequenceCanvas.height = 2160;
    }

    // ==========================================
    // IMAGE SEQUENCE PRELOADER (4K ASSETS)
    // ==========================================
    const totalFrames = 200;
    const frames = [];
    let loadedCount = 0;

    for (let i = 1; i <= totalFrames; i++) {
        const img = new Image();
        // Assuming sequence images fall into this path layout format
        img.src = `assets/sequence/frame_${i.toString().padStart(4, '0')}.jpg`;
        img.onload = () => {
            loadedCount++;
        };
        frames.push(img);
    }

    // Remove background-color transitioning CSS fighting with our JS loop
    if (overlayElement) overlayElement.style.transition = 'none';

    // Milestones matrix defining the profound atmospheric curve [ pct, brightness, UI_Dim, topGradient[RGBA], midGradient[RGBA], botGradient[RGBA] ]
    const milestones = [
        // Early Morning - Soft, bright, cool tones
        {
            pct: 0.00, b: 1.10, ui_dim: 1.00,
            top: [160, 200, 255, 0.20], mid: [180, 210, 255, 0.25], bot: [200, 230, 255, 0.30]
        },

        // Late Morning - Slightly warmer, soft fade
        {
            pct: 0.15, b: 1.00, ui_dim: 1.00,
            top: [200, 200, 240, 0.30], mid: [220, 210, 230, 0.35], bot: [240, 220, 220, 0.35]
        },

        // Afternoon - Balanced, slightly warm
        {
            pct: 0.30, b: 0.90, ui_dim: 0.90,
            top: [255, 200, 150, 0.40], mid: [255, 180, 120, 0.45], bot: [255, 160, 100, 0.45]
        },

        // Late Afternoon - Transitioning to Sunset
        {
            pct: 0.45, b: 0.80, ui_dim: 0.80,
            top: [240, 150, 100, 0.50], mid: [220, 120, 120, 0.55], bot: [200, 90, 140, 0.55]
        },

        // Sunset - Warm + Darker
        {
            pct: 0.60, b: 0.65, ui_dim: 0.70,
            top: [180, 90, 140, 0.60], mid: [150, 70, 160, 0.65], bot: [120, 50, 180, 0.65]
        },

        // Night - Cool, dark
        {
            pct: 0.75, b: 0.50, ui_dim: 0.50,
            top: [80, 60, 140, 0.70], mid: [60, 50, 120, 0.75], bot: [40, 40, 100, 0.75]
        },

        // Late Night - Deep tones
        {
            pct: 0.88, b: 0.35, ui_dim: 0.35,
            top: [40, 40, 80, 0.80], mid: [30, 30, 60, 0.80], bot: [20, 20, 40, 0.80]
        },

        // Midnight - Near black but readable
        {
            pct: 0.96, b: 0.20, ui_dim: 0.20,
            top: [20, 20, 30, 0.85], mid: [10, 10, 20, 0.85], bot: [5, 5, 10, 0.85]
        },

        // End of Scroll (Hold Midnight)
        {
            pct: 1.00, b: 0.20, ui_dim: 0.20,
            top: [20, 20, 30, 0.85], mid: [10, 10, 20, 0.85], bot: [5, 5, 10, 0.85]
        }
    ];

    function lerp(start, end, amt) {
        return (1 - amt) * start + amt * end;
    }

    function lerpArr(a1, a2, t) {
        return [
            Math.round(lerp(a1[0], a2[0], t)),
            Math.round(lerp(a1[1], a2[1], t)),
            Math.round(lerp(a1[2], a2[2], t)),
            lerp(a1[3], a2[3], t).toFixed(3)
        ];
    }

    let targetProgress = 0;
    let smoothScroll = 0;
    let displayProgress = 0;
    let displayQuoteProgress = 0; // Cinematic tracking specifically for depth-driven typography scrubbing
    let velocity = 0;
    let lastFrame = -1;

    // ==========================================
    // GSAP SCROLLTRIGGER SETUP FOR GEAR SECTION
    // ==========================================
    const gearSection = document.querySelector('.gear-section');
    const gearTrack = document.querySelector('.gear-track');
    const gearItems = document.querySelectorAll('.gear-item');

    if (gearSection && gearTrack && gearItems.length > 0) {
        // Sync GSAP ticker with Lenis
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
        
        lenis.on('scroll', ScrollTrigger.update);

        ScrollTrigger.create({
            trigger: gearSection,
            start: "top top",
            end: "+=2000", // Fixed scroll distance for the entire interaction
            pin: true,
            scrub: 1,
            onUpdate: (self) => {
                const total = gearItems.length;
                let closestIndex = Math.round(self.progress * (total - 1));
                
                gearItems.forEach((item, i) => {
                    let dist = Math.abs(closestIndex - i);
                    
                    if (dist === 0) {
                        item.classList.add('active');
                        item.classList.remove('side', 'far');
                        item.style.zIndex = 10;
                    } else if (dist === 1) {
                        item.classList.add('side');
                        item.classList.remove('active', 'far');
                        item.style.zIndex = 5;
                    } else {
                        item.classList.add('far');
                        item.classList.remove('active', 'side');
                        item.style.zIndex = 1;
                    }
                });
            }
        });
    }

    // ==========================================
    // GSAP SCROLLTRIGGER FOR MUSIC SECTION
    // ==========================================
    const musicSection = document.querySelector('.music-section');
    const musicHeading = document.querySelector('.music-heading');
    const musicParagraph = document.querySelector('.music-paragraph');
    const musicKeyboard = document.querySelector('.music-keyboard-container');

    if (musicSection && musicHeading && musicParagraph) {
        ScrollTrigger.create({
            trigger: musicSection,
            start: "top 50%", // Trigger when section hits the middle of the screen
            onEnter: () => {
                gsap.to(musicHeading, {
                    y: 0,
                    opacity: 1,
                    duration: 1.5,
                    ease: "power2.out"
                });
                gsap.to(musicParagraph, {
                    y: 0,
                    opacity: 1,
                    duration: 1.5,
                    delay: 0.2,
                    ease: "power2.out"
                });
                if (musicKeyboard) {
                    gsap.to(musicKeyboard, {
                        y: 0,
                        opacity: 1,
                        duration: 1.5,
                        delay: 0.4,
                        ease: "power2.out"
                    });
                }
            },
            onLeaveBack: () => {
                // Reset when scrolling back up
                gsap.set([musicHeading, musicParagraph], { y: 20, opacity: 0 });
                if (musicKeyboard) {
                    gsap.set(musicKeyboard, { y: 30, opacity: 0 });
                }
            }
        });
    }

    // ==========================================
    // FUTURE SECTION ANIMATION
    // ==========================================
    const futureSection = document.querySelector('.future-section');
    const headingFocus = document.querySelector('.heading-focus');

    if (futureSection && headingFocus) {
        gsap.to(headingFocus, {
            scale: 1.05,
            opacity: 1,
            ease: "none",
            scrollTrigger: {
                trigger: futureSection,
                start: "top 70%",
                end: "center 40%",
                scrub: 1.5 // Smooth gradual scrubbing
            }
        });
    }

    // ==========================================
    // FINAL SECTION ANIMATION
    // ==========================================
    const finalSection = document.querySelector('.final-section');
    const finalLines = document.querySelectorAll('.final-line');
    const finalSocials = document.querySelector('.final-socials');

    if (finalSection && finalLines.length > 0 && finalSocials) {
        ScrollTrigger.create({
            trigger: finalSection,
            start: "top 60%", 
            onEnter: () => {
                gsap.to(finalLines, {
                    y: 0,
                    opacity: 1,
                    duration: 0.7,
                    stagger: 0.15, // Fast sequential reveal
                    delay: 0.05, // Almost immediate
                    ease: "cubic-bezier(0.22, 1, 0.36, 1)"
                });
                gsap.to(finalSocials, {
                    scale: 1,
                    opacity: 1,
                    duration: 0.45,
                    delay: 0.25, // Snappy appearance right after quote
                    ease: "cubic-bezier(0.22, 1, 0.36, 1)"
                });
            },
            onLeaveBack: () => {
                gsap.set(finalLines, { y: 10, opacity: 0 });
                gsap.set(finalSocials, { scale: 0.9, opacity: 0 });
            }
        });
    }


    // Set initial cinematic hero playback rate
    if (videoElement) {
        videoElement.playbackRate = 0.7;
        videoElement.muted = true;
        videoElement.play().catch(() => { });
        // Always display canvas natively
        if (sequenceCanvas) {
            sequenceCanvas.style.display = 'block';
        }
    }

    lenis.on('scroll', (e) => {
        const scroll = e.scroll;
        const limit = e.limit;

        smoothScroll = scroll;
        targetProgress = Math.max(0, Math.min(1, scroll / limit));
    });

    function renderCinematicEngine(time) {
        // lenis.raf is now handled by gsap.ticker to avoid double-calling

        // High-stability velocity-based smoothing specifically bound to the isolated image scrubber
        displayProgress += (targetProgress - displayProgress) * 0.08;

        // Locate correct milestone brackets
        let m1 = milestones[0];
        let m2 = milestones[milestones.length - 1];

        for (let i = 0; i < milestones.length - 1; i++) {
            if (displayProgress >= milestones[i].pct && displayProgress <= milestones[i + 1].pct) {
                m1 = milestones[i];
                m2 = milestones[i + 1];
                break;
            }
        }

        // Calculate fractional progression exclusively between the two active milestones
        const range = m2.pct - m1.pct;
        const localProgress = range > 0 ? (displayProgress - m1.pct) / range : 0;

        // Interpolate CSS Variable Filters & UI Alpha
        const currentB = lerp(m1.b, m2.b, localProgress).toFixed(3);
        const currentUIDim = lerp(m1.ui_dim, m2.ui_dim, localProgress).toFixed(3);

        // Multi-stop Gradients linearly merged
        const cTop = lerpArr(m1.top, m2.top, localProgress);
        const cMid = lerpArr(m1.mid, m2.mid, localProgress);
        const cBot = lerpArr(m1.bot, m2.bot, localProgress);

        // Apply visual updates using deep hardware composition
        if (overlayElement) {
            overlayElement.style.backgroundImage = `linear-gradient(to bottom, rgba(${cTop.join(',')}), rgba(${cMid.join(',')}), rgba(${cBot.join(',')}))`;
            overlayElement.style.backgroundColor = 'transparent'; // Fallback wipe
        }
        // Advanced seamless crossover tracking
        if (videoElement && sequenceCanvas) {
            const scrollY = smoothScroll;
            const heroHeight = window.innerHeight;

            // Initiate transition blend far earlier natively crossing over viewport states
            const transitionStart = heroHeight * 0.5;
            const transitionEnd = heroHeight * 1.0;

            // Construct eased interpolation metric overriding linear jump
            const rawT = Math.max(0, Math.min(1, (scrollY - transitionStart) / (transitionEnd - transitionStart)));
            const t = 1 - Math.pow(1 - rawT, 3); // ease-out cubic

            videoElement.style.opacity = 1 - t;
            sequenceCanvas.style.opacity = t;

            // Keep playback continuous until transition explicitly overrides
            if (t >= 0.95 && !videoElement.paused) {
                videoElement.pause();
            } else if (t < 0.95 && videoElement.paused) {
                videoElement.playbackRate = 0.7;
                videoElement.play().catch(() => { });
            }

            videoElement.style.filter = `brightness(${currentB})`;
        }

        // DIRECT MAPPED CANVAS SEQUENCE RENDERING 
        if (seqCtx && loadedCount >= totalFrames * 0.9) {
            let frameIndex = 0;

            const scrollY = smoothScroll;
            const transitionStart = window.innerHeight * 0.5;

            // Hook to live video playback natively when scrolling before the transition overrides
            if (scrollY < transitionStart && videoElement && videoElement.duration > 0) {
                const videoProgress = videoElement.currentTime / videoElement.duration;
                frameIndex = Math.floor(videoProgress * (totalFrames - 1));
            } else {
                frameIndex = Math.floor(displayProgress * (totalFrames - 1));
            }

            // Constrain arrays
            frameIndex = Math.max(0, Math.min(frameIndex, totalFrames - 1));

            if (frameIndex !== lastFrame && frames[frameIndex] && frames[frameIndex].complete) {
                seqCtx.clearRect(0, 0, sequenceCanvas.width, sequenceCanvas.height);
                seqCtx.drawImage(frames[frameIndex], 0, 0, sequenceCanvas.width, sequenceCanvas.height);
                // In scroll mode, apply atmospheric video filters exactly identically to the canvas rendering
                sequenceCanvas.style.filter = `brightness(${currentB})`;
                lastFrame = frameIndex;
            }
        }

        // Seamlessly update UI Dimming properties mapping down to foreground layout elements
        document.documentElement.style.setProperty('--ui-dim', currentUIDim);

        // ==========================================
        // QUOTE SECTION SMOOTH SCROLL FADE OUT
        // ==========================================
        const quoteSection = document.querySelector('.quote-section');
        if (quoteSection) {
            const rect = quoteSection.getBoundingClientRect();
            // Scale raw progression natively ONLY as section pushes towards the upper half of screen (Leaving the viewport upwards)
            // rect.top < 0 means moving past center.
            const rawQuoteProgress = Math.max(0, Math.min(1, (-rect.top) / (window.innerHeight * 0.5)));

            // Core cinematic Apple-smooth inertia interpolation
            displayQuoteProgress += (rawQuoteProgress - displayQuoteProgress) * 0.08;

            const quoteContainer = quoteSection.querySelector('.quote-container');
            if (quoteContainer) {
                if (displayQuoteProgress > 0.001) {
                    const normalizedLineProgress = Math.max(0, Math.min(1, displayQuoteProgress));

                    const fadeOutOpacity = 1 - normalizedLineProgress;
                    const scaleOutTransform = 1 - (normalizedLineProgress * 0.08);

                    quoteContainer.style.transform = `translateY(0) scale(${scaleOutTransform})`;
                    quoteContainer.style.opacity = `${fadeOutOpacity}`;
                    quoteContainer.style.transition = 'none'; // Lock out CSS gracefully during scrub
                } else if (quoteSection.classList.contains('in-view')) {
                    // Fully reset rendering strings so CSS engine handles entry float seamlessly
                    quoteContainer.style.transform = '';
                    quoteContainer.style.opacity = '1';
                    quoteContainer.style.transition = '';
                }
            }
        }

        // ==========================================
        // PACE WORD SCROLL ANIMATION
        // ==========================================
        const paceEl = document.querySelector('.pace-word');
        if (paceEl) {
            const rect = paceEl.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Only calculate if visible
            if (rect.top < viewportHeight && rect.bottom > 0) {
                // Normalize position (center of screen = strongest effect)
                const centerOffset = Math.abs((rect.top + rect.height / 2) - viewportHeight / 2);
                const maxOffset = viewportHeight / 2;
                
                const t = Math.max(0, 1 - Math.min(centerOffset / maxOffset, 1)); // 0 at edges, 1 at center
                
                // Smooth effect
                const scale = 1 + (t * 0.08); // max 1.08
                const glow = t * 8; // subtle glow
                
                paceEl.style.transform = `scale(${scale})`;
                paceEl.style.textShadow = `0 0 ${glow}px rgba(255,255,255,0.4)`;
            }
        }

        // Gear section scroll logic moved to GSAP ScrollTrigger

        // Keep running infinity render loop
        window.requestAnimationFrame(renderCinematicEngine);
    }

    // Initialize rendering engine continuously
    requestAnimationFrame(renderCinematicEngine);

    // ==========================================
    // CURSOR TEXT MASK EFFECT (QUOTE SECTION)
    // ==========================================
    const quoteSectionEl = document.querySelector('.quote-section');
    const thinTextEl = document.querySelector('.thin-text');

    if (quoteSectionEl && thinTextEl) {
        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let cursorX = mouseX;
        let cursorY = mouseY;

        // Track mouse position relative to the thin text container
        quoteSectionEl.addEventListener('mousemove', (e) => {
            const rect = thinTextEl.getBoundingClientRect();
            mouseX = e.clientX - rect.left;
            mouseY = e.clientY - rect.top;
        });

        function animateCursorMask() {
            // Smooth interpolation (lerp)
            cursorX += (mouseX - cursorX) * 0.12;
            cursorY += (mouseY - cursorY) * 0.12;

            // Only update DOM if section is somewhat in view to save performance
            const rect = quoteSectionEl.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                thinTextEl.style.setProperty('--cursor-x', `${cursorX}px`);
                thinTextEl.style.setProperty('--cursor-y', `${cursorY}px`);
            }

            requestAnimationFrame(animateCursorMask);
        }

        // Start animation loop
        requestAnimationFrame(animateCursorMask);
    }

    // ==========================================
    // FAULTY TERMINAL BACKGROUND ANIMATION (QUOTE SECTION)
    // ==========================================
    const faultyCanvas = document.getElementById('faulty-terminal-bg');
    if (faultyCanvas) {
        const ctx = faultyCanvas.getContext('2d');
        let width = 0;
        let height = 0;
        let dpr = window.devicePixelRatio || 2;
        
        let config = {
            glitchAmount: 0.2, 
            flickerAmount: 0.3,
            scanlineIntensity: 0.1,
            chromaticAberration: 0.015,
            brightness: 1.15
        };

        const offscreen = document.createElement('canvas');
        const offCtx = offscreen.getContext('2d');

        const resizeFaulty = () => {
            width = faultyCanvas.offsetWidth || window.innerWidth * 0.65;
            height = faultyCanvas.offsetHeight || window.innerHeight * 0.4;
            
            faultyCanvas.width = width * dpr;
            faultyCanvas.height = height * dpr;
            
            offscreen.width = width * dpr;
            offscreen.height = height * dpr;

            // Generate random terminal content once to save GPU
            offCtx.fillStyle = '#ffffff';
            offCtx.font = `${14 * dpr}px monospace`;
            offCtx.textBaseline = 'top';
            
            const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()_+-=[]{}|;':,./<>?";
            
            for (let y = 0; y < offscreen.height; y += 20 * dpr) {
                for (let x = 0; x < offscreen.width; x += 120 * dpr) {
                    if (Math.random() > 0.3) {
                        let str = "";
                        let len = Math.floor(Math.random() * 15) + 5;
                        for (let i = 0; i < len; i++) {
                            str += chars[Math.floor(Math.random() * chars.length)];
                        }
                        offCtx.fillText(str, x, y);
                    }
                }
            }
        };
        
        window.addEventListener('resize', resizeFaulty);
        // Delay initial resize slightly to ensure CSS bounds are computed
        setTimeout(resizeFaulty, 100);

        const renderFaulty = () => {
            // Only animate if in view
            const rect = faultyCanvas.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0 && width > 0) {
                ctx.clearRect(0, 0, faultyCanvas.width, faultyCanvas.height);
                
                // 1. Flicker
                let flicker = Math.random() < config.flickerAmount ? (0.7 + Math.random() * 0.3) : 1.0;
                let isGlitching = Math.random() < config.glitchAmount;
                let shiftX = faultyCanvas.width * config.chromaticAberration;

                // 2. Chromatic split drawing
                ctx.globalCompositeOperation = 'source-over';
                
                // Draw left ghost
                ctx.globalAlpha = (flicker * config.brightness) * 0.5;
                ctx.drawImage(offscreen, -shiftX, 0);
                
                // Draw right ghost
                ctx.drawImage(offscreen, shiftX, 0);
                
                // Draw center crisp
                ctx.globalAlpha = flicker * config.brightness;
                ctx.drawImage(offscreen, 0, 0);
                
                // 3. Glitch Slices
                if (isGlitching) {
                    let slices = Math.floor(Math.random() * 4) + 1;
                    for (let i = 0; i < slices; i++) {
                        let sy = Math.random() * faultyCanvas.height;
                        let sh = Math.random() * (faultyCanvas.height / 5);
                        let offset = (Math.random() - 0.5) * 80 * dpr;
                        
                        ctx.drawImage(
                            faultyCanvas, 
                            0, sy, faultyCanvas.width, sh, 
                            offset, sy, faultyCanvas.width, sh 
                        );
                    }
                }

                // 4. Scanlines
                ctx.fillStyle = `rgba(0, 0, 0, ${config.scanlineIntensity})`;
                for (let y = 0; y < faultyCanvas.height; y += 4 * dpr) {
                    ctx.fillRect(0, y, faultyCanvas.width, 1 * dpr);
                }
            }

            requestAnimationFrame(renderFaulty);
        };
        
        requestAnimationFrame(renderFaulty);

        // Hover interaction
        const quoteSection = document.querySelector('.master-quote-section');
        if (quoteSection) {
            quoteSection.addEventListener('mouseenter', () => {
                gsap.to(config, { glitchAmount: 0.3, flickerAmount: 0.4, duration: 0.4 });
            });
            quoteSection.addEventListener('mouseleave', () => {
                gsap.to(config, { glitchAmount: 0.2, flickerAmount: 0.3, duration: 0.8 });
            });
        }
    }
});


