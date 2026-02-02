// Questions array
const questions = [
    "Name",
    "Age",
    "Email",
    "10th percentage",
    "12th percentage",
    "BBA CGPA",
    "Intended Masters course"
];

// Valid names (case-insensitive)
const validNames = ["rushitha", "rushi", "vempati", "rush", "rushitha vempati", "vempati rushitha"];

let currentQuestionIndex = 0;
let answers = {};

// DOM elements
const contentCard = document.getElementById('content-card');
const progressBar = document.getElementById('progress-bar');
const startBtn = document.getElementById('start-btn');
const validationModal = document.getElementById('validation-modal');
const proposalModal = document.getElementById('proposal-modal');
const congratsText = document.getElementById('congrats-text');
const messageContainer = document.getElementById('message-container');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');
const closeModalBtn = document.getElementById('close-modal-btn');

// Initialize the app
function init() {
    startBtn.addEventListener('click', startQuiz);
    closeModalBtn.addEventListener('click', closeValidationModal);
    yesBtn.addEventListener('click', handleYes);
    noBtn.addEventListener('mouseenter', moveNoButton);
}

// Start the quiz
function startQuiz() {
    gsap.to(startBtn, { duration: 0.3, opacity: 0, onComplete: () => {
        startBtn.style.display = 'none';
        showQuestion();
    }});
}

// Show current question
function showQuestion() {
    const question = questions[currentQuestionIndex];
    contentCard.innerHTML = `
        <h1>${question}</h1>
        <input type="text" id="answer-input" placeholder="Enter your ${question.toLowerCase()}">
        <button id="submit-btn" class="btn">Submit</button>
    `;

    const submitBtn = document.getElementById('submit-btn');
    const answerInput = document.getElementById('answer-input');

    submitBtn.addEventListener('click', () => submitAnswer(answerInput.value.trim()));
    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submitAnswer(answerInput.value.trim());
    });

    gsap.from(contentCard, { duration: 0.5, y: 20, opacity: 0 });
}

// Submit answer
function submitAnswer(answer) {
    if (!answer) return; // Don't proceed if empty

    answers[questions[currentQuestionIndex]] = answer;

    // Special validation for name
    if (currentQuestionIndex === 0) {
        if (!validNames.includes(answer.toLowerCase())) {
            showValidationModal();
            return;
        }
    }

    // Celebration animation
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
    });

    // Update progress bar
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    gsap.to(progressBar, { duration: 0.5, width: `${progress}%` });

    // Show encouragement text
    contentCard.innerHTML = '<p class="celebration">Almost there… just a few more steps 💕</p>';
    gsap.from(contentCard.querySelector('p'), { duration: 0.5, scale: 0.8, opacity: 0 });

    setTimeout(() => {
        currentQuestionIndex++;
        if (currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showFinalModal();
        }
    }, 2000);
}

// Show validation modal
function showValidationModal() {
    validationModal.style.display = 'flex';
    gsap.from(validationModal, { duration: 0.3, scale: 0.8, opacity: 0 });
}

// Close validation modal
function closeValidationModal() {
    gsap.to(validationModal, { duration: 0.3, scale: 0.8, opacity: 0, onComplete: () => {
        validationModal.style.display = 'none';
        // Reset to initial state
        currentQuestionIndex = 0;
        answers = {};
        progressBar.style.width = '0%';
        contentCard.innerHTML = `
            <h1>Welcome to Masters Consultancy</h1>
            <p>Let's find the perfect Masters program for you. Start by answering a few questions.</p>
            <button id="start-btn" class="btn">Get Started</button>
        `;
        document.getElementById('start-btn').addEventListener('click', startQuiz);
    }});
}

// Show final proposal modal
function showFinalModal() {
    proposalModal.style.display = 'flex';
    gsap.from(proposalModal, { duration: 0.5, scale: 0.8, opacity: 0 });

    // Full screen confetti
    confetti({
        particleCount: 200,
        spread: 160,
        origin: { y: 0.5 }
    });

    // Reveal message after a delay
    setTimeout(() => {
        congratsText.style.display = 'none';
        messageContainer.classList.remove('hidden');
        gsap.from(messageContainer, { duration: 1, y: 20, opacity: 0 });
    }, 3000);
}

// Handle YES button click
function handleYes() {
    // Intense celebration
    confetti({
        particleCount: 300,
        spread: 180,
        origin: { y: 0.5 }
    });

    gsap.to(proposalModal.querySelector('.modal-content'), { duration: 0.5, scale: 1.1, yoyo: true, repeat: 1 });

    setTimeout(() => {
        proposalModal.innerHTML = `
            <div class="modal-content">
                <p>Thank you for accepting the offer to be Heeru's Valentine 💕🎉</p>
            </div>
        `;

        // Send email
        const subject = encodeURIComponent("Valentine Accepted 💖");
        const body = encodeURIComponent("Thank you for accepting the offer to be Heeru's Valentine!");
        window.location.href = `mailto:?subject=${subject}&body=${body}`;
    }, 2000);
}

// Move NO button on hover
function moveNoButton() {
    const yesRect = yesBtn.getBoundingClientRect();
    const modalRect = proposalModal.getBoundingClientRect();
    let newX, newY;

    do {
        newX = Math.random() * (modalRect.width - noBtn.offsetWidth);
        newY = Math.random() * (modalRect.height - noBtn.offsetHeight);
    } while (Math.abs(newX - yesRect.left) < 100 && Math.abs(newY - yesRect.top) < 50); // Ensure no overlap

    gsap.to(noBtn, { duration: 0.3, x: newX, y: newY, ease: "power2.out" });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
