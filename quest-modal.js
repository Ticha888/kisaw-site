(function() {
    // 1. Safety Checks: Only run on pages that have "Send the Signal" buttons or forms
    const triggerBtns = document.querySelectorAll('.send-signal-btn, .send-signal-btn-mobile');
    
    // 2. Inject Modal Markup if not present
    let questModal = document.getElementById('quest-modal');
    let questForm = document.getElementById('quest-modal-form');
    
    if (!questModal) {
        const modalContainer = document.createElement('div');
        modalContainer.innerHTML = `
        <!-- Quest Modal -->
        <div id="quest-modal" class="quest-modal-overlay">
            <div class="quest-modal-card">
                <!-- Close Button -->
                <button type="button" class="quest-modal-close" id="btn-close-quest-modal" aria-label="Close modal">
                    <img src="img/closewindow.svg" alt="Close">
                </button>

                <div class="quest-modal-header">
                    <h2 class="quest-modal-title">DROP YOUR QUEST HERE</h2>
                    <p class="quest-modal-description">
                        <span class="text-accent-green">Tell us about your project.</span> We’ll review what you have, listen to your ideas, and propose a clear direction for how the project should look, sound, and communicate.
                    </p>
                </div>

                <form id="quest-modal-form" class="request-form variant-refined state-default" action="#" method="post" enctype="multipart/form-data">
                    <div class="request-form-fields">
                        <div class="request-input-group">
                            <input id="quest-name" name="name" type="text" placeholder="NAME" required>
                            <span class="request-error-msg">Please enter your name</span>
                        </div>
                        <div class="request-input-group">
                            <input id="quest-email" name="email" type="email" placeholder="EMAIL" required>
                            <span class="request-error-msg">Please enter a valid email</span>
                        </div>
                        <div class="request-input-group request-media-group">
                            <div class="request-textarea-wrapper">
                                <textarea id="quest-message" name="message" placeholder="TELL US ABOUT YOUR PROJECT AND TASK" rows="3"></textarea>
                            </div>

                            <!-- Attached Files List -->
                            <div class="request-files-section">
                                <div class="files-label">ATTACHED FILES</div>
                                <div class="files-list"></div>
                            </div>

                            <!-- Voice Recording Panel -->
                            <div class="request-voice-recording-panel">
                                <div class="voice-recording-header">
                                    <div class="recording-indicator">
                                        <span class="recording-dot"></span>
                                        <span class="recording-label">RECORDING</span>
                                    </div>
                                    <span class="recording-timer">00:00</span>
                                </div>

                                <div class="voice-waveform">
                                    <div class="wave-bar h1"></div>
                                    <div class="wave-bar h4"></div>
                                    <div class="wave-bar h2"></div>
                                    <div class="wave-bar h5"></div>
                                    <div class="wave-bar h3"></div>
                                    <div class="wave-bar h4"></div>
                                    <div class="wave-bar h1"></div>
                                    <div class="wave-bar h5"></div>
                                    <div class="wave-bar h2"></div>
                                    <div class="wave-bar h3"></div>
                                    <div class="wave-bar h4"></div>
                                    <div class="wave-bar h1"></div>
                                    <div class="wave-bar h5"></div>
                                    <div class="wave-bar h2"></div>
                                    <div class="wave-bar h3"></div>
                                    <div class="wave-bar h4"></div>
                                    <div class="wave-bar h1"></div>
                                    <div class="wave-bar h5"></div>
                                    <div class="wave-bar h2"></div>
                                    <div class="wave-bar h3"></div>
                                    <div class="wave-bar h1 opac"></div>
                                    <div class="wave-bar h2 opac"></div>
                                </div>

                                <div class="voice-controls">
                                    <button type="button" class="btn-stop-record"><span class="stop-icon"></span></button>
                                </div>
                            </div>

                            <div class="request-helper-row">
                                <div class="helper-text font-sub" id="quest-helper-status">IF YOU CAN’T BE BOTHERED TO TYPE, JUST SAY WHAT’S ON YOUR MIND.</div>
                                <div class="helper-icons">
                                    <button type="button" class="icon-btn btn-mic-toggle">
                                        <img src="img/Mic.svg" alt="Mic" width="28" height="28">
                                    </button>
                                    <input type="file" id="quest-file-upload" name="attachment" accept="image/*,.txt,.pdf,.doc,.docx" multiple style="display: none;">
                                    <button type="button" class="icon-btn btn-clip-toggle">
                                        <img src="img/Paperclip.svg" alt="Paperclip" width="28" height="28">
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button type="button" class="request-submit-btn" id="quest-btn-submit">HERE'S MY PROJECT</button>
                </form>
            </div>
        </div>
        `;
        document.body.appendChild(modalContainer.firstElementChild);
        questModal = document.getElementById('quest-modal');
        questForm = document.getElementById('quest-modal-form');
    }

    // Inject Success Modal if not exists
    let successModal = document.getElementById('success-modal');
    if (!successModal) {
        const successContainer = document.createElement('div');
        successContainer.innerHTML = `
        <div class="success-modal-overlay" id="success-modal" style="display:none;">
            <div class="success-modal-card">
                <div class="success-image-wrap">
                    <img src="img/catalien.png" alt="Signal Sent" class="success-mascot">
                </div>
                <div class="success-text-content">
                    <h3 class="success-title">SIGNAL SENT!</h3>
                    <p class="success-desc">WE'VE RECEIVED YOUR MESSAGE AND WILL GET BACK TO YOU SHORTLY.</p>
                </div>
                <button class="btn-got-it" id="btn-success-close">GOT YA!</button>
            </div>
        </div>
        `;
        document.body.appendChild(successContainer.firstElementChild);
        successModal = document.getElementById('success-modal');
    }

    const btnSuccessClose = document.getElementById('btn-success-close');
    if (btnSuccessClose) {
        btnSuccessClose.addEventListener('click', () => {
            successModal.style.display = 'none';
        });
    }

    // 3. Dynamic Script Loader for Canvas-Confetti
    function loadConfetti(cb) {
        if (window.confetti) {
            cb();
            return;
        }
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js';
        script.onload = cb;
        document.head.appendChild(script);
    }

    // 4. Modal Open/Close Controls
    const closeBtn = document.getElementById('btn-close-quest-modal');

    triggerBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (questModal) {
                questModal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    function closeQuestModal() {
        if (questModal) {
            questModal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Stop recording if active
            const allForms = [questForm, document.getElementById('services-form'), document.getElementById('request-form')];
            allForms.forEach(f => {
                if (f && f.classList.contains('state-voice')) {
                    const stopBtn = f.querySelector('.btn-stop-record');
                    if (stopBtn) stopBtn.click();
                }
            });
        }
    }

    if (closeBtn) closeBtn.addEventListener('click', closeQuestModal);
    
    if (questModal) {
        questModal.addEventListener('click', (e) => {
            if (e.target === questModal) closeQuestModal();
        });
    }
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeQuestModal();
    });

    // 5. Universal Form Setup Logic
    function initUniversalForm(form) {
        if (!form) return;
        // Avoid double initialization
        if (form.dataset.initialized === "true") return;
        form.dataset.initialized = "true";

        const fileInput = form.querySelector('input[type="file"]');
        const clipBtn = form.querySelector('.btn-clip-toggle');
        const micBtn = form.querySelector('.btn-mic-toggle');
        const filesListContainer = form.querySelector('.files-list');
        
        let helperStatus = form.querySelector('.helper-text');
        if (!helperStatus && form.id === 'quest-modal-form') helperStatus = document.getElementById('quest-helper-status');
        if (!helperStatus && form.id === 'services-form') helperStatus = document.getElementById('helper-status');

        const submitBtn = form.id === 'quest-modal-form' ? document.getElementById('quest-btn-submit') : form.querySelector('.request-submit-btn, #btn-submit');
        const stopRecordBtn = form.querySelector('.btn-stop-record');
        const voiceTimer = form.querySelector('.recording-timer');

        let selectedFiles = form.selectedFiles = [];
        const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

        let mediaRecorder;
        let audioChunks = [];
        let recordInterval;
        let recordStartTime;
        let audioContext;
        let analyser;
        let dataArray;
        let animationId;

        // Name/Email dynamic spans
        const nameInput = form.querySelector('input[name="name"]');
        const emailInput = form.querySelector('input[name="email"]');

        if (nameInput) {
            const nameGroup = nameInput.closest('.request-input-group');
            if (nameGroup && !nameGroup.querySelector('.request-error-msg')) {
                const errSpan = document.createElement('span');
                errSpan.className = 'request-error-msg';
                errSpan.textContent = 'Please enter your name';
                nameGroup.appendChild(errSpan);
            }
        }
        if (emailInput) {
            const emailGroup = emailInput.closest('.request-input-group');
            if (emailGroup && !emailGroup.querySelector('.request-error-msg')) {
                const errSpan = document.createElement('span');
                errSpan.className = 'request-error-msg';
                errSpan.textContent = 'Please enter a valid email';
                emailGroup.appendChild(errSpan);
            }
        }

        // Clear validation errors on typing
        form.querySelectorAll('input').forEach(input => {
            input.addEventListener('input', () => {
                const parent = input.closest('.request-input-group');
                if (parent) parent.classList.remove('has-error');
            });
        });

        // --- FILE UPLOAD LOGIC ---
        if (clipBtn && fileInput) {
            clipBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (form.classList.contains('state-voice')) return;
                fileInput.click();
            });

            fileInput.addEventListener('change', (e) => {
                addFiles(Array.from(e.target.files));
                fileInput.value = '';
            });
        }

        function addFiles(newFiles) {
            const validFiles = [];
            newFiles.forEach(f => {
                if (f.size > MAX_FILE_SIZE) {
                    alert(`File ${f.name} is too large. Max size is 20MB.`);
                } else {
                    if (!selectedFiles.find(extF => extF.name === f.name && extF.size === f.size)) {
                        validFiles.push(f);
                    }
                }
            });
            selectedFiles.push(...validFiles);
            updateFilesUI();
        }

        if (filesListContainer) {
            filesListContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('file-remove')) {
                    const idx = parseInt(e.target.getAttribute('data-index'));
                    selectedFiles.splice(idx, 1);
                    updateFilesUI();
                }
            });
        }

        function formatBytes(bytes, decimals = 1) {
            if (!+bytes) return '0 Bytes';
            const k = 1024;
            const dm = decimals < 0 ? 0 : decimals;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
        }

        function updateFilesUI() {
            if (!filesListContainer) return;
            filesListContainer.innerHTML = '';
            let totalBytes = 0;

            selectedFiles.forEach((file, index) => {
                totalBytes += file.size;
                const item = document.createElement('div');
                item.className = 'file-item';
                const isImage = file.type.startsWith('image/');
                const icon = isImage ? '🖼️' : '📄';

                item.innerHTML = `
                    <div class="file-info-left">
                        <span class="file-icon">${icon}</span>
                        <div class="file-details">
                            <span class="file-name">${file.name}</span>
                            <span class="file-size">${formatBytes(file.size)}</span>
                        </div>
                    </div>
                    <span class="file-remove" data-index="${index}">✕</span>
                `;
                filesListContainer.appendChild(item);
            });

            if (selectedFiles.length > 0) {
                form.classList.remove('state-default', 'state-error', 'state-voice');
                form.classList.add('state-files');
                const fileCountStr = selectedFiles.length === 1 ? '1 FILE' : `${selectedFiles.length} FILES`;
                if (helperStatus) {
                    helperStatus.textContent = `${fileCountStr} ATTACHED (${formatBytes(totalBytes)} TOTAL)`;
                }
            } else {
                form.classList.remove('state-files', 'state-voice');
                form.classList.add('state-default');
                if (helperStatus) {
                    helperStatus.textContent = 'IF YOU CAN’T BE BOTHERED TO TYPE, JUST SAY WHAT’S ON YOUR MIND.';
                }
            }
        }

        // --- VOICE RECORDING LOGIC ---
        if (micBtn && stopRecordBtn && voiceTimer) {
            micBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                if (form.classList.contains('state-voice')) return;
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                    startRecording(stream);
                } catch (err) {
                    console.error("Error accessing mic:", err);
                    alert("Microphone access is required to record a voice message.");
                }
            });

            stopRecordBtn.addEventListener('click', (e) => {
                e.preventDefault();
                stopRecording();
            });
        }

        function startRecording(stream) {
            form.classList.remove('state-default', 'state-error', 'state-files');
            form.classList.add('state-voice');
            if (helperStatus) helperStatus.textContent = 'RECORDING YOUR VOICE MESSAGE...';
            if (submitBtn) submitBtn.textContent = 'STOP & SAVE RECORDING';

            audioChunks = [];
            mediaRecorder = new MediaRecorder(stream);
            mediaRecorder.ondataavailable = e => {
                if (e.data.size > 0) audioChunks.push(e.data);
            };
            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                const fileName = `voice_message_${new Date().toISOString().replace(/[:.]/g, '-')}.webm`;
                addFiles([new File([audioBlob], fileName, { type: 'audio/webm', lastModified: Date.now() })]);
                stream.getTracks().forEach(t => t.stop());
            };
            mediaRecorder.start();

            recordStartTime = Date.now();
            voiceTimer.textContent = '00:00';
            clearInterval(recordInterval);
            recordInterval = setInterval(updateTimer, 1000);

            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            analyser = audioContext.createAnalyser();
            audioContext.createMediaStreamSource(stream).connect(analyser);
            analyser.fftSize = 64;
            dataArray = new Uint8Array(analyser.frequencyBinCount);
            drawWaveform();
        }

        function drawWaveform() {
            if (!form.classList.contains('state-voice')) return;
            animationId = requestAnimationFrame(drawWaveform);
            analyser.getByteFrequencyData(dataArray);
            form.querySelectorAll('.wave-bar').forEach((bar, i) => {
                const val = dataArray[Math.floor(i * (dataArray.length / 22))] / 255;
                bar.style.transform = `scaleY(${0.1 + val * 1.7})`;
            });
        }

        function stopRecording() {
            if (mediaRecorder && mediaRecorder.state !== 'inactive') mediaRecorder.stop();
            clearInterval(recordInterval);
            cancelAnimationFrame(animationId);
            if (audioContext && audioContext.state !== 'closed') audioContext.close();
            form.querySelectorAll('.wave-bar').forEach(b => b.style.transform = '');
            if (submitBtn) submitBtn.textContent = "HERE'S MY PROJECT";
        }

        function updateTimer() {
            const diff = Math.floor((Date.now() - recordStartTime) / 1000);
            if (diff >= 120) { stopRecording(); return; }
            voiceTimer.textContent = `${String(Math.floor(diff / 60)).padStart(2, '0')}:${String(diff % 60).padStart(2, '0')}`;
        }

        // --- SUBMIT LOGIC ---
        if (submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();

                if (form.classList.contains('state-voice')) {
                    stopRecording();
                    return;
                }

                let hasError = false;

                if (nameInput) {
                    const parent = nameInput.closest('.request-input-group');
                    if (!nameInput.value.trim()) {
                        if (parent) parent.classList.add('has-error');
                        hasError = true;
                    }
                }

                if (emailInput) {
                    const parent = emailInput.closest('.request-input-group');
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailInput.value.trim() || !emailRegex.test(emailInput.value)) {
                        if (parent) parent.classList.add('has-error');
                        hasError = true;
                    }
                }

                if (hasError) {
                    form.classList.add('state-error');
                    return;
                }

                form.classList.remove('state-error');
                const originalBtnText = submitBtn.textContent;
                submitBtn.textContent = 'SENDING...';
                submitBtn.disabled = true;

                const formData = new FormData(form);
                formData.append('_subject', 'New Signal from Kisaw Studio!');

                selectedFiles.forEach((file) => {
                    formData.append('attachment[]', file);
                });

                fetch('send_mail.php', {
                    method: 'POST',
                    body: formData
                })
                .then(response => {
                    if (!response.ok) throw new Error('Response error');
                    return response.json();
                })
                .then(data => {
                    if (data.success !== true) throw new Error(data.message || 'Server error');
                    
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;

                    if (form.id === 'quest-modal-form') closeQuestModal();

                    loadConfetti(() => {
                        const rect = submitBtn.getBoundingClientRect();
                        const x = (rect.left + rect.width / 2) / window.innerWidth;
                        const y = (rect.top + rect.height / 2) / window.innerHeight;

                        const bonePath = 'M24.4835 5.49995C25.0877 4.89575 25.4271 4.07627 25.4271 3.2218C25.4271 2.36732 25.0877 1.54785 24.4835 0.943643C23.8793 0.339439 23.0598 0 22.2053 0C21.3508 0 20.5314 0.339439 19.9272 0.943643C19.3275 1.54967 18.9912 2.36828 18.9943 3.2218L6.43279 3.22189C6.43453 2.79951 6.35305 2.38091 6.19299 1.99002C6.03293 1.59913 5.79744 1.2436 5.49995 0.943741C4.89575 0.339537 4.07627 9.84241e-05 3.2218 9.84241e-05C2.36732 9.84241e-05 1.54785 0.339537 0.943642 0.943741C0.339438 1.54795 1.89119e-07 2.36742 1.89119e-07 3.2219C1.89119e-07 4.07637 0.339439 4.89585 0.943643 5.50005C0.339439 6.10425 0 6.92373 0 7.7782C0 8.63268 0.339439 9.45215 0.943643 10.0564C1.54785 10.6606 2.36732 11 3.2218 11C4.07627 11 4.89575 10.6606 5.49995 10.0564C5.79744 9.7565 6.03293 9.40097 6.19299 9.01008C6.35305 8.61919 6.43279 8.20059 6.43279 7.7782L18.9943 7.77811C18.9912 8.63162 19.3275 9.45023 19.9272 10.0563C20.5314 10.6605 21.3508 10.9999 22.2053 10.9999C23.0598 10.9999 23.8793 10.6605 24.4835 10.0563C25.0877 9.45206 25.4271 8.63258 25.4271 7.77811C25.4271 6.92363 25.0877 6.10415 24.4835 5.49995Z';
                        const boneShape = confetti.shapeFromPath({ path: bonePath });

                        confetti({
                            particleCount: 80,
                            spread: 80,
                            origin: { x, y },
                            shapes: [boneShape],
                            colors: ['#47E194', '#FBFBFB', '#1E1E1E', '#A6D3FF', '#FFDAEF', '#DD3737'],
                            zIndex: 9999,
                            scalar: 2.2
                        });
                    });

                    if (successModal) successModal.style.display = 'flex';
                    form.reset();
                    selectedFiles.length = 0;
                    updateFilesUI();
                })
                .catch(error => {
                    console.error("Submission failed:", error);
                    alert("Could not send signal. Please check your internet connection and try again.");
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                });
            });
        }
    }

    // Initialize all forms immediately or post-DOM
    function setupAllForms() {
        const questModalForm = document.getElementById('quest-modal-form');
        const servicesForm = document.getElementById('services-form');
        const requestForm = document.getElementById('request-form');

        if (questModalForm) initUniversalForm(questModalForm);
        if (servicesForm) initUniversalForm(servicesForm);
        if (requestForm) initUniversalForm(requestForm);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupAllForms);
    } else {
        setupAllForms();
    }

    // --- STICKY HEADER SCROLL OBSERVER ---
    function setupStickyHeader() {
        const header = document.querySelector('.header');
        if (!header) return;

        function checkScroll() {
            if (window.scrollY > 15) {
                header.classList.add('header--scrolled');
            } else {
                header.classList.remove('header--scrolled');
            }
        }

        window.addEventListener('scroll', checkScroll, { passive: true });
        // Run immediately in case the page is loaded scrolled
        checkScroll();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupStickyHeader);
    } else {
        setupStickyHeader();
    }
})();
