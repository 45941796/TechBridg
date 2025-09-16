document.addEventListener('DOMContentLoaded', () => {
    // Lazy-load Chart.js and AOS
    const loadScript = (src, callback) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = callback;
        document.body.appendChild(script);
    };

    loadScript('https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js?v=1.0', () => {
        AOS.init({ duration: 1000, once: true });
    });

    // Particle background
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2 + 1,
                vx: Math.random() * 2 - 1,
                vy: Math.random() * 2 - 1
            });
        }
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(13, 148, 136, 0.5)';
                ctx.fill();
            });
            requestAnimationFrame(animateParticles);
        }
        animateParticles();
    }

    // CTA Popup
    const popup = document.getElementById('cta-popup');
    if (popup) {
        setTimeout(() => popup.style.display = 'block', 2000);
    }
    window.closePopup = () => {
        if (popup) popup.style.display = 'none';
    };

    // Feedback Form
    const feedbackForm = document.getElementById('feedback-form');
    if (feedbackForm) {
        feedbackForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const rating = document.getElementById('rating').value;
            localStorage.setItem('rating', rating);
            alert(`Thank you for your ${rating}-star feedback!`);
            feedbackForm.parentElement.style.display = 'none';
        });
        setTimeout(() => document.getElementById('feedback-popup').style.display = 'block', 5000);
    }

    // Modal Handling
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalClose = document.querySelector('.modal-close');
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('learn-more')) {
            const parent = e.target.closest('[data-modal-title]');
            modalTitle.textContent = parent ? parent.dataset.modalTitle : 'Details';
            modalDescription.textContent = parent ? parent.dataset.modalDescription : 'More information coming soon!';
            modal.style.display = 'block';
            modal.setAttribute('aria-hidden', 'false');
            modal.focus();
        }
    });
    if (modalClose) {
        modalClose.addEventListener('click', () => {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'block') {
            modal.style.display = 'none';
            modal.setAttribute('aria-hidden', 'true');
        }
    });

    // Skill Quiz
    const quizForm = document.getElementById('skill-quiz');
    if (quizForm) {
        quizForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const interest = document.getElementById('interest').value;
            const level = document.getElementById('level').value;
            const result = document.getElementById('quiz-result');
            const recommendations = {
                coding: { beginner: 'Python Coding', intermediate: 'Advanced Python' },
                data: { beginner: 'Data Annotation', intermediate: 'AI Specialist' },
                agri: { beginner: 'Agri-Tech Apps', intermediate: 'Advanced Agri-Tech' },
                marketing: { beginner: 'Digital Marketing', intermediate: 'SEO Specialist' }
            };
            result.innerHTML = `We recommend our <strong>${recommendations[interest][level]}</strong> course for you! <a href="training.html#signup">Enroll Now</a>`;
        });
    }

    // Job Counter
    const jobCount = document.getElementById('job-count');
    const jobProgress = document.getElementById('job-progress');
    if (jobCount && jobProgress) {
        let count = 0;
        const target = 200;
        const interval = setInterval(() => {
            if (count >= target) {
                clearInterval(interval);
                jobCount.textContent = '200+';
            } else {
                count += 5;
                jobCount.textContent = count;
                jobProgress.style.width = `${(count / target) * 100}%`;
                jobProgress.setAttribute('aria-valuenow', (count / target) * 100);
            }
        }, 50);
    }

    // Story Slider
    const stories = document.querySelectorAll('.story');
    const dots = document.querySelectorAll('.dot');
    const sliderControl = document.querySelector('.slider-control');
    let currentStory = 0;
    let isPaused = false;
    if (stories.length) {
        function showStory(index) {
            stories.forEach((s, i) => {
                s.classList.toggle('active', i === index);
                dots[i].classList.toggle('active', i === index);
            });
            currentStory = index;
        }
        window.goToStory = (index) => {
            showStory(index);
            isPaused = true;
            sliderControl.textContent = 'Play';
        };
        if (sliderControl) {
            sliderControl.addEventListener('click', () => {
                isPaused = !isPaused;
                sliderControl.textContent = isPaused ? 'Play' : 'Pause';
            });
        }
        setInterval(() => {
            if (!isPaused) {
                currentStory = (currentStory + 1) % stories.length;
                showStory(currentStory);
            }
        }, 5000);
    }

    // FAQ Toggle and Search
    window.toggleFAQ = (element) => {
        const parent = element.parentElement;
        parent.classList.toggle('active');
        parent.querySelector('p').style.display = parent.classList.contains('active') ? 'block' : 'none';
        element.setAttribute('aria-expanded', parent.classList.contains('active'));
    };
    const faqSearch = document.getElementById('faq-search');
    if (faqSearch) {
        faqSearch.addEventListener('input', debounce(() => {
            const term = faqSearch.value.toLowerCase();
            document.querySelectorAll('.faq-item').forEach(item => {
                const text = item.textContent.toLowerCase();
                item.style.display = term ? text.includes(term) ? 'block' : 'none' : 'block';
            });
        }, 300));
    }

    // Debounce function
    function debounce(func, wait) {
        let timeout;
        return () => {
            clearTimeout(timeout);
            timeout = setTimeout(func, wait);
        };
    }

    // Share Buttons
    document.querySelectorAll('.share-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.dataset.text;
            alert(`Mock sharing to X: ${text}`);
        });
    });

    // Add to Calendar
    document.querySelectorAll('.add-to-calendar').forEach(btn => {
        btn.addEventListener('click', () => {
            const event = btn.dataset.event;
            alert(`Mock adding "${event}" to your calendar!`);
        });
    });

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
        });
        if (localStorage.getItem('darkMode') === 'true') {
            document.body.classList.add('dark-mode');
        }
    }

    // Language Toggle (Mock)
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            const isKiswahili = langToggle.textContent === 'Kiswahili';
            langToggle.textContent = isKiswahili ? 'English' : 'Kiswahili';
            document.querySelectorAll('.btn').forEach(btn => {
                if (btn.textContent.includes('Join') || btn.textContent.includes('Enroll') || btn.textContent.includes('Apply')) {
                    btn.textContent = isKiswahili ? btn.textContent.replace('Join', 'Jiunge').replace('Enroll', 'Jiunge').replace('Apply', 'Omba') : btn.textContent.replace('Jiunge', 'Join').replace('Omba', 'Apply');
                }
            });
            alert(`Mock switching to ${isKiswahili ? 'Kiswahili' : 'English'}`);
        });
    }

    // Progress Tracker
    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        setTimeout(() => {
            progressBar.style.width = '70%';
            progressBar.setAttribute('aria-valuenow', 70);
        }, 1000);
        document.getElementById('download-progress')?.addEventListener('click', () => {
            const doc = new window.jspdf.jsPDF();
            doc.text('TechBridge EA Progress Report', 10, 10);
            doc.text('User: John Doe', 10, 20);
            doc.text('Course: Python Coding', 10, 30);
            doc.text('Progress: 70% Complete', 10, 40);
            doc.text('Date: September 17, 2025', 10, 50);
            doc.save('TechBridgeEA_Progress.pdf');
        });
    }

    // Analytics Chart
    if (document.getElementById('impact-chart')) {
        loadScript('https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js?v=1.0', () => {
            new Chart(document.getElementById('impact-chart'), {
                type: 'bar',
                data: {
                    labels: ['Youth Trained', 'Jobs Created', 'Women Empowered', 'Course Completion'],
                    datasets: [{
                        label: 'Impact Metrics',
                        data: [500, 200, 50, 75],
                        backgroundColor: ['#0D9488', '#22D3EE', '#14B8A6', '#2DD4BF'],
                        borderColor: ['#0B8276', '#0EA5E9', '#0D9488', '#22D3EE'],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: { y: { beginAtZero: true, title: { display: true, text: 'Count/Percentage' } } },
                    plugins: { legend: { display: false } }
                }
            });
        });
    }

    // Course Progress Chart
    if (document.getElementById('course-progress-chart')) {
        loadScript('https://cdn.jsdelivr.net/npm/chart.js@4.4.2/dist/chart.umd.min.js?v=1.0', () => {
            new Chart(document.getElementById('course-progress-chart'), {
                type: 'doughnut',
                data: {
                    labels: ['Python Coding', 'Data Annotation', 'Remaining'],
                    datasets: [{
                        data: [70, 50, 30],
                        backgroundColor: ['#0D9488', '#22D3EE', '#D1D5DB'],
                        borderColor: ['#0B8276', '#0EA5E9', '#9CA3AF'],
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { position: 'bottom' }, title: { display: true, text: 'Course Progress' } }
                }
            });
        });
    }

    // Chatbot
    const chatbot = document.getElementById('chatbot');
    const messages = document.getElementById('chatbot-messages');
    if (chatbot && messages) {
        let step = 0;
        const responses = [
            { text: 'Welcome to TechBridge EA! How can I help?', buttons: ['Courses', 'Jobs', 'Contact', 'Quiz'] },
            { text: 'Our courses include Python, Data Annotation, Agri-Tech, and Digital Marketing. Want details?', buttons: ['Yes', 'Back'] },
            { text: 'We offer jobs like Data Annotator, Junior Coder, and AI Specialist. Interested?', buttons: ['Yes', 'Back'] },
            { text: 'Contact us at info@techbridgeea.org or +254714392009. Need more?', buttons: ['Yes', 'Back'] },
            { text: 'Take our skill quiz to find your perfect course!', buttons: ['Go to Quiz', 'Back'] }
        ];
        chatbot.addEventListener('click', () => {
            messages.style.display = messages.style.display === 'block' ? 'none' : 'block';
            if (messages.style.display === 'block' && !messages.innerHTML) {
                updateChatbot(0);
            }
        });
        function updateChatbot(stepIndex) {
            step = stepIndex;
            messages.innerHTML = `<p>${responses[step].text}</p>`;
            responses[step].buttons.forEach(btn => {
                const button = document.createElement('button');
                button.textContent = btn;
                button.classList.add('btn');
                button.addEventListener('click', () => handleChatbotResponse(btn));
                messages.appendChild(button);
            });
        }
        function handleChatbotResponse(response) {
            if (response === 'Back') {
                updateChatbot(0);
            } else if (response === 'Courses' || response === 'Yes' && step === 1) {
                updateChatbot(1);
            } else if (response === 'Jobs' || response === 'Yes' && step === 2) {
                updateChatbot(2);
            } else if (response === 'Contact' || response === 'Yes' && step === 3) {
                updateChatbot(3);
            } else if (response === 'Quiz' || response === 'Go to Quiz') {
                updateChatbot(4);
            }
        }
    }

    // Form Submissions (Mock)
    document.querySelectorAll('form:not(#skill-quiz):not(#feedback-form)').forEach(form => {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Form submitted successfully!');
        });
    });

    // Global Search (Mock)
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search...';
    searchInput.classList.add('search-bar');
    document.querySelector('nav').appendChild(searchInput);
    searchInput.addEventListener('input', debounce(() => {
        const term = searchInput.value.toLowerCase();
        alert(`Mock search results for "${term}"`);
    }, 300));
});