// js/translator.js
import { requireAuth, logoutUser } from "./auth.js";

const greetingEl = document.getElementById("user-greeting");
const logoutBtn = document.getElementById("logout-btn");
const translateForm = document.getElementById("translate-form");
const ollamaStatus = document.getElementById("ollama-status");
const explanationOutput = document.getElementById("explanation-output");
const hfOcrBtn = document.getElementById("hf-ocr-btn");
const hfStatus = document.getElementById("hf-status");

requireAuth((user) => {
  if (greetingEl) {
    greetingEl.textContent = `Signed in as ${user.email}. Enter a prescription or medical term below.`;
  }
});

if (logoutBtn) {
  logoutBtn.addEventListener("click", logoutUser);
}

function setStatus(el, msg, type = "info") {
  el.textContent = msg;
  el.className = `status-msg ${type}`;
}

if (translateForm) {
  translateForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = document.getElementById("medical-input").value.trim();
    const baseUrl = document.getElementById("ollama-url").value.trim().replace(/\/+$/, "");
    const model = document.getElementById("ollama-model").value.trim() || "llama3.2";

    if (!query) {
      setStatus(ollamaStatus, "Please enter a prescription or medical term first.", "error");
      return;
    }

    setStatus(ollamaStatus, `Querying local Ollama (${model})...`, "info");
    explanationOutput.textContent = "Generating plain-language explanation...";

    const prompt = [
      "You are MedDecode, an educational plain-language medical term and prescription helper.",
      "Explain the following prescription or medical term clearly for a layperson.",
      "Break down common abbreviations (e.g., PO, BID, TID, PRN) if present, explain what the term generally means, and list questions the patient can ask their doctor or pharmacist.",
      "Do not give personal medical advice or diagnose.",
      `Input: ${query}`
    ].join("\n");

    try {
      const response = await fetch(`${baseUrl}/api/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          prompt,
          stream: false
        })
      });

      if (!response.ok) {
        throw new Error(`Ollama responded with status ${response.status}`);
      }

      const data = await response.json();
      explanationOutput.textContent = data.response || "No explanation returned.";
      setStatus(ollamaStatus, "Explanation ready.", "info");
    } catch (err) {
      explanationOutput.textContent = "Could not reach local Ollama.";
      setStatus(
        ollamaStatus,
        `Ollama connection error: ${err.message}. Make sure Ollama is running locally (e.g., 'ollama serve') and CORS allows your local origin.`,
        "error"
      );
    }
  });
}

if (hfOcrBtn) {
  hfOcrBtn.addEventListener("click", async () => {
    const token = document.getElementById("hf-token").value.trim();
    const fileInput = document.getElementById("hf-image");
    const file = fileInput.files && fileInput.files[0];

    if (!token) {
      setStatus(hfStatus, "Enter a Hugging Face API token in the field above to run the Hugging Face feature.", "error");
      return;
    }
    if (!file) {
      setStatus(hfStatus, "Select a prescription image first.", "error");
      return;
    }

    setStatus(hfStatus, "Sending image to Hugging Face OCR model (microsoft/trocr-base-printed)...", "info");

    try {
      const bytes = await file.arrayBuffer();
      const res = await fetch("https://api-inference.huggingface.co/models/microsoft/trocr-base-printed", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": file.type || "application/octet-stream"
        },
        body: bytes
      });

      if (!res.ok) {
        throw new Error(`Hugging Face API error (${res.status})`);
      }

      const result = await res.json();
      const extractedText = Array.isArray(result) && result[0]?.generated_text
        ? result[0].generated_text
        : JSON.stringify(result);

      document.getElementById("medical-input").value = extractedText;
      setStatus(hfStatus, "Extracted text placed into the input box. Click 'Explain with Ollama' to decode it.", "info");
    } catch (err) {
      setStatus(hfStatus, `Hugging Face request failed: ${err.message}`, "error");
    }
  });
}