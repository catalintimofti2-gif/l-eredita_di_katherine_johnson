
        // Gestione Pagine SPA
        function showPage(pageId) {
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById(pageId).classList.add('active');
            document.querySelectorAll('.nav-link').forEach(l => {
                l.classList.remove('active');
                if(l.getAttribute('data-page') === pageId) l.classList.add('active');
            });
        }

        // SFONDO STELLATO DINAMICO
        const starCanvas = document.getElementById('starfield');
        const starCtx = starCanvas.getContext('2d');
        let stars = [];
        
        function initStars() {
            starCanvas.width = window.innerWidth;
            starCanvas.height = window.innerHeight;
            stars = [];
            for (let i = 0; i < 400; i++) {
                stars.push({
                    x: Math.random() * starCanvas.width,
                    y: Math.random() * starCanvas.height,
                    size: Math.random() * 1.5,
                    speed: Math.random() * 0.5 + 0.1,
                    opacity: Math.random(),
                    twinkleSpeed: Math.random() * 0.02 + 0.005
                });
            }
        }

        function drawStars() {
            starCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
            stars.forEach(star => {
                star.opacity += star.twinkleSpeed;
                if (star.opacity > 1 || star.opacity < 0.2) star.twinkleSpeed *= -1;
                starCtx.globalAlpha = Math.abs(star.opacity);
                starCtx.fillStyle = 'white';
                starCtx.beginPath();
                starCtx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
                starCtx.fill();
                star.y -= star.speed;
                if (star.y < 0) {
                    star.y = starCanvas.height;
                    star.x = Math.random() * starCanvas.width;
                }
            });
            requestAnimationFrame(drawStars);
        }

        window.addEventListener('resize', initStars);
        initStars();
        drawStars();

        // GALASSIA A SPIRALE 3D (Three.js) - INGRANDITA
        let scene, camera, renderer, galaxyParticles;

        function initGalaxy() {
            const container = document.getElementById('galaxy-container');
            const width = container.clientWidth;
            const height = container.clientHeight;

            scene = new THREE.Scene();
            // Allargato FOV per vedere la galassia più grande
            camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
            camera.position.z = 5;
            camera.position.y = 2;
            camera.rotation.x = -0.5;

            renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
            renderer.setSize(width, height);
            container.appendChild(renderer.domElement);

            const particleCount = 18000; // Leggermente più particelle per densità
            const positions = new Float32Array(particleCount * 3);
            const colors = new Float32Array(particleCount * 3);

            const parameters = {
                radius: 8, // Aumentato raggio galassia da 5 a 8
                branches: 3,
                spin: 1.2,
                randomness: 0.25,
                randomnessPower: 3,
                insideColor: '#ff6030',
                outsideColor: '#1b3984'
            };

            const colorInside = new THREE.Color(parameters.insideColor);
            const colorOutside = new THREE.Color(parameters.outsideColor);

            for (let i = 0; i < particleCount; i++) {
                const i3 = i * 3;
                const r = Math.random() * parameters.radius;
                const spinAngle = r * parameters.spin;
                const branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

                const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * r;
                const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * r;
                const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * parameters.randomness * r;

                positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * r + randomX;
                positions[i3 + 1] = randomY * 0.5;
                positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * r + randomZ;

                const mixedColor = colorInside.clone();
                mixedColor.lerp(colorOutside, r / parameters.radius);
                colors[i3 + 0] = mixedColor.r;
                colors[i3 + 1] = mixedColor.g;
                colors[i3 + 2] = mixedColor.b;
            }

            const geometry = new THREE.BufferGeometry();
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const material = new THREE.PointsMaterial({
                size: 0.02, // Leggermente aumentata dimensione punti
                sizeAttenuation: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                vertexColors: true,
                transparent: true,
                opacity: 0.8
            });

            galaxyParticles = new THREE.Points(geometry, material);
            scene.add(galaxyParticles);

            function animateGalaxy() {
                requestAnimationFrame(animateGalaxy);
                if(galaxyParticles) {
                    galaxyParticles.rotation.y += 0.001; 
                }
                renderer.render(scene, camera);
            }
            animateGalaxy();
        }

        window.onload = initGalaxy;