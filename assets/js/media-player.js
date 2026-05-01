(function () {
    var players = window.__jijianMediaPlayers || (window.__jijianMediaPlayers = {});

    function isDarkTheme() {
        var root = document.documentElement;
        if (root && root.dataset && root.dataset.theme) {
            return root.dataset.theme === 'dark';
        }
        return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function applyAudioChrome(host) {
        if (!host || host.dataset.type !== 'audio') {
            return;
        }

        var color = isDarkTheme() ? '#f8fafc' : '#0f172a';
        var mount = host.querySelector('.media-player');
        if (!mount) {
            return;
        }

        mount.querySelectorAll('xg-icon.xgplayer-play, xg-icon.xgplayer-volume').forEach(function (icon) {
            icon.style.color = color;
            icon.style.fill = color;
            icon.style.stroke = color;
        });

        mount.querySelectorAll(
            'xg-icon.xgplayer-play svg path,' +
            'xg-icon.xgplayer-volume svg path,' +
            'xg-icon.xgplayer-play [fill],' +
            'xg-icon.xgplayer-volume [fill]'
        ).forEach(function (node) {
            node.style.setProperty('fill', color, 'important');
            node.style.setProperty('stroke', color, 'important');
            node.setAttribute('fill', color);
        });

        mount.querySelectorAll('xg-trigger, xg-prompt, xg-error, .xg-playbackrate.xg-top-note').forEach(function (node) {
            node.style.setProperty('display', 'none', 'important');
        });
    }

    function toBool(value) {
        return value === 'true';
    }

    function pauseOtherPlayers(currentPlayer) {
        Object.keys(players).forEach(function (key) {
            var otherPlayer = players[key];
            if (!otherPlayer || otherPlayer === currentPlayer || typeof otherPlayer.pause !== 'function') {
                return;
            }

            try {
                otherPlayer.pause();
            } catch (error) {
                console.warn('jijian media pause skipped', error);
            }
        });
    }

    function bindExclusivePlayback(player) {
        if (!player || typeof player.on !== 'function') {
            return;
        }

        player.on('play', function () {
            pauseOtherPlayers(player);
        });
    }

    function supportsNativeHls() {
        var video = document.createElement('video');
        return !!video.canPlayType('application/vnd.apple.mpegurl');
    }

    function createAudioPlayer(host, mount) {
        return new window.Player({
            el: mount,
            url: host.dataset.src,
            mediaType: 'audio',
            title: host.dataset.title || '',
            poster: host.dataset.cover || '',
            autoplay: toBool(host.dataset.autoplay),
            loop: toBool(host.dataset.loop),
            width: '100%',
            height: 74,
            controls: {
                mode: 'flex',
                initShow: true,
                autoHide: false
            },
            marginControls: true,
            presets: window.MusicPreset ? ['default', window.MusicPreset] : ['default'],
            music: {
                list: [{
                    src: host.dataset.src,
                    title: host.dataset.title || '',
                    vid: mount.id,
                    poster: host.dataset.cover || ''
                }]
            },
            ignores: [
                'start',
                'poster',
                'musiccover',
                'musicbackward',
                'musicprev',
                'musicnext',
                'musicforward',
                'fullscreen',
                'cssfullscreen',
                'pip',
                'download',
                'screenshot',
                'definition',
                'playbackrate',
                'rotate',
                'playnext',
                'replay',
                'enter',
                'miniscreen'
            ]
        });
    }

    function createVideoPlayer(host, mount) {
        var isHls = toBool(host.dataset.hls);
        var useNativeHls = isHls && supportsNativeHls();
        var config = {
            el: mount,
            url: host.dataset.src,
            title: host.dataset.title || '',
            poster: host.dataset.cover || '',
            autoplay: toBool(host.dataset.autoplay),
            muted: toBool(host.dataset.muted),
            loop: toBool(host.dataset.loop),
            playsinline: true,
            width: '100%',
            height: '100%',
            closeVideoClick: false,
            closeVideoDblclick: false
        };

        if (isHls && !useNativeHls && window.HlsPlayer && window.HlsPlayer.isSupported && window.HlsPlayer.isSupported()) {
            config.plugins = [window.HlsPlayer];
            config.hls = {};
        }

        return new window.Player(config);
    }

    function initMediaPlayer(host) {
        if (!host || host.dataset.initialized === 'true') {
            return;
        }

        var mount = host.querySelector('.media-player');
        if (!mount || !window.Player) {
            return;
        }

        var needsAudioPreset = host.dataset.type === 'audio' && !window.MusicPreset;
        var needsHlsPlugin = toBool(host.dataset.hls) && !supportsNativeHls() && (!window.HlsPlayer || !window.HlsPlayer.isSupported || !window.HlsPlayer.isSupported());
        if (needsAudioPreset || needsHlsPlugin) {
            console.error('jijian media init failed: missing xgplayer plugin', host.dataset.src);
            return;
        }

        try {
            var player = host.dataset.type === 'audio'
                ? createAudioPlayer(host, mount)
                : createVideoPlayer(host, mount);

            bindExclusivePlayback(player);

            applyAudioChrome(host);
            setTimeout(function () { applyAudioChrome(host); }, 0);
            setTimeout(function () { applyAudioChrome(host); }, 120);
            setTimeout(function () { applyAudioChrome(host); }, 360);

            if (player && typeof player.on === 'function') {
                ['ready', 'canplay', 'play', 'pause', 'volumechange'].forEach(function (eventName) {
                    player.on(eventName, function () {
                        applyAudioChrome(host);
                    });
                });
            }

            host.dataset.initialized = 'true';
            mount.setAttribute('data-player-ready', 'true');
            players[mount.id] = player;
        } catch (error) {
            console.error('jijian media init failed', error);
        }
    }

    function initAllMediaPlayers() {
        document.querySelectorAll('.media-shortcode[data-media="true"]').forEach(initMediaPlayer);
    }

    function refreshAllAudioChrome() {
        document.querySelectorAll('.media-shortcode[data-media="true"][data-type="audio"]').forEach(applyAudioChrome);
    }

    var root = document.documentElement;
    if (root && window.MutationObserver) {
        var observer = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    refreshAllAudioChrome();
                }
            });
        });
        observer.observe(root, { attributes: true, attributeFilter: ['data-theme'] });
    }

    if (window.matchMedia) {
        var media = window.matchMedia('(prefers-color-scheme: dark)');
        if (typeof media.addEventListener === 'function') {
            media.addEventListener('change', refreshAllAudioChrome);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAllMediaPlayers, { once: true });
    } else {
        initAllMediaPlayers();
    }
})();
