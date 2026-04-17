document.addEventListener("DOMContentLoaded", () => {
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
        if(nameSpan) {
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

    // Observe heading and all paragraphs
    const animatedElements = document.querySelectorAll('.about-heading, .about-paragraph p');
    animatedElements.forEach(el => scrollObserver.observe(el));
});
