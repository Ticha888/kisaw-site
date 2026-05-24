/**
 * bones-confetti.js
 * 100 colored bones explode from BEHIND (z-index: 5) the success modal circle.
 * Once they escape the circle's radius, they transition to the FOREGROUND (z-index: 20).
 * They collide and bounce off the window bounds (left, right, bottom) and the circular popup itself!
 * Finally, they accumulate and lie at the bottom of the window.
 */
(function () {

    const BONE_SRCS = [
        'img/bones/bone white.svg',
        'img/bones/bone black.svg',
        'img/bones/bone blue.svg',
        'img/bones/bone green.svg',
        'img/bones/bone pink.svg',
        'img/bones/bone red.svg',
    ];

    const BONE_COUNT = 100;
    const BASE_SIZE  = 75; // px base

    // Physics Constants
    const GRAVITY        = 950;  // px/s^2
    const BOUNCE_REST    = 0.45; // bouncing off walls/floor
    const POPUP_BOUNCE   = 0.65; // bouncing off popup circle
    const FRICTION       = 0.99; // air resistance
    const FLOOR_FRICTION = 0.75; // rolling friction on floor

    let activeBones = [];
    let animationFrameId = null;
    let lastTime = null;

    function rand(min, max) {
        return min + Math.random() * (max - min);
    }

    function cleanupExistingBones() {
        activeBones.forEach(bone => {
            if (bone.el && bone.el.parentNode) {
                bone.el.remove();
            }
        });
        activeBones = [];
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }
        lastTime = null;
    }

    function fireBones() {
        cleanupExistingBones();

        const modal = document.getElementById('success-modal');
        if (!modal) return;

        // Perfect robust center calculation immune to rendering delays
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const pr = 230; // 460px / 2 = 230px radius of the circular popup card

        // Listen for modal close to clean up bones
        const closeBtn = document.getElementById('btn-success-close') || modal.querySelector('.btn-got-it');
        if (closeBtn) {
            closeBtn.addEventListener('click', cleanupExistingBones, { once: true });
        }
        modal.addEventListener('click', (e) => {
            if (e.target === modal) cleanupExistingBones();
        });

        // Spawn bones
        for (let i = 0; i < BONE_COUNT; i++) {
            const size = rand(BASE_SIZE * 0.75, BASE_SIZE * 1.35); // 56px to 100px
            const radius = size / 2;

            const el = document.createElement('img');
            el.src = BONE_SRCS[i % BONE_SRCS.length];
            el.draggable = false;
            
            // Set initial transform exactly to the center, hidden (scale 0)
            el.style.cssText = `
                position: absolute;
                left: 0px;
                top: 0px;
                width: ${size}px;
                height: ${size}px;
                z-index: 5;
                pointer-events: none;
                user-select: none;
                will-change: transform;
                transform-origin: center center;
                transform: translate(${cx - radius}px, ${cy - radius}px) scale(0);
            `;
            modal.appendChild(el);

            // Explosive direction (all 360 degrees)
            const baseAngle = (i / BONE_COUNT) * Math.PI * 2;
            const angle = baseAngle + rand(-0.1, 0.1);
            const speed = rand(350, 1150);

            activeBones.push({
                el: el,
                size: size,
                radius: radius,
                x: cx, // Start exactly in the center of the card
                y: cy,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                rot: rand(0, 360),
                vRot: rand(-500, 500),
                inForeground: false,
                isResting: false,
                delay: rand(0, 90) // stagger launch slightly (ms)
            });
        }

        lastTime = performance.now();
        animationFrameId = requestAnimationFrame(updatePhysics);
    }

    function updatePhysics(now) {
        if (!lastTime) {
            lastTime = now;
            animationFrameId = requestAnimationFrame(updatePhysics);
            return;
        }

        let dt = (now - lastTime) / 1000;
        lastTime = now;

        // Cap dt to prevent massive jumps on lag spikes
        if (dt > 0.05) dt = 0.05;

        const modal = document.getElementById('success-modal');
        if (!modal || modal.style.display === 'none') {
            cleanupExistingBones();
            return;
        }

        // Center remains perfectly consistent
        const cx = window.innerWidth / 2;
        const cy = window.innerHeight / 2;
        const pr = 230;

        const winW = window.innerWidth;
        const winH = window.innerHeight;

        activeBones.forEach((b, idx) => {
            if (b.delay > 0) {
                b.delay -= dt * 1000;
                // Keep it exactly at the center scaled to 0 while waiting
                b.el.style.transform = `translate(${b.x - b.radius}px, ${b.y - b.radius}px) scale(0)`;
                return;
            }

            if (b.isResting) {
                // Keep resting flat on the floor
                b.el.style.transform = `translate(${b.x - b.radius}px, ${b.y - b.radius}px) rotate(${b.rot}deg) scale(1)`;
                return;
            }

            // 1. Gravity & Friction
            b.vy += GRAVITY * dt;
            b.vx *= Math.pow(FRICTION, dt);
            b.vy *= Math.pow(FRICTION, dt);

            // 2. Update Position
            b.x += b.vx * dt;
            b.y += b.vy * dt;
            b.rot += b.vRot * dt;

            // 3. Check Foreground transition
            const dx = b.x - cx;
            const dy = b.y - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (!b.inForeground && dist > pr) {
                b.inForeground = true;
                b.el.style.zIndex = '20'; // Move to foreground (above popup card)
            }

            // 4. Collision with Popup Card (Only when in foreground!)
            if (b.inForeground) {
                const minDist = pr + b.radius;
                if (dist < minDist) {
                    // Normal vector pointing outwards from popup center
                    const nx = dx / dist;
                    const ny = dy / dist;

                    // Push bone out
                    b.x = cx + nx * minDist;
                    b.y = cy + ny * minDist;

                    // Reflect velocity
                    const dot = b.vx * nx + b.vy * ny;
                    if (dot < 0) {
                        b.vx = b.vx - (1 + POPUP_BOUNCE) * dot * nx;
                        b.vy = b.vy - (1 + POPUP_BOUNCE) * dot * ny;
                        // Add some spin on bounce
                        b.vRot += nx * 200 - ny * 200;
                    }
                }
            }

            // 5. Collision with Window Boundaries
            // Bottom (Floor)
            if (b.y + b.radius > winH) {
                b.y = winH - b.radius;
                b.vy = -b.vy * BOUNCE_REST;
                b.vx *= FLOOR_FRICTION;
                b.vRot *= FLOOR_FRICTION;

                // Rest conditions
                if (Math.abs(b.vy) < 40 && Math.abs(b.vx) < 20) {
                    b.vy = 0;
                    b.vx = 0;
                    b.vRot = 0;
                    b.isResting = true;
                }
            }
            // Left Wall
            if (b.x - b.radius < 0) {
                b.x = b.radius;
                b.vx = -b.vx * BOUNCE_REST;
                b.vRot *= 0.9;
            }
            // Right Wall
            if (b.x + b.radius > winW) {
                b.x = winW - b.radius;
                b.vx = -b.vx * BOUNCE_REST;
                b.vRot *= 0.9;
            }

            // Apply rendering transform
            b.el.style.transform = `translate(${b.x - b.radius}px, ${b.y - b.radius}px) rotate(${b.rot}deg) scale(1)`;
        });

        animationFrameId = requestAnimationFrame(updatePhysics);
    }

    window.fireBones = fireBones;

})();

