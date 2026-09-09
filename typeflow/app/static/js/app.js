document.addEventListener("DOMContentLoaded", () => {
  initStartModal();
  initAuthFlow();
  initLogout();
  initPracticeFlow();
  initProgressPage();
});

function initStartModal() {
  const modal = document.getElementById("startModal");
  const openButton = document.getElementById("openStartModal");
  const startButton = document.getElementById("startChoiceButton");
  if (!modal || !openButton || !startButton) return;

  const closeModal = () => modal.classList.add("hidden");
  const choose = (button) => {
    document.querySelectorAll("[data-start-choice]").forEach((choice) => {
      choice.classList.toggle("active", choice === button);
    });
    startButton.href = `/practice?mode=${button.dataset.startChoice}&value=${button.dataset.value}`;
  };

  openButton.addEventListener("click", () => modal.classList.remove("hidden"));
  modal.querySelectorAll("[data-close-start]").forEach((element) => element.addEventListener("click", closeModal));
  modal.querySelectorAll("[data-start-choice]").forEach((button) => {
    button.addEventListener("click", () => choose(button));
  });
}

function initLogout() {
  const button = document.querySelector("[data-logout-button]");
  if (!button) return;

  button.addEventListener("click", async () => {
    try {
      const response = await fetch("/api/auth/logout", { method: "POST" });
      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  });
}

function initAuthFlow() {
  const authForm = document.getElementById("authForm");
  if (!authForm) return;

  const modeButtons = document.querySelectorAll(".auth-tab");
  const nameField = document.getElementById("nameField");
  const authSubmitBtn = document.getElementById("authSubmitBtn");
  const authMessage = document.getElementById("authMessage");

  const params = new URLSearchParams(window.location.search);
  let mode = params.get("mode") === "signup" ? "signup" : "login";

  const setMode = (nextMode) => {
    mode = nextMode;
    modeButtons.forEach((button) => {
      const active = button.dataset.authMode === nextMode;
      button.classList.toggle("active", active);
    });

    nameField.classList.toggle("hidden", mode !== "signup");
    authSubmitBtn.textContent = mode === "signup" ? "Create account" : "Log in";
    if (mode === "signup") {
      authForm.querySelector("#nameInput")?.setAttribute("required", "true");
    } else {
      authForm.querySelector("#nameInput")?.removeAttribute("required");
    }
  };

  modeButtons.forEach((button) => {
    button.addEventListener("click", () => setMode(button.dataset.authMode));
  });

  setMode(mode);

  authForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(authForm);
    const payload = {
      name: (formData.get("name") || "").toString().trim(),
      email: (formData.get("email") || "").toString().trim(),
      password: (formData.get("password") || "").toString(),
    };

    if (!payload.email || !payload.password || (mode === "signup" && !payload.name)) {
      showAuthMessage("Please complete all required fields.", true);
      return;
    }

    if (mode === "signup" && payload.password.length < 6) {
      showAuthMessage("Use a password with at least 6 characters.", true);
      return;
    }

    try {
      const endpoint = mode === "signup" ? "/api/auth/register" : "/api/auth/login";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        showAuthMessage(result.message || "Authentication failed.", true);
        return;
      }

      showAuthMessage(mode === "signup" ? "Account created successfully." : "Welcome back!", false);
      setTimeout(() => {
        window.location.href = "/progress";
      }, 400);
    } catch (error) {
      console.error("Auth request failed", error);
      showAuthMessage("Something went wrong. Please try again.", true);
    }
  });

  function showAuthMessage(message, isError) {
    authMessage.textContent = message;
    authMessage.classList.toggle("error", isError);
    authMessage.classList.toggle("success", !isError);
  }
}

function initProgressPage() {
  const historyList = document.getElementById("historyList");
  if (!historyList) return;

  fetch("/api/results")
    .then((response) => response.json())
    .then((results) => renderProgress(results))
    .catch((error) => {
      console.error("Failed to fetch typing history", error);
      historyList.innerHTML = '<p class="empty-message">Unable to load progress right now.</p>';
    });

  function renderProgress(results) {
    const avgWpmEl = document.getElementById("avgWpm");
    const bestWpmEl = document.getElementById("bestWpm");
    const avgAccuracyEl = document.getElementById("avgAccuracy");
    const totalTestsEl = document.getElementById("totalTests");

    if (!results.length) {
      historyList.innerHTML = '<p class="empty-message">No practice sessions yet. Start a typing test to build momentum.</p>';
      if (avgWpmEl) avgWpmEl.textContent = "0";
      if (bestWpmEl) bestWpmEl.textContent = "0";
      if (avgAccuracyEl) avgAccuracyEl.textContent = "0%";
      if (totalTestsEl) totalTestsEl.textContent = "0";
      return;
    }

    const totalWpm = results.reduce((sum, item) => sum + Number(item.wpm || 0), 0);
    const bestWpm = Math.max(...results.map((item) => Number(item.wpm || 0)));
    const avgAccuracy = results.reduce((sum, item) => sum + Number(item.accuracy || 0), 0) / results.length;

    if (avgWpmEl) avgWpmEl.textContent = (totalWpm / results.length).toFixed(1);
    if (bestWpmEl) bestWpmEl.textContent = bestWpm.toFixed(1);
    if (avgAccuracyEl) avgAccuracyEl.textContent = `${avgAccuracy.toFixed(0)}%`;
    if (totalTestsEl) totalTestsEl.textContent = String(results.length);

    historyList.innerHTML = results
      .slice(0, 8)
      .map((item) => {
        const date = new Date(item.created_at).toLocaleDateString(undefined, {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
        return `
          <div class="history-item">
            <div>
              <strong>${Number(item.wpm || 0).toFixed(1)} WPM</strong>
              <div>${item.mode} • ${item.difficulty} • ${item.category}</div>
            </div>
            <div>
              <div>${Number(item.accuracy || 0).toFixed(0)}% accuracy</div>
              <small>${date}</small>
            </div>
          </div>
        `;
      })
      .join("");
  }
}

function initPracticeFlow() {
  const setupPanel = document.querySelector(".setup-panel");
  const typingPanel = document.getElementById("typingPanel");
  const startBtn = document.getElementById("startPracticeBtn");
  const timerValue = document.getElementById("timerValue");
  const wpmValue = document.getElementById("wpmValue");
  const accuracyValue = document.getElementById("accuracyValue");
  const errorsValue = document.getElementById("errorsValue");
  const textDisplay = document.getElementById("textDisplay");
  const typingInput = document.getElementById("typingInput");
  const charCount = document.getElementById("charCount");
  const progressValue = document.getElementById("progressValue");
  const restartBtn = document.getElementById("restartBtn");
  const footerErrors = document.getElementById("footerErrors");
  const resultsModal = document.getElementById("resultsModal");

  if (!startBtn || !typingPanel) return;

  const state = {
    prompt: "",
    startTime: null,
    timerId: null,
    completed: false,
    duration: 60,
    sessionType: "timed",
    pages: 1,
    userInput: "",
    currentResult: null,
  };

  const library = JSON.parse(document.getElementById("practiceLibraryData")?.textContent || "{}");
  const params = new URLSearchParams(window.location.search);
  const requestedMode = params.get("mode");
  const requestedValue = Number(params.get("value"));
  if ((requestedMode === "timed" || requestedMode === "pages") && Number.isFinite(requestedValue)) {
    state.sessionType = requestedMode;
    if (requestedMode === "timed" && [60, 120, 300].includes(requestedValue)) {
      state.duration = requestedValue;
    }
    if (requestedMode === "pages" && [1, 2].includes(requestedValue)) {
      state.pages = requestedValue;
    }
    document.querySelectorAll(".segment").forEach((segment) => {
      const isActive = segment.dataset.group === requestedMode && Number(segment.dataset.value) === requestedValue;
      segment.classList.toggle("active", isActive);
    });
  }

  document.querySelectorAll(".segment[data-group='duration']").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".segment[data-group='duration']").forEach((segment) => segment.classList.toggle("active", segment === button));
      state.duration = Number(button.dataset.value);
      state.sessionType = "timed";
    });
  });

  document.querySelectorAll(".segment[data-group='pages']").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".segment[data-group='pages']").forEach((segment) => segment.classList.toggle("active", segment === button));
      state.pages = Number(button.dataset.value);
      state.sessionType = "pages";
      document.querySelectorAll(".segment[data-group='duration']").forEach((segment) => segment.classList.remove("active"));
    });
  });

  function escapeHtml(value) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function getPromptText() {
    const basePool = Array.isArray(library.mixed) ? library.mixed : [];
    const textChoice = basePool[Math.floor(Math.random() * basePool.length)] || "Type with a calm rhythm and let every keystroke become more natural.";
    const targetLength = state.sessionType === "pages" ? state.pages * 900 : Math.max(240, state.duration * 6);
    let repeated = "";
    while (repeated.length < targetLength) {
      repeated += `${textChoice} `;
    }
    return repeated.trim();
  }

  function updateMetrics() {
    if (!state.prompt) return;

    const typedLength = state.userInput.length;
    const totalTyped = typedLength;
    let correctCountValue = 0;
    let incorrectCount = 0;

    for (let index = 0; index < totalTyped; index += 1) {
      const expected = state.prompt[index] || "";
      const actual = state.userInput[index] || "";
      if (actual === expected) {
        correctCountValue += 1;
      } else {
        incorrectCount += 1;
      }
    }

    const elapsedSeconds = state.startTime ? Math.max((Date.now() - state.startTime) / 1000, 0.1) : 0;
    const minutes = Math.max(elapsedSeconds / 60, 1 / 60);
    const wpm = correctCountValue > 0 ? (correctCountValue / 5) / minutes : 0;
    const accuracy = totalTyped > 0 ? (correctCountValue / totalTyped) * 100 : 100;
    const progress = state.prompt.length ? (typedLength / state.prompt.length) * 100 : 0;

    wpmValue.textContent = wpm.toFixed(1);
    accuracyValue.textContent = `${Math.min(100, accuracy).toFixed(0)}%`;
    errorsValue.textContent = String(incorrectCount);
    charCount.textContent = String(totalTyped);
    if (footerErrors) footerErrors.textContent = String(incorrectCount);
    progressValue.textContent = `${Math.min(100, progress).toFixed(0)}%`;

    if (state.sessionType === "timed") {
      const timerSeconds = Math.min(Math.max(state.duration - elapsedSeconds, 0), state.duration);
      timerValue.textContent = `${Math.ceil(timerSeconds)}s`;
    } else {
      timerValue.textContent = `${Math.floor(elapsedSeconds)}s`;
    }
  }

  function renderPrompt() {
    const promptChars = [...state.prompt];
    const html = promptChars
      .map((char, index) => {
        const typedChar = state.userInput[index];
        let className = "char";

        if (index < state.userInput.length) {
          className += typedChar === char ? " correct" : " incorrect";
        } else if (index === state.userInput.length && !state.completed) {
          className += " current";
        }

        const safeChar = char === " " ? "&nbsp;" : escapeHtml(char);
        return `<span class="${className}">${safeChar}</span>`;
      })
      .join("");

    textDisplay.innerHTML = html;
  }

  function endSession() {
    if (state.completed) return;
    state.completed = true;
    clearInterval(state.timerId);
    typingInput.disabled = true;

    if (state.startTime) {
      const startTimestamp = state.startTime;
      const elapsedSeconds = Math.max((Date.now() - startTimestamp) / 1000, 1);
      const totalTyped = state.userInput.length;
      let correct = 0;
      let incorrect = 0;

      for (let index = 0; index < totalTyped; index += 1) {
        if (state.userInput[index] === state.prompt[index]) {
          correct += 1;
        } else {
          incorrect += 1;
        }
      }

      const wpm = totalTyped > 0 ? ((correct / 5) / (elapsedSeconds / 60)) : 0;
      const accuracy = totalTyped > 0 ? (correct / totalTyped) * 100 : 100;
      const result = {
        wpm: Number.isFinite(wpm) ? wpm : 0,
        accuracy: Number.isFinite(accuracy) ? Math.min(100, accuracy) : 100,
        errors: incorrect,
        characters_typed: totalTyped,
        duration: Math.ceil(elapsedSeconds),
        difficulty: "standard",
        mode: state.sessionType,
        category: "mixed",
      };

      state.currentResult = result;
      updateResultsModal(result);
      resultsModal.classList.remove("hidden");
      state.startTime = null;
      saveResult(result);
    }
  }

  function updateResultsModal(result) {
    const resultWpm = document.getElementById("resultWpm");
    const resultAccuracy = document.getElementById("resultAccuracy");
    const resultTime = document.getElementById("resultTime");
    const resultErrors = document.getElementById("resultErrors");
    const resultCharacters = document.getElementById("resultCharacters");
    const resultSummary = document.getElementById("resultSummary");

    resultWpm.textContent = result.wpm.toFixed(1);
    resultAccuracy.textContent = `${result.accuracy.toFixed(0)}%`;
    resultTime.textContent = `${result.duration}s`;
    resultErrors.textContent = String(result.errors);
    resultCharacters.textContent = String(result.characters_typed);
    resultSummary.textContent = result.accuracy >= 95
      ? "Excellent accuracy. Your rhythm is controlled and consistent."
      : result.accuracy >= 85
        ? "Strong effort. A little more control will push your speed even higher."
        : "Good start. Focus on smooth rhythm and fewer corrections to improve your next run.";
  }

  async function saveResult(result) {
    try {
      await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          wpm: result.wpm,
          accuracy: result.accuracy,
          errors: result.errors,
          characters_typed: result.characters_typed,
          duration: result.duration,
          difficulty: result.difficulty,
          mode: result.mode,
          category: result.category,
        }),
      });
    } catch (error) {
      console.error("Failed to persist result", error);
    }
  }

  function startPractice() {
    state.prompt = getPromptText();
    state.userInput = "";
    state.completed = false;
    state.startTime = Date.now();
    state.currentResult = null;

    typingInput.disabled = false;
    typingInput.value = "";
    typingInput.focus();
    renderPrompt();
    updateMetrics();

    clearInterval(state.timerId);
    state.timerId = setInterval(() => {
      if (!state.completed) {
        updateMetrics();
        if (
          state.userInput.length >= state.prompt.length ||
          (state.sessionType === "timed" && (Date.now() - state.startTime) / 1000 >= state.duration)
        ) {
          endSession();
        }
      }
    }, 100);
  }

  function resetPractice() {
    state.userInput = "";
    state.completed = false;
    state.currentResult = null;
    state.startTime = null;
    typingInput.value = "";
    typingInput.disabled = false;
    textDisplay.innerHTML = "";
    resultsModal.classList.add("hidden");
    clearInterval(state.timerId);
    timerValue.textContent = `${state.duration}s`;
    wpmValue.textContent = "0";
    accuracyValue.textContent = "100%";
    errorsValue.textContent = "0";
    charCount.textContent = "0";
    if (footerErrors) footerErrors.textContent = "0";
    progressValue.textContent = "0%";
  }

  startBtn.addEventListener("click", () => {
    setupPanel.classList.add("hidden");
    typingPanel.classList.remove("hidden");
    startPractice();
  });

  restartBtn.addEventListener("click", () => {
    resetPractice();
    startPractice();
  });

  typingInput.addEventListener("input", (event) => {
    if (state.completed) return;

    const nextValue = event.target.value.slice(0, state.prompt.length);
    state.userInput = nextValue;
    event.target.value = nextValue;
    renderPrompt();
    updateMetrics();

    if (state.userInput.length >= state.prompt.length) {
      endSession();
    }
  });

  document.getElementById("againBtn").addEventListener("click", () => {
    resultsModal.classList.add("hidden");
    startPractice();
  });

  document.getElementById("settingsBtn").addEventListener("click", () => {
    resultsModal.classList.add("hidden");
    typingPanel.classList.add("hidden");
    setupPanel.classList.remove("hidden");
    resetPractice();
  });

  document.querySelector("[data-close-results]").addEventListener("click", () => {
    resultsModal.classList.add("hidden");
  });

  resetPractice();
}
