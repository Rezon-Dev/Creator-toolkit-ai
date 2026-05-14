import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

/*
  1) Replace this with your Firebase web config.
  2) If you leave it empty, the app still works using localStorage only.
*/
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: ""
};

let db = null;
const firebaseEnabled = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

try {
  if (firebaseEnabled) {
    const app = initializeApp(firebaseConfig);
    db = getFirestore(app);
  }
} catch (error) {
  console.warn("Firebase disabled:", error);
}

const $ = (id) => document.getElementById(id);

const state = {
  lastCaption: "",
  lastHashtags: "",
  lastAll: ""
};

const captionBanks = {
  English: {
    Aesthetic: [
      "Soft moments, loud memories. ✨",
      "A little peace, a little glow, a little story.",
      "Not every post needs noise. Some speak quietly."
    ],
    Funny: [
      "Trying my best, but my camera roll is doing overtime.",
      "Main character energy with low battery percentage.",
      "Posting this before I overthink it."
    ],
    Emotional: [
      "Some feelings become memories before we even understand them.",
      "Behind every smile, there is a chapter nobody reads.",
      "Growing quietly, feeling deeply."
    ],
    Professional: [
      "Building with focus, learning with patience, growing with purpose.",
      "Small steps today. Stronger results tomorrow.",
      "Consistency is the real brand strategy."
    ],
    Romantic: [
      "Some people feel like home without saying much.",
      "A little love, a little chaos, a lot of memories.",
      "You became the calm part of my busy world."
    ],
    Motivational: [
      "Start small. Stay consistent. Build quietly.",
      "Your future is being written by what you repeat today.",
      "Discipline turns ordinary days into extraordinary outcomes."
    ],
    Viral: [
      "POV: one simple moment became a whole vibe.",
      "This is your sign to stop waiting and start creating.",
      "Nobody talks about this part, but it changes everything."
    ],
    Assamese: [
      "অসমৰ বতাহতে আছে এটা আলাদা অনুভৱ।",
      "সৰু মুহূৰ্ত, ডাঙৰ স্মৃতি।",
      "মনটো আজি অলপ অসমীয়া হৈ পৰিল।"
    ]
  },
  Hindi: {
    Aesthetic: ["कुछ पल सिर्फ महसूस करने के लिए होते हैं। ✨", "सुकून भी एक अलग तरह की खूबसूरती है।"],
    Funny: ["पोस्ट कर रहा हूँ, बाद में शर्म आए तो delete कर दूँगा।", "Mood अच्छा है, बस battery low है।"],
    Emotional: ["कुछ बातें दिल में रहकर भी बहुत कुछ कह जाती हैं।", "मुस्कुराना भी कभी-कभी सबसे बड़ी हिम्मत होती है।"],
    Professional: ["मेहनत शांत होती है, परिणाम आवाज करता है।", "हर दिन थोड़ा बेहतर बनने की कोशिश।"],
    Romantic: ["तुम हो तो हर पल थोड़ा खास लगता है।", "कुछ लोग जिंदगी में सुकून बनकर आते हैं।"],
    Motivational: ["रुकना नहीं है, बस धीरे-धीरे आगे बढ़ना है।", "जो आज करोगे, वही कल पहचान बनेगा।"],
    Viral: ["POV: ये पोस्ट बस vibe के लिए है।", "ये caption नहीं, पूरा mood है।"],
    Assamese: ["অসমৰ অনুভৱ, হৃদয়ৰ ভাষা।"]
  },
  Hinglish: {
    Aesthetic: ["Thoda peace, thoda glow, full vibe. ✨", "Simple moment, premium feeling."],
    Funny: ["Confidence high, storage low.", "Caption nahi mil raha tha, toh app bana diya."],
    Emotional: ["Kabhi kabhi silence hi sabse loud hota hai.", "Smile ke peeche bhi ek story hoti hai."],
    Professional: ["Build silently, launch loudly.", "Small progress is still progress."],
    Romantic: ["Tu hai toh normal days bhi special lagte hain.", "Some people are pure comfort."],
    Motivational: ["Bas start kar. Perfect baad mein hoga.", "Low budget, high ambition."],
    Viral: ["POV: you turned an idea into a vibe.", "This one is not random, it’s a mood."],
    Assamese: ["Axom vibe, creator mind."]
  },
  Assamese: {
    Aesthetic: ["নীৰৱ সন্ধিয়া, কোমল অনুভৱ। ✨", "সৰু দৃশ্য, কিন্তু মনত ৰৈ যোৱা স্মৃতি।"],
    Funny: ["Caption বিচাৰি বিচাৰি শেষত app বনাই দিলোঁ।", "Mood ভাল, কিন্তু internet slow."],
    Emotional: ["কিছু অনুভৱ শব্দ নোহোৱাকৈও বুজা যায়।", "হাঁহিৰ আঁৰত কিমান কথা লুকাই থাকে।"],
    Professional: ["ধীৰে ধীৰে গঢ়া কামেই একদিন পৰিচয় হয়।", "সপোন ডাঙৰ, আৰম্ভণি সৰু।"],
    Romantic: ["তুমি থাকিলে সাধাৰণ দিনো বিশেষ লাগে।", "কিছুমান মানুহ মনৰ সুকুন।"],
    Motivational: ["আজি সৰু খোজ, কাইলৈ ডাঙৰ ফল।", "চুপচাপ কাম কৰা, ফলাফলে কথা ক’ব।"],
    Viral: ["POV: এটা সৰু মুহূৰ্ত, কিন্তু সম্পূৰ্ণ vibe.", "এইটো caption নহয়, mood."],
    Assamese: ["অসমীয়া মন, creator vibe.", "Axom vibes forever. 🌺"]
  }
};

