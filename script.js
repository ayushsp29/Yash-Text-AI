window.processAI = async function(mode) {
    const userInput = document.getElementById('userInput').value;
    const outputBox = document.getElementById('resultBox');
    const outputText = document.getElementById('outputText');
    const loader = document.getElementById('loader');

    // 1. PASTE YOUR GROQ API KEY HERE
    const GROQ_API_KEY = "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";

    if (!userInput.trim()) return alert("Please paste some text first!");

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
                // Using Llama 3 for best English & Hindi support
                model: "llama-3.3-70b-versatile",
                messages: [{
                    role: "user",
                    content: mode === 'summarize' 
                        ? `Summarize this text in bullet points (English/Hindi): ${userInput}` 
                        : `Explain this like I am an 8th grader (English/Hindi): ${userInput}`
                }]
            })
        });

        const data = await response.json();
        
        if (data.choices && data.choices[0]) {
            outputText.innerText = data.choices[0].message.content;
            outputBox.classList.remove('hidden');
        } else {
            throw new Error("Invalid response from AI");
        }

    } catch (error) {
        console.error("Error:", error);
        alert("AI Error: " + error.message);
    } finally {
        loader.classList.add('hidden');
    }
}
