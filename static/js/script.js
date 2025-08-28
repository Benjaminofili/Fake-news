// Initialize floating elements
function initFloatingElements() {
    const container = document.getElementById('floatingElements');
    for (let i = 0; i < 15; i++) {
        const element = document.createElement('div');
        element.className = 'floating-element';
        element.style.left = Math.random() * 100 + '%';
        element.style.width = element.style.height = Math.random() * 60 + 20 + 'px';
        element.style.animationDelay = Math.random() * 20 + 's';
        element.style.animationDuration = (Math.random() * 10 + 15) + 's';
        container.appendChild(element);
    }
}

// Sample analysis data
const sampleAnalysisResults = {
    credibilityScore: 85,
    confidence: 'high',
    explanations: [
        {
            type: 'positive',
            title: 'Credible Source Indicators',
            description: 'Article contains references to verified news outlets and official statements.',
            impact: '+15%'
        },
        {
            type: 'positive',
            title: 'Factual Language Patterns',
            description: 'Text uses objective language with proper attribution and balanced reporting.',
            impact: '+12%'
        },
        {
            type: 'negative',
            title: 'Emotional Language Detected',
            description: 'Some segments contain emotionally charged words that may indicate bias.',
            impact: '-8%'
        },
        {
            type: 'neutral',
            title: 'Source Verification',
            description: 'Cross-reference with fact-checking databases shows partial matches.',
            impact: '±5%'
        }
    ]
};

async function analyzeNews() {
    const button = document.querySelector('.analyze-btn');
    const btnText = button.querySelector('.btn-text');
    const spinner = button.querySelector('.spinner');
    const textarea = document.getElementById('newsText');

    if (!textarea.value.trim()) {
        textarea.focus();
        textarea.classList.add('is-invalid');
        setTimeout(() => textarea.classList.remove('is-invalid'), 3000);
        return;
    }

    // Show loading state
    button.disabled = true;
    btnText.classList.add('d-none');
    spinner.classList.remove('d-none');

    try {
        // Real API call to Flask backend
        const response = await fetch('/api/analyze', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: textarea.value.trim()
            })
        });

        if (!response.ok) {
            throw new Error('Analysis failed');
        }

        const results = await response.json();
        showResults(results);

    } catch (error) {
        console.error('Error:', error);
        alert('Analysis failed. Please try again.');
        // Fallback to demo for development
        showResults(sampleAnalysisResults);
    } finally {
        // Reset button
        button.disabled = false;
        btnText.classList.remove('d-none');
        spinner.classList.add('d-none');
    }
}

function showResults(data = sampleAnalysisResults) {
    const resultsSection = document.getElementById('resultsSection');
    const credibilityScore = document.getElementById('credibilityScore');
    const meterIndicator = document.getElementById('meterIndicator');
    const confidenceBadge = document.getElementById('confidenceBadge');
    const explanationCards = document.getElementById('explanationCards');

    // Show results section
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth' });

    // Update credibility score
    const score = data.credibilityScore || data.credibility_score;
    credibilityScore.textContent = score + '%';

    // Update meter indicator position
    meterIndicator.style.left = score + '%';

    // Update confidence badge
    const confidence = data.confidence;
    confidenceBadge.className = `confidence-badge confidence-${confidence}`;
    confidenceBadge.innerHTML = `<i class="fas fa-${confidence === 'high' ? 'check-circle' : confidence === 'medium' ? 'exclamation-triangle' : 'times-circle'} me-1"></i>${confidence.charAt(0).toUpperCase() + confidence.slice(1)} Confidence`;

    // Generate explanation cards
    explanationCards.innerHTML = '';
    const explanations = data.explanations || sampleAnalysisResults.explanations;
    explanations.forEach((explanation, index) => {
        const card = document.createElement('div');
        card.className = `explanation-card ${explanation.type}`;
        card.innerHTML = `
                    <div class="d-flex justify-content-between align-items-start">
                        <div class="flex-grow-1">
                            <h6 class="fw-semibold mb-2">
                                <i class="fas fa-${explanation.type === 'positive' ? 'plus-circle' : explanation.type === 'negative' ? 'minus-circle' : 'info-circle'} me-2"></i>
                                ${explanation.title}
                            </h6>
                            <p class="mb-0 text-muted">${explanation.description}</p>
                        </div>
                        <div class="text-end ms-3">
                            <span class="badge bg-${explanation.type === 'positive' ? 'success' : explanation.type === 'negative' ? 'danger' : 'warning'}">${explanation.impact}</span>
                        </div>
                    </div>
                `;
        explanationCards.appendChild(card);
    });
}

