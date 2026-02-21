import { GoogleGenerativeAI } from "@google/generative-ai";

// PASTE YOUR KEY FROM GOOGLE AI STUDIO HERE
const API_KEY = "AIzaSyC5ckIRio6KrR1UGFvFUEoPsto_s2a4X28"; 
const genAI = new GoogleGenerativeAI(API_KEY);

window.processAI = async function(mode) {
    const input = document.getElementById('userInput').value;
    const outputBox = document.getElementById('resultBox');
    const outputText = document.getElementById('outputText');
    const loader = document.getElementById('loader');

    if (!input.trim()) {
        alert("Please paste some text first!");
        return;
    }

    loader.classList.remove('hidden');
    outputBox.classList.add('hidden');

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        let prompt = "";
        if (mode === 'summarize') {
            prompt = `Summarize the following text in its original language (English or Hindi). Use short bullet points: ${input}`;
        } else {
            prompt = `Explain this text like I am an 8th-grade student. Use very simple words. Keep the output in the original language (English or Hindi): ${input}`;
        }

        const result = await model.generateContent(prompt);
        const response = await result.response;
        
        outputText.innerText = response.text();
        outputBox.classList.remove('hidden');
    } catch (error) {
        console.error(error);
        alert("Make sure your API key is correct!");
    } finally {
        loader.classList.add('hidden');
    }
}