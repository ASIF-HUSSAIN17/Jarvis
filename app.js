const btn = document.querySelector(".talk");
const content = document.querySelector(".content");

function speak(text) {
  const text_speak = new SpeechSynthesisUtterance(text);
  text_speak.rate = 1;
  text_speak.volume = 1;
  text_speak.pitch = 1;
  window.speechSynthesis.speak(text_speak);
}

function wishMe() {
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 12) {
    speak("Good Morning Boss...");
  } else if (hour >= 12 && hour < 17) {
    speak("Good Afternoon Master...");
  } else {
    speak("Good Evening Sir...");
  }
}

window.addEventListener("load", () => {
  speak("Initializing JARVIS...");
  wishMe();
});

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.onresult = (event) => {
  const currentIndex = event.resultIndex;
  const transcript = event.results[currentIndex][0].transcript;
  content.textContent = transcript;
  takeCommand(transcript.toLowerCase());
};

btn.addEventListener("click", () => {
  content.textContent = "Listening....";
  recognition.start();
});

// Wikipedia API
async function fetchFromWikipedia(query) {
  const searchTerm = query
    .replace("what is", "")
    .replace("who is", "")
    .replace("what are", "")
    .replace("define", "")
    .trim();

  const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
    searchTerm
  )}`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.extract) {
      return data.extract;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

// DuckDuckGo API
async function fetchFromDuckDuckGo(query) {
  const apiUrl = `https://api.duckduckgo.com/?q=${encodeURIComponent(
    query
  )}&format=json&no_html=1`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    if (data.AbstractText && data.AbstractText.length > 0) {
      return data.AbstractText;
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
}

// Command Handler
async function takeCommand(message) {
  if (message.includes("who made you") || message.includes("who created you")) {
    speak("Asif made me.");
  } else if (
    message.includes("who are you") ||
    message.includes("what is your name")
  ) {
    speak("I am JARVIS, your voice assistant.");
  } else if (message.includes("hey") || message.includes("hello")) {
    speak("Hello Sir, How May I Help You?");
  } else if (message.includes("open google")) {
    window.open("https://google.com", "_blank");
    speak("Opening Google...");
  } else if (message.includes("open youtube")) {
    window.open("https://youtube.com", "_blank");
    speak("Opening YouTube...");
  } else if (message.includes("open facebook")) {
    window.open("https://facebook.com", "_blank");
    speak("Opening Facebook...");
  } else if (
    message.includes("what is") ||
    message.includes("who is") ||
    message.includes("what are") ||
    message.includes("define")
  ) {
    speak("Let me check Wikipedia for that...");
    let answer = await fetchFromWikipedia(message);

    if (!answer) {
      speak("Couldn't find it on Wikipedia. Checking DuckDuckGo...");
      answer = await fetchFromDuckDuckGo(message);
    }

    if (!answer) {
      speak("I couldn't find a direct answer. Let me search Google for you.");
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(message)}`,
        "_blank"
      );
    } else {
      speak(answer);
    }
  } else if (message.includes("wikipedia")) {
    const topic = message.replace("wikipedia", "").trim();
    window.open(
      `https://en.wikipedia.org/wiki/${encodeURIComponent(topic)}`,
      "_blank"
    );
    speak("This is what I found on Wikipedia.");
  } else if (message.includes("time")) {
    const time = new Date().toLocaleString(undefined, {
      hour: "numeric",
      minute: "numeric",
    });
    speak(`The time is ${time}`);
  } else if (message.includes("date")) {
    const date = new Date().toLocaleString(undefined, {
      month: "short",
      day: "numeric",
    });
    speak(`Today is ${date}`);
  } else if (message.includes("calculator")) {
    window.open("Calculator:///");
    speak("Opening Calculator");
  } else {
    // Fallback for other questions
    speak("Let me check Wikipedia for that...");
    let answer = await fetchFromWikipedia(message);

    if (!answer) {
      speak("Couldn't find it on Wikipedia. Checking DuckDuckGo...");
      answer = await fetchFromDuckDuckGo(message);
    }

    if (!answer) {
      speak("I couldn't find a direct answer. Let me search Google for you.");
      window.open(
        `https://www.google.com/search?q=${encodeURIComponent(message)}`,
        "_blank"
      );
    } else {
      speak(answer);
    }
  }
}