const hashtagMap = {
  Instagram: ["#CreatorLife", "#AestheticFeed", "#InstaCaption", "#ViralPost", "#DailyVibes"],
  YouTube: ["#YouTubeShorts", "#CreatorTips", "#ViralShorts", "#ContentCreator", "#VideoIdeas"],
  Facebook: ["#FacebookPost", "#DailyUpdate", "#GoodVibes", "#SocialMedia", "#LifeMoments"],
  WhatsApp: ["#StatusVibes", "#Mood", "#Feelings", "#DailyStatus", "#Aesthetic"],
  LinkedIn: ["#PersonalBranding", "#GrowthMindset", "#CreatorEconomy", "#Productivity", "#DigitalSkills"],
  Pinterest: ["#PinterestIdeas", "#AestheticBoard", "#CreativeInspiration", "#VisualContent", "#DesignIdeas"],
  "X/Twitter": ["#Creator", "#BuildInPublic", "#AItools", "#DigitalCreator", "#Growth"]
};

const assameseIdeas = [
  { title: "Assamese Romantic Caption", text: "তুমি কাষত থাকিলে পৃথিৱীখন অলপ কোমল লাগে।" },
  { title: "Bihu Caption", text: "ঢোলৰ মাত, পেঁপাৰ সুৰ, আৰু অসমীয়াৰ হৃদয়। 🌺" },
  { title: "Assamese Status", text: "সপোন ডাঙৰ, কিন্তু আৰম্ভণি আজিৰ পৰাই।" },
  { title: "Rainy Assam Line", text: "বৰষুণে অসমক আৰু অলপ কবিতা কৰি তোলে।" },
  { title: "Creator Bio", text: "অসমীয়া creator | stories, vibes & digital dreams" },
  { title: "Emotional Quote", text: "মন ভাঙিলেও মানুহ আগবাঢ়িব শিকে।" }
];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getHashtags(platform, language, mood, topic) {
  const base = hashtagMap[platform] || hashtagMap.Instagram;
  const topicTag = topic
    .split(/\s+/)
    .slice(0, 2)
    .join("")
    .replace(/[^a-zA-Z0-9]/g, "");
  const local = language === "Assamese" || mood === "Assamese"
    ? ["#AssameseCreator", "#AxomVibes", "#AssamContent", "#Axomiya"]
    : [];
  return [...base, ...local, topicTag ? `#${topicTag}` : ""].filter(Boolean).join(" ");
}

function generateCaption() {
  const topic = $("topicInput").value.trim();
  const platform = $("platformSelect").value;
  const mood = $("moodSelect").value;
  const language = $("languageSelect").value;
  const length = $("lengthSelect").value;

  if (!topic) {
    showToast("Enter a topic first");
    $("topicInput").focus();
    return;
  }

  const bank = captionBanks[language]?.[mood] || captionBanks.English.Aesthetic;
  const line = pick(bank);
  const hook = platform === "LinkedIn"
    ? "Thought for today:"
    : platform === "YouTube"
      ? "Before you scroll:"
      : "POV:";

  const cta = platform === "LinkedIn"
    ? "What is your view on this?"
    : "Save this if you felt it.";

  let caption = `${line}\n\n${hook} ${topic}`;
  if (length === "Medium") caption += `\n\n${cta}`;
  if (length === "Long") caption += `\n\n${cta}\n\nCreated with focus, feeling and a little creator energy.`;

  const hashtags = getHashtags(platform, language, mood, topic);

  state.lastCaption = caption;
  state.lastHashtags = hashtags;
  state.lastAll = `Caption:\n${caption}\n\nHashtags:\n${hashtags}`;

  $("outputBox").classList.remove("empty");
  $("outputBox").classList.add("fade-in");
  $("outputBox").textContent = state.lastAll;
  setTimeout(() => $("outputBox").classList.remove("fade-in"), 350);

  saveHistory({ caption, hashtags, platform, mood, language, topic, type: "history" });
}