/* ==========================================================================
   GLOBAL MOBILE FLOATING BURGER (Injects directly into body to avoid CSS transform bugs)
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Вытаскиваем окно меню в корень body, чтобы оно не ломалось из-за CSS transform на контейнерах
    const navOverlay = document.querySelector('.nav-overlay');
    if (navOverlay && navOverlay.parentNode !== document.body) {
        document.body.appendChild(navOverlay);
    }

    // Only create it if it doesn't already exist
    if (!document.querySelector('.mobile-nav-toggle-floating')) {
        const floatingBurger = document.createElement('button');
        floatingBurger.className = 'mobile-nav-toggle-floating';
        floatingBurger.setAttribute('aria-label', 'Toggle Navigation');
        floatingBurger.innerHTML = '<img src="img/burgermenu.png" alt="Menu" class="burger-icon">';
        document.body.appendChild(floatingBurger);

        floatingBurger.addEventListener('click', () => {
            const overlay = document.querySelector('.nav-overlay');
            if (overlay) {
                overlay.classList.add('active');
                document.body.classList.add('menu-open');
            }
        });
    }

    // Global scroll listener for mobile
    window.addEventListener('scroll', () => {
        if (window.innerWidth <= 800) {
            if (window.scrollY > 200) document.body.classList.add('is-scrolled');
            else document.body.classList.remove('is-scrolled');
        } else {
            document.body.classList.remove('is-scrolled');
        }
    });
});
