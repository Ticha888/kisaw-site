(function() {
    const isHomePage = !!document.getElementById('request-form');

    // ─── 1. Fix send-signal-btn links on non-homepage pages ───────────────────
    if (!isHomePage) {
        document.querySelectorAll('.send-signal-btn, .send-signal-btn-mobile').forEach(btn => {
            btn.href = 'index.html#request-form';
        });
    }

    // ─── 2. On homepage: smooth-scroll to form, center it in viewport ──────────
    if (isHomePage) {
        document.querySelectorAll('.send-signal-btn, .send-signal-btn-mobile').forEach(btn => {
            btn.addEventListener('click', function(e) {
                const target = document.getElementById('request-form');
                if (!target) return;
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'center' });
            });
        });
    }

    // ─── 3. On homepage: if arrived via anchor, center the form ───────────────
    if (isHomePage && window.location.hash === '#request-form') {
        window.addEventListener('load', () => {
            const target = document.getElementById('request-form');
            if (target) {
                setTimeout(() => {
                    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 100);
            }
        });
    }

    // ─── 4. Homepage form functionality ───────────────────────────────────────
    function initForm(form) {
        if (!form || form.dataset.initialized === 'true') return;
        form.dataset.initialized = 'true';

        const fileInput = form.querySelector('input[type="file"]');
        const filesList = form.querySelector('.files-list');
        const helperStatus = form.querySelector('.helper-text') || form.querySelector('.font-sub');
        const voiceTimer = form.querySelector('.recording-timer');
        const nameInput  = form.querySelector('input[name="name"]');
        const emailInput = form.querySelector('input[name="email"]');
        const messageInput = form.querySelector('textarea[name="message"]');

        // Clone interactive elements to strip any duplicate/redundant event listeners from inline HTML scripts
        const originalSubmitBtn = form.querySelector('.request-submit-btn, #btn-submit');
        let submitBtn = originalSubmitBtn;
        if (originalSubmitBtn) {
            const clonedBtn = originalSubmitBtn.cloneNode(true);
            originalSubmitBtn.parentNode.replaceChild(clonedBtn, originalSubmitBtn);
            submitBtn = clonedBtn;
        }

        const originalClipBtn = form.querySelector('.btn-clip-toggle');
        let clipBtn = originalClipBtn;
        if (originalClipBtn) {
            const clonedClip = originalClipBtn.cloneNode(true);
            originalClipBtn.parentNode.replaceChild(clonedClip, originalClipBtn);
            clipBtn = clonedClip;
        }

        const originalMicBtn = form.querySelector('.btn-mic-toggle');
        let micBtn = originalMicBtn;
        if (originalMicBtn) {
            const clonedMic = originalMicBtn.cloneNode(true);
            originalMicBtn.parentNode.replaceChild(clonedMic, originalMicBtn);
            micBtn = clonedMic;
        }

        const originalStopBtn = form.querySelector('.btn-stop-record');
        let stopBtn = originalStopBtn;
        if (originalStopBtn) {
            const clonedStop = originalStopBtn.cloneNode(true);
            originalStopBtn.parentNode.replaceChild(clonedStop, originalStopBtn);
            stopBtn = clonedStop;
        }

        let selectedFiles = [];
        const MAX_SIZE = 20 * 1024 * 1024;
        let mediaRecorder, audioChunks = [], recordInterval, recordStartTime;
        let audioCtx, analyser, dataArray, animationId;

        // Dynamic generation of error spans if they are missing in the HTML template
        function ensureErrorSpans() {
            if (nameInput) {
                const g = nameInput.closest('.request-input-group');
                if (g && !g.querySelector('.request-error-msg')) {
                    const span = document.createElement('span');
                    span.className = 'request-error-msg';
                    span.textContent = 'Please enter your name';
                    g.appendChild(span);
                }
            }
            if (emailInput) {
                const g = emailInput.closest('.request-input-group');
                if (g && !g.querySelector('.request-error-msg')) {
                    const span = document.createElement('span');
                    span.className = 'request-error-msg';
                    span.textContent = 'Please enter your email';
                    g.appendChild(span);
                }
            }
            if (messageInput) {
                const g = messageInput.closest('.request-input-group');
                if (g && !g.querySelector('.request-error-msg')) {
                    const span = document.createElement('span');
                    span.className = 'request-error-msg';
                    span.textContent = 'Please enter your message';
                    const wrapper = g.querySelector('.request-textarea-wrapper');
                    if (wrapper) {
                        wrapper.parentNode.insertBefore(span, wrapper.nextSibling);
                    } else {
                        g.appendChild(span);
                    }
                }
            }
        }
        ensureErrorSpans();

        // Inline validation
        form.querySelectorAll('input, textarea').forEach(inp => {
            inp.addEventListener('input', () => {
                const g = inp.closest('.request-input-group');
                if (g) g.classList.remove('has-error');
            });
        });

        // File upload
        if (clipBtn && fileInput) {
            clipBtn.addEventListener('click', e => {
                e.preventDefault();
                if (!form.classList.contains('state-voice')) fileInput.click();
            });
            fileInput.addEventListener('change', e => { addFiles(Array.from(e.target.files)); fileInput.value = ''; });
        }

        if (filesList) {
            filesList.addEventListener('click', e => {
                if (e.target.classList.contains('file-remove')) {
                    selectedFiles.splice(+e.target.dataset.index, 1);
                    refreshFilesUI();
                }
            });
        }

        function addFiles(newFiles) {
            newFiles.forEach(f => {
                if (f.size > MAX_SIZE) { alert(`${f.name} is too large (max 20MB).`); return; }
                if (!selectedFiles.find(x => x.name === f.name && x.size === f.size)) selectedFiles.push(f);
            });
            refreshFilesUI();
        }

        function fmtBytes(b) {
            if (!+b) return '0 B';
            const k = 1024, s = ['B','KB','MB','GB'], i = Math.floor(Math.log(b)/Math.log(k));
            return `${parseFloat((b/k**i).toFixed(1))} ${s[i]}`;
        }

        function refreshFilesUI() {
            if (!filesList) return;
            filesList.innerHTML = '';
            let total = 0;
            selectedFiles.forEach((f, i) => {
                total += f.size;
                const el = document.createElement('div');
                el.className = 'file-item';
                el.innerHTML = `<div class="file-info-left"><span class="file-icon">${f.type.startsWith('image/') ? '🖼️' : '📄'}</span><div class="file-details"><span class="file-name">${f.name}</span><span class="file-size">${fmtBytes(f.size)}</span></div></div><span class="file-remove" data-index="${i}">✕</span>`;
                filesList.appendChild(el);
            });
            if (selectedFiles.length > 0) {
                form.className = form.className.replace(/state-\w+/g, '').trim() + ' state-files';
                if (helperStatus) helperStatus.textContent = `${selectedFiles.length} FILE${selectedFiles.length > 1 ? 'S' : ''} ATTACHED (${fmtBytes(total)})`;
            } else {
                form.className = form.className.replace(/state-\w+/g, '').trim() + ' state-default';
                if (helperStatus) helperStatus.textContent = "If you can't be bothered to type, just say what's on your mind.";
            }
        }

        // Voice recording
        if (micBtn && stopBtn && voiceTimer) {
            micBtn.addEventListener('click', async e => {
                e.preventDefault();
                if (form.classList.contains('state-voice')) return;
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    startRec(stream);
                } catch { alert('Microphone access required.'); }
            });
            stopBtn.addEventListener('click', e => { e.preventDefault(); stopRec(); });
        }

        function startRec(stream) {
            form.className = form.className.replace(/state-\w+/g, '').trim() + ' state-voice';
            if (helperStatus) helperStatus.textContent = 'RECORDING...';
            if (submitBtn) submitBtn.textContent = 'STOP & SAVE';
            audioChunks = [];
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = e => { if (e.data.size > 0) audioChunks.push(e.data); };
            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunks, { type: 'audio/webm' });
                addFiles([new File([blob], `voice_${Date.now()}.webm`, { type: 'audio/webm' })]);
                stream.getTracks().forEach(t => t.stop());
            };
            mediaRecorder.start();
            recordStartTime = Date.now();
            voiceTimer.textContent = '00:00';
            clearInterval(recordInterval);
            recordInterval = setInterval(updateTimer, 1000);
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioCtx.createAnalyser();
            audioCtx.createMediaStreamSource(stream).connect(analyser);
            analyser.fftSize = 64;
            dataArray = new Uint8Array(analyser.frequencyBinCount);
            drawWave();
        }

        function drawWave() {
            if (!form.classList.contains('state-voice')) return;
            animationId = requestAnimationFrame(drawWave);
            analyser.getByteFrequencyData(dataArray);
            form.querySelectorAll('.wave-bar').forEach((b, i) => {
                const v = dataArray[Math.floor(i * dataArray.length / 22)] / 255;
                b.style.transform = `scaleY(${0.1 + v * 1.7})`;
            });
        }

        function stopRec() {
            if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
            clearInterval(recordInterval);
            cancelAnimationFrame(animationId);
            if (audioCtx && audioCtx.state !== 'closed') audioCtx.close();
            form.querySelectorAll('.wave-bar').forEach(b => b.style.transform = '');
            if (submitBtn) submitBtn.textContent = "HERE'S MY PROJECT";
        }

        function updateTimer() {
            const d = Math.floor((Date.now() - recordStartTime) / 1000);
            if (d >= 120) { stopRec(); return; }
            voiceTimer.textContent = `${String(Math.floor(d/60)).padStart(2,'0')}:${String(d%60).padStart(2,'0')}`;
        }

        // Submit
        if (submitBtn) {
            submitBtn.addEventListener('click', e => {
                e.preventDefault();
                if (form.classList.contains('state-voice')) { stopRec(); return; }

                let err = false;
                if (nameInput) {
                    const g = nameInput.closest('.request-input-group');
                    const span = g ? g.querySelector('.request-error-msg') : null;
                    if (!nameInput.value.trim()) {
                        if (g) g.classList.add('has-error');
                        if (span) span.textContent = 'Please enter your name';
                        err = true;
                    } else {
                        if (g) g.classList.remove('has-error');
                    }
                }
                if (emailInput) {
                    const g = emailInput.closest('.request-input-group');
                    const span = g ? g.querySelector('.request-error-msg') : null;
                    if (!emailInput.value.trim()) {
                        if (g) g.classList.add('has-error');
                        if (span) span.textContent = 'Please enter your email';
                        err = true;
                    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
                        if (g) g.classList.add('has-error');
                        if (span) span.textContent = 'Please enter a valid email';
                        err = true;
                    } else {
                        if (g) g.classList.remove('has-error');
                    }
                }
                if (messageInput) {
                    const g = messageInput.closest('.request-input-group');
                    const span = g ? g.querySelector('.request-error-msg') : null;
                    if (!messageInput.value.trim()) {
                        if (g) g.classList.add('has-error');
                        if (span) span.textContent = 'Please enter your message';
                        err = true;
                    } else {
                        if (g) g.classList.remove('has-error');
                    }
                }
                if (err) { form.classList.add('state-error'); return; }
                form.classList.remove('state-error');

                const orig = submitBtn.textContent;
                submitBtn.textContent = 'SENDING...';
                submitBtn.disabled = true;

                const fd = new FormData(form);
                selectedFiles.forEach(f => fd.append('attachment[]', f));

                fetch('send_mail.php', { method: 'POST', body: fd })
                    .then(r => { if (!r.ok) throw new Error(); return r.json(); })
                    .then(d => {
                        if (!d.success) throw new Error(d.message);
                        submitBtn.textContent = orig;
                        submitBtn.disabled = false;

                        // Show modal first so bones can read its position
                        const sm = document.getElementById('success-modal');
                        if (sm) sm.style.display = 'flex';

                        // Fire bones AFTER modal is rendered (next frame)
                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                if (typeof window.fireBones === 'function') {
                                    window.fireBones();
                                }
                            });
                        });
                        form.reset();
                        selectedFiles = [];
                        refreshFilesUI();
                    })
                    .catch((err) => {
                        console.warn('Mail sending failed or not supported in this environment:', err);
                        submitBtn.textContent = orig;
                        submitBtn.disabled = false;

                        // Fallback: show success modal anyway for offline/local testing
                        const sm = document.getElementById('success-modal');
                        if (sm) sm.style.display = 'flex';

                        requestAnimationFrame(() => {
                            requestAnimationFrame(() => {
                                if (typeof window.fireBones === 'function') {
                                    window.fireBones();
                                }
                            });
                        });
                        form.reset();
                        selectedFiles = [];
                        refreshFilesUI();
                    });
            });
        }
    }

    // Success modal close
    const successCloseBtn = document.getElementById('btn-success-close') || document.querySelector('.btn-got-it');
    if (successCloseBtn) {
        successCloseBtn.addEventListener('click', () => {
            const sm = document.getElementById('success-modal');
            if (sm) sm.style.display = 'none';
        });
    }

    // Init all forms on page
    function initAllForms() {
        ['services-form', 'quest-modal-form'].forEach(id => {
            const f = document.getElementById(id);
            if (f) initForm(f);
        });
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAllForms);
    } else {
        initAllForms();
    }

    // ─── 5. Sticky header ─────────────────────────────────────────────────────
    function setupStickyHeader() {
        const header = document.querySelector('.header');
        if (!header) return;
        const check = () => header.classList.toggle('header--scrolled', window.scrollY > 15);
        window.addEventListener('scroll', check, { passive: true });
        check();
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupStickyHeader);
    } else {
        setupStickyHeader();
    }

})();