function clearAll() {
  $("topicInput").value = "";
  $("platformSelect").selectedIndex = 0;
  $("moodSelect").selectedIndex = 0;
  $("languageSelect").selectedIndex = 0;
  $("lengthSelect").selectedIndex = 0;
  state.lastCaption = "";
  state.lastHashtags = "";
  state.lastAll = "";
  $("outputBox").textContent = "Enter a topic and generate captions.";
  $("outputBox").className = "output-box empty fade-in";
  showToast("Cleared");
  setTimeout(() => $("outputBox").classList.remove("fade-in"), 350);
}

async function copyText(text, label) {
  if (!text) {
    showToast("Nothing to copy yet");
    return;
  }
  try {
    await navigator.clipboard.writeText(text);
    showToast(`${label} copied`);
  } catch {
    const temp = document.createElement("textarea");
    temp.value = text;
    document.body.appendChild(temp);
    temp.select();
    document.execCommand("copy");
    temp.remove();
    showToast(`${label} copied`);
  }
}

function getLocalItems() {
  return JSON.parse(localStorage.getItem("creatorToolkitItems") || "[]");
}

function setLocalItems(items) {
  localStorage.setItem("creatorToolkitItems", JSON.stringify(items.slice(0, 40)));
}

async function saveHistory(item) {
  const items = getLocalItems();
  items.unshift({ ...item, id: crypto.randomUUID(), createdAt: new Date().toISOString() });
  setLocalItems(items);
  renderSaved();

  if (db) {
    try {
      await addDoc(collection(db, "captionHistory"), {
        ...item,
        createdAt: serverTimestamp()
      });
    } catch (error) {
      console.warn("Firestore save failed:", error);
    }
  }
}

async function saveFavorite() {
  if (!state.lastAll) {
    showToast("Generate something first");
    return;
  }
  await saveHistory({
    caption: state.lastCaption,
    hashtags: state.lastHashtags,
    platform: $("platformSelect").value,
    mood: $("moodSelect").value,
    language: $("languageSelect").value,
    topic: $("topicInput").value.trim(),
    type: "favorite"
  });
  showToast("Saved to favourites");
}

function renderSaved() {
  const items = getLocalItems();
  const savedList = $("savedList");
  if (!items.length) {
    savedList.innerHTML = `<p class="subtext">No saved items yet. Generate captions and tap save.</p>`;
    return;
  }

  savedList.innerHTML = items.map(item => `
    <article class="saved-item">
      <strong>${escapeHtml(item.type === "favorite" ? "♡ Favourite" : "History")} · ${escapeHtml(item.platform || "Post")}</strong>
      <p>${escapeHtml(item.caption || "")}</p>
      <small>${escapeHtml(item.hashtags || "")}</small>
    </article>
  `).join("");
}

function renderAssamese() {
  $("assameseGrid").innerHTML = assameseIdeas.map((item, index) => `
    <article class="assamese-item">
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.text)}</p>
      <button class="secondary-btn" data-copy-assamese="${index}">Copy</button>
    </article>
  `).join("");

  document.querySelectorAll("[data-copy-assamese]").forEach(btn => {
    btn.addEventListener("click", () => {
      const item = assameseIdeas[Number(btn.dataset.copyAssamese)];
      copyText(item.text, "Assamese line");
    });
  });
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, match => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[match]));
}

function showToast(message) {
  const toast = $("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 1800);
}

function initTheme() {
  const saved = localStorage.getItem("theme") || "dark";
  if (saved === "light") document.body.classList.add("light");
  $("themeToggle").textContent = document.body.classList.contains("light") ? "☀" : "☾";
}

function toggleTheme() {
  document.body.classList.toggle("light");
  const isLight = document.body.classList.contains("light");
  localStorage.setItem("theme", isLight ? "light" : "dark");
  $("themeToggle").textContent = isLight ? "☀" : "☾";
}

$("generateBtn").addEventListener("click", generateCaption);
$("clearBtn").addEventListener("click", clearAll);
$("copyCaptionBtn").addEventListener("click", () => copyText(state.lastCaption, "Caption"));
$("copyTagsBtn").addEventListener("click", () => copyText(state.lastHashtags, "Hashtags"));
$("copyAllBtn").addEventListener("click", () => copyText(state.lastAll, "All content"));
$("saveBtn").addEventListener("click", saveFavorite);
$("themeToggle").addEventListener("click", toggleTheme);

initTheme();
renderAssamese();
renderSaved();
