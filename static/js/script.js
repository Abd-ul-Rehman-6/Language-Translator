// Get elements
const textInput = document.getElementById("textInput");
const speakBtn = document.getElementById("speakBtn");
const stopBtn = document.getElementById("stopBtn");
const clearBtn = document.getElementById("clearBtn");
const voiceSelect = document.getElementById("voiceSelect");
const langSelect = document.getElementById("langSelect"); // 🎯 NEW
const rateSelect = document.getElementById("rateSelect");
const pitchSelect = document.getElementById("pitchSelect");
const rateValue = document.getElementById("rateValue");
const pitchValue = document.getElementById("pitchValue");
const statusBox = document.getElementById("status");
const historyItems = document.querySelectorAll(".history li");

let synth = window.speechSynthesis;
let voices = [];
let utterance;

// Load voices
function loadVoices() {
    voices = synth.getVoices();
    populateVoiceList();
}

// Populate voice dropdown (filtered by selected language)
function populateVoiceList() {
    voiceSelect.innerHTML = "";
    let selectedLang = langSelect.value; // current selected language

    let filteredVoices = voices.filter(v => v.lang.toLowerCase().startsWith(selectedLang));
    
    // Agar koi voice available na ho to sabhi show karo (fallback)
    let listToShow = filteredVoices.length > 0 ? filteredVoices : voices;

    listToShow.forEach((voice, i) => {
        let option = document.createElement("option");
        option.value = voice.name;
        option.textContent = `${voice.name} (${voice.lang})`;
        voiceSelect.appendChild(option);
    });
}

// Update voice list when language changes
langSelect.addEventListener("change", populateVoiceList);

if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = loadVoices;
}
loadVoices();

// Speak function
function speak(text = null) {
    if (synth.speaking) {
        synth.cancel(); // Stop current speech before starting new
    }

    let message = text || textInput.value.trim();
    if (message === "") {
        alert("Please type some text first!");
        return;
    }

    utterance = new SpeechSynthesisUtterance(message);

    // Set voice based on language
    let selectedVoice = voices.find(v => v.name === voiceSelect.value);
    if (!selectedVoice) {
        // Agar exact match na mile to language based match karo
        selectedVoice = voices.find(v => v.lang.toLowerCase().startsWith(langSelect.value));
    }
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    }

    // Set rate and pitch
    utterance.rate = parseFloat(rateSelect.value);
    utterance.pitch = parseFloat(pitchSelect.value);

    // Status update
    utterance.onstart = () => statusBox.textContent = "🔊 Speaking...";
    utterance.onend = () => statusBox.textContent = "✅ Done!";
    utterance.onerror = () => statusBox.textContent = "⚠️ Error!";

    synth.speak(utterance);
}

// Stop function
function stop() {
    if (synth.speaking) {
        synth.cancel();
        statusBox.textContent = "⏹️ Stopped.";
    }
}

// Clear function
function clearText() {
    textInput.value = "";
    statusBox.textContent = "📝 Cleared. Ready to speak...";
}

// Event Listeners
speakBtn.addEventListener("click", () => speak());
stopBtn.addEventListener("click", stop);
clearBtn.addEventListener("click", clearText);

rateSelect.addEventListener("input", () => {
    rateValue.textContent = rateSelect.value;
});
pitchSelect.addEventListener("input", () => {
    pitchValue.textContent = pitchSelect.value;
});

// 🎯 New Feature: Click on history item to replay
historyItems.forEach(item => {
    item.style.cursor = "pointer";  // cursor pointer
    item.title = "Click to replay this text"; 

    item.addEventListener("click", () => {
        let text = item.innerText.split("(")[0].trim(); // only the message, ignore date
        speak(text);
    });
});
