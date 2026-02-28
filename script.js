// --- CONFIGURATION ---
const GROQ_API_KEY = "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";

// --- CORE AI FUNCTION ---
window.processAI = async function(mode) {
    const input = document.getElementById('userInput').value;
    const outputBox = document.getElementById('resultBox');
    const engOut = document.getElementById('engOutput');
    const hinOut = document.getElementById('hinOutput');
    const loader = document.getElementById('loader');

    if (!input.trim()) return alert("Please enter some text!");

    loader.classList.remove('hidden');
    outputBox.classList.add('hidden');

    try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [{
                    role: "user",
                    content: `Act as a tutor for an 8th-grade student. ${mode === 'summarize' ? 'Summarize' : 'Simplify'} the text below. 
                    Format your response EXACTLY like this:
                    English: [Your English response here]
                    Hindi: [Your Hindi translation here]
                    
                    Text: ${input}`
                }]
            })
        });

        const data = await response.json();
        const fullContent = data.choices[0].message.content;

        // Clean splitting logic
        const [engPart, hinPart] = fullContent.split('Hindi:');
        engOut.innerText = engPart.replace('English:', '').trim();
        hinOut.innerText = hinPart ? hinPart.trim() : "Translation unavailable.";

        outputBox.classList.remove('hidden');
    } catch (error) {
        alert("Oops! Make sure your Groq Key is correct.");
        console.error(error);
    } finally {
        loader.classList.add('hidden');
    }
};

// --- VOICE RECOGNITION ---
window.startVoice = function() {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-IN'; // Optimized for Indian English/Hindi
    
    document.getElementById('micBtn').innerText = "Listening... 👂";
    recognition.start();

    recognition.onresult = (event) => {
        document.getElementById('userInput').value = event.results[0][0].transcript;
        document.getElementById('micBtn').innerText = "🎤 Speak";
    };

    recognition.onerror = () => {
        document.getElementById('micBtn').innerText = "🎤 Speak";
        alert("Voice failed. Ensure you are using HTTPS (GitHub Pages) and allowed mic access!");
    };
};

// --- TEXT TO SPEECH ---
window.readAloud = function() {
    const text = document.getElementById('engOutput').innerText;
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = 'en-US';
    window.speechSynthesis.speak(speech);
};

// --- DOWNLOAD FEATURE ---
window.downloadNote = function() {
    const engText = document.getElementById('engOutput').innerText;
    const hinText = document.getElementById('hinOutput').innerText;
    const combined = `ENGLISH SUMMARY:\n${engText}\n\nHINDI SUMMARY:\n${hinText}`;
    
    const blob = new Blob([combined], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'AI_Tutor_Notes.txt';
    link.click();
};

