document.addEventListener('DOMContentLoaded', () => {

    const SUPABASE_URL = 'https://vekkziumelqjndunkpxj.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZla2t6aXVtZWxxam5kdW5rcHhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2MTE3MzgsImV4cCI6MjA1NTE4NzczOH0.XWPYixmR7C_TOLh0Ai7HFmGU07Sa2ryZxeEqrd4zwGg';
    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    const modal = document.getElementById('registration-modal');
    const registerBtns = document.querySelectorAll('.register-btn, .register-now-btn');
    const closeModal = document.querySelector('.close-modal');
    const registrationForm = document.getElementById('registration-form');
    const collegeInput = document.getElementById('college');
    const sectionField = document.querySelector('.section-field');
    const sectionInput = document.getElementById('section');
    const referralInput = document.getElementById('referral');
    const registrationClosedMessage = document.querySelector('.registration-closed-message');

    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get('referral');
    if (referralCode) {
        referralInput.value = referralCode;
    }

    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show');
    });

    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show');
        });
    });

    registerBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden';
        });
    });

    closeModal.addEventListener('click', () => {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    collegeInput.addEventListener('input', () => {
        const collegeName = collegeInput.value.toLowerCase();
        if (collegeName.includes('amity')) {
            sectionField.style.display = 'block';
            sectionInput.setAttribute('required', 'required');
        } else {
            sectionField.style.display = 'none';
            sectionInput.removeAttribute('required');
            sectionInput.value = '';
        }
    });

    registrationForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(registrationForm);
        const data = {
            name: formData.get('name'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            college: formData.get('college'),
            year: formData.get('year'),
            course: formData.get('course'),
            section: formData.get('section') || '',
            referral: formData.get('referral') || ''
        };

        try {
            const { error } = await supabaseClient
                .from('bootcamp1_registration')
                .insert([data]);

            if (error) {
                showToast('Registration failed. Please try again.', 'error');
            } else {
                showToast('Registration successful! Welcome to MindCraft AI!', 'success');
                registrationForm.reset();
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        } catch (error) {
            showToast('Registration failed. Please try again.', 'error');
        }
    });

    function showToast(message, type) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            if (targetId !== '#' && document.querySelector(targetId)) {
                window.scrollTo({
                    top: document.querySelector(targetId).offsetTop - 70,
                    behavior: 'smooth'
                });
            }
        });
    });

    if (registrationClosedMessage) {
        registrationClosedMessage.style.display = 'none';
    }

    registrationForm.querySelector('.submit-btn').disabled = false;
    registrationForm.querySelectorAll('input, select').forEach(input => {
        input.disabled = false;
    });

    const creatorLink = document.getElementById('creator-link');
    if (creatorLink) {
        const states = [
            { html: 'Created by Manan Bhansali <i class="fas fa-heart heart-beat"></i>', href: 'https://mananworks.pages.dev', target: '_blank' },
            { html: 'Code on GitHub <i class="fab fa-github"></i>', href: 'https://github.com/seenmttai/MindCraft', target: '_blank' },
            { html: 'Follow me on LinkedIn <i class="fab fa-linkedin"></i>', href: 'https://www.linkedin.com/in/manan-bhansali/', target: '_blank' }
        ];

        const displayDuration = 4000; 
        const fadeDuration = 500; 
        let currentStateIndex = 0;

        function switchContent() {
            creatorLink.classList.add('fading-out');

            setTimeout(() => {
                currentStateIndex = (currentStateIndex + 1) % states.length;
                const nextState = states[currentStateIndex];

                creatorLink.innerHTML = nextState.html;
                creatorLink.href = nextState.href;
                creatorLink.target = nextState.target;

                creatorLink.classList.remove('fading-out');

                setTimeout(switchContent, displayDuration);

            }, fadeDuration);
        }

        setTimeout(switchContent, displayDuration);
    }
});