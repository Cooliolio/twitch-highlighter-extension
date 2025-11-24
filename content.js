let highlightList = [];
let categoryColors = {
  custom: "#ffff00",
  verified: "#90ee90",
  big: "#ffa500",
};

// Load saved names and colors from storage
chrome.storage.sync.get(["highlightNames", "categoryColors"], (data) => {
  highlightList = data.highlightNames || [];
  if (data.categoryColors) categoryColors = data.categoryColors;

  highlightChat();
});

// Listen for changes in storage (real-time updates)
chrome.storage.onChanged.addListener((changes) => {
  if (changes.highlightNames) {
    highlightList = changes.highlightNames.newValue || [];
  }
  if (changes.categoryColors) {
    categoryColors = changes.categoryColors.newValue;
  }
  highlightChat();
});

// Helper function
function hasBadge(messageBlock, keyword) {
  return (
    messageBlock.querySelector(`img[alt*='${keyword}']`) ||
    messageBlock.querySelector(`img[aria-label*='${keyword}']`)
  );
}

// Function to highlight messages
function highlightChat() {
  document
    .querySelectorAll(
      ".chat-line__username, .chat-author__display-name, .seventv-chat-user-username"
    )
    .forEach((el) => {
      const name = el.textContent.trim();
      const messageBlock =
        el.closest(".chat-line__message") || el.closest(".seventv-message");
      if (!messageBlock) return;

      // Reset highlight classes
      messageBlock.classList.remove(
        "highlight-verified",
        "highlight-moderator",
        "highlight-vip"
      );

      if (hasBadge(messageBlock, "Verified")) {
        messageBlock.classList.add("highlight-verified");
      } else if (hasBadge(messageBlock, "Moderator")) {
        messageBlock.classList.add("highlight-moderator");
      } else if (hasBadge(messageBlock, "VIP")) {
        messageBlock.classList.add("highlight-vip");
      }
    });
}

// Observe new messages dynamically
const observer = new MutationObserver(() => {
  highlightChat();
});

observer.observe(document.body, { childList: true, subtree: true });