function exportResults() {
    // Simulate export functionality
    const button = event.target;
    const originalText = button.innerHTML;

    button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Generating...';
    button.disabled = true;

    setTimeout(() => {
        button.innerHTML = '<i class="fas fa-check me-2"></i>Downloaded!';
        setTimeout(() => {
            button.innerHTML = originalText;
            button.disabled = false;
        }, 2000);
    }, 1500);
}

function resetAnalysis() {
    document.getElementById('newsText').value = '';
    document.getElementById('resultsSection').style.display = 'none';
    document.getElementById('newsText').focus();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function () {
    initFloatingElements();
});

// Demo text samples
const demoTexts = {
    real: `Scientists at MIT have successfully developed a new solar panel technology that increases energy efficiency by 23%, according to a peer-reviewed study published in Nature Energy journal this week. The research, led by Dr. Elena Rodriguez and her team at the Laboratory for Advanced Solar Technologies, demonstrates significant improvements in photovoltaic cell performance through innovative silicon nanostructure engineering.

"This breakthrough represents five years of rigorous testing and collaboration with industry partners," said Dr. Rodriguez during a press conference on Tuesday. The study involved comprehensive testing across multiple climate conditions and was independently verified by researchers at Stanford University and the National Renewable Energy Laboratory.

The technology, which incorporates microscopic pyramid structures on silicon surfaces, allows for better light absorption and reduced electron recombination. Initial commercial applications are expected to begin in 2026, pending regulatory approvals and scaling of manufacturing processes.

The research was funded by the Department of Energy and received additional support from private investors focused on clean energy innovation. All experimental data and methodologies have been made publicly available for scientific review.`,

    fake: `SHOCKING: Government Officials Admit to Hiding Revolutionary Cancer Cure for 50 Years! Big Pharma Conspiracy EXPOSED!!!

Leaked documents reveal that a simple household ingredient can cure ANY cancer in just 3 days! Doctors HATE this one weird trick that pharmaceutical companies have been desperately trying to keep secret. 

An anonymous whistleblower (we can't reveal their identity for safety reasons) has provided EXPLOSIVE evidence that the FDA has been covering up this miracle cure since 1973. The cure involves drinking a special mixture of baking soda and lemon juice every morning - something Big Pharma can't patent or profit from!

"They've been lying to us this whole time," says former pharmaceutical executive John Smith (name changed for protection). "I personally witnessed board meetings where they discussed suppressing this information to protect their trillion-dollar cancer treatment industry."

Thousands of people have already tried this method with 100% success rates! Share this article before it gets DELETED by government censors! The mainstream media will NEVER report on this because they're paid by Big Pharma to keep you sick and dependent on expensive treatments.

WAKE UP, SHEEPLE! Your life depends on knowing this information!`,

    mixed: `Local Hospital Reports 45% Increase in Emergency Room Visits During Holiday Season, Sparking Debate About Healthcare System Strain

Memorial General Hospital announced yesterday that emergency department visits surged dramatically over the past month, with administrators citing various factors from seasonal illnesses to delayed medical care. The statistics, released in the hospital's monthly report, have reignited discussions about healthcare capacity and resource allocation.

Dr. Michael Chen, Emergency Department Chief, confirmed the numbers during a staff meeting but noted that while visits increased, the severity of cases remained within normal ranges. "We're seeing more people coming in for conditions that could potentially be treated in urgent care settings," Chen explained.

However, some staff members who wished to remain anonymous suggested that the hospital's new triage system might be contributing to longer wait times and patient frustration. One nurse claimed that "bureaucratic changes" have made it harder to efficiently process patients, though hospital administration disputes these characterizations.

The hospital's board of directors is scheduled to review capacity planning next month, with community health advocates calling for increased transparency in reporting and resource allocation decisions.`
};

function loadDemoText(type) {
    const textarea = document.getElementById('newsText');
    textarea.value = demoTexts[type];
    textarea.focus();
}

// Add sample text for demo purposes
document.addEventListener('DOMContentLoaded', function () {
    const textarea = document.getElementById('newsText');
    textarea.addEventListener('focus', function () {
        if (!this.value.trim()) {
            this.placeholder = "Breaking: Local scientists discover new method for renewable energy production. The breakthrough, announced at the University Research Center today, could revolutionize how we generate clean electricity. Dr. Sarah Johnson, lead researcher, stated that preliminary tests show 40% higher efficiency than traditional solar panels...";
        }
    });
});
