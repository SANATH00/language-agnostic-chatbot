"use client";
import { useState, useRef, useEffect } from "react";

const LANGUAGES = [
  { code: "en", name: "English", label: "EN", native: "English" },
  { code: "hi", name: "Hindi", label: "HI", native: "हिन्दी" },
  { code: "bn", name: "Bengali", label: "BN", native: "বাংলা" },
  { code: "te", name: "Telugu", label: "TE", native: "తెలుగు" },
  { code: "mr", name: "Marathi", label: "MR", native: "मराठी" },
  { code: "ta", name: "Tamil", label: "TA", native: "தமிழ்" },
  { code: "gu", name: "Gujarati", label: "GU", native: "ગુજરાતી" },
  { code: "kn", name: "Kannada", label: "KN", native: "ಕನ್ನಡ" },
  { code: "ml", name: "Malayalam", label: "ML", native: "മലയാളം" },
  { code: "pa", name: "Punjabi", label: "PA", native: "ਪੰਜਾਬੀ" },
  { code: "or", name: "Odia", label: "OR", native: "ଓଡ଼ିଆ" },
];

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 5, padding: "4px 0", alignItems: "center" }}>
      {[0, 1, 2].map((i) => (
        <div key={i} style={{
          width: 7, height: 7, borderRadius: "50%",
          background: "#6366f1",
          animation: "lac-bounce 1.2s infinite",
          animationDelay: `${i * 0.2}s`,
        }} />
      ))}
    </div>
  );
}

function UploadIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  );
}

function FileIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/>
      <polyline points="13 2 13 9 20 9"/>
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
    </svg>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hello! I'm LAC Chatbot — your multilingual campus assistant. Ask me anything about fees, exams, schedules, scholarships, or upload a document for context." },
  ]);
  const [input, setInput] = useState("");
  const [selectedLang, setLang] = useState(LANGUAGES[0]);
  const [dropdownOpen, setDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const bottomRef = useRef(null);
  const dropdownRef = useRef(null);
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let raf;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener("resize", resize);
    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.2 + 0.3,
      vx: (Math.random() - 0.5) * 0.2,
      vy: -(Math.random() * 0.25 + 0.08),
      alpha: Math.random() * 0.35 + 0.08,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(99,102,241,${p.alpha})`;
        ctx.fill();
        p.x += p.vx; p.y += p.vy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  useEffect(() => {
    const close = (e) => { if (!dropdownRef.current?.contains(e.target)) setDropdown(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 160) + "px";
    }
  }, [input]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (res.ok) {
        setUploadedFile(file.name);
        setMessages((m) => [...m, {
          role: "assistant",
          text: `Document "${file.name}" uploaded successfully. You can now ask questions about its contents.`,
          isSystem: true,
        }]);
      } else {
        setMessages((m) => [...m, { role: "assistant", text: "Failed to upload document. Please try again.", isSystem: true }]);
      }
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "Upload error. Please check your connection.", isSystem: true }]);
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const text = input.trim();
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, language: selectedLang.name }),
      });
      const data = await res.json();
      setMessages((m) => [...m, { role: "assistant", text: data.reply || "No response." }]);
    } catch {
      setMessages((m) => [...m, { role: "assistant", text: "Connection error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const hasInput = !!input.trim() && !loading;

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080c18",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @keyframes lac-blink   { 0%,100%{opacity:1} 50%{opacity:.25} }
        @keyframes lac-bounce  { 0%,80%,100%{transform:scale(.6);opacity:.4} 40%{transform:scale(1);opacity:1} }
        @keyframes lac-floatIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        @keyframes lac-spin    { to{transform:rotate(360deg)} }
        .lac-messages::-webkit-scrollbar{width:3px}
        .lac-messages::-webkit-scrollbar-thumb{background:rgba(99,102,241,.25);border-radius:4px}
        .lac-lang-item:hover{background:rgba(99,102,241,.1)!important}
        .lac-upload-btn:hover{background:rgba(99,102,241,.2)!important;color:#a5b4fc!important}
        .lac-send-btn:hover{transform:scale(1.05)}
        .lac-textarea::placeholder{color:rgba(160,170,220,0.35)}
        .lac-textarea:focus{outline:none}
      `}</style>

      <canvas ref={canvasRef} style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none" }} />

      {/* Header */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        padding: "14px 24px",
        borderBottom: "1px solid rgba(99,102,241,0.12)",
        background: "rgba(8,12,24,0.85)",
        backdropFilter: "blur(20px)",
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: "linear-gradient(135deg, #6366f1, #4f46e5)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, boxShadow: "0 0 20px rgba(99,102,241,0.4)",
        }}>🤖</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 15, color: "#e0e4ff", letterSpacing: 0.3 }}>LAC Chatbot</div>
          <div style={{ color: "rgba(160,170,220,0.45)", fontSize: 11 }}>
            {LANGUAGES.length} Indian Languages · Campus Assistant
          </div>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, color: "#6ee7b7", fontSize: 11, fontWeight: 600 }}>
          <div style={{
            width: 7, height: 7, borderRadius: "50%",
            background: "#6ee7b7", boxShadow: "0 0 8px #6ee7b7",
            animation: "lac-blink 2s ease-in-out infinite",
          }} />
          Online
        </div>
      </div>

      {/* Messages */}
      <div className="lac-messages" style={{
        flex: 1, overflowY: "auto",
        paddingTop: 80, paddingBottom: 200,
        display: "flex", flexDirection: "column",
        alignItems: "center", gap: 4,
        position: "relative", zIndex: 10,
      }}>
        <div style={{ width: "100%", maxWidth: 720, padding: "0 16px", display: "flex", flexDirection: "column", gap: 4 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: "flex",
              justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
              animation: "lac-floatIn 0.3s ease",
              marginBottom: 8,
            }}>
              {msg.role === "assistant" && (
                <div style={{
                  width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, marginRight: 10, alignSelf: "flex-end",
                  background: "rgba(99,102,241,0.12)",
                  border: "1px solid rgba(99,102,241,0.25)",
                }}>🤖</div>
              )}
              <div style={{
                maxWidth: "72%",
                padding: msg.isSystem ? "8px 14px" : "12px 16px",
                fontSize: 14, lineHeight: 1.75,
                borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "4px 18px 18px 18px",
                wordBreak: "break-word",
                ...(msg.role === "user" ? {
                  color: "#fff",
                  background: "linear-gradient(135deg, #4f46e5, #6366f1)",
                } : msg.isSystem ? {
                  color: "rgba(160,200,170,0.8)",
                  background: "rgba(99,241,150,0.05)",
                  border: "1px solid rgba(99,200,130,0.15)",
                  fontSize: 13,
                } : {
                  color: "#d0d8ff",
                  background: "rgba(99,102,241,0.07)",
                  border: "1px solid rgba(99,102,241,0.13)",
                }),
              }}>{msg.text}</div>
              {msg.role === "user" && (
                <div style={{
                  width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, marginLeft: 10, alignSelf: "flex-end",
                  background: "rgba(99,102,241,0.15)",
                  border: "1px solid rgba(99,102,241,0.3)",
                }}>👤</div>
              )}
            </div>
          ))}
          {loading && (
            <div style={{ display: "flex", justifyContent: "flex-start", marginBottom: 8 }}>
              <div style={{
                width: 30, height: 30, borderRadius: "50%", flexShrink: 0,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 14, marginRight: 10, alignSelf: "flex-end",
                background: "rgba(99,102,241,0.12)",
                border: "1px solid rgba(99,102,241,0.25)",
              }}>🤖</div>
              <div style={{
                padding: "12px 16px",
                background: "rgba(99,102,241,0.07)",
                border: "1px solid rgba(99,102,241,0.13)",
                borderRadius: "4px 18px 18px 18px",
              }}><TypingDots /></div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input area */}
      <div style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
        background: "linear-gradient(to top, #080c18 60%, transparent)",
        padding: "16px 16px 24px",
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        <div style={{ width: "100%", maxWidth: 720 }}>

          {uploadedFile && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              padding: "5px 12px", marginBottom: 8,
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.2)",
              borderRadius: 20, color: "#a5b4fc", fontSize: 12,
            }}>
              <FileIcon /> {uploadedFile}
              <span onClick={() => setUploadedFile(null)} style={{ cursor: "pointer", opacity: 0.5, marginLeft: 4, fontSize: 14 }}>×</span>
            </div>
          )}

          {/* ✅ FIX 1: removed overflow:hidden so dropdown is not clipped */}
          <div style={{
            background: "rgba(18,22,40,0.95)",
            border: "1px solid rgba(99,102,241,0.22)",
            borderRadius: 16,
            boxShadow: "0 0 0 1px rgba(99,102,241,0.05), 0 8px 40px rgba(0,0,0,0.5)",
          }}>
            <textarea
              ref={textareaRef}
              className="lac-textarea"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message LAC Chatbot in ${selectedLang.name}...`}
              rows={1}
              style={{
                width: "100%", background: "transparent", border: "none",
                color: "#d0d8ff", fontSize: 15, lineHeight: 1.6,
                padding: "16px 18px 8px",
                resize: "none", display: "block",
                fontFamily: "inherit",
                boxSizing: "border-box",
                borderRadius: 16,
              }}
            />

            <div style={{
              display: "flex", alignItems: "center",
              padding: "8px 12px 10px",
              gap: 8,
            }}>
              <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx,.txt" style={{ display: "none" }} onChange={handleFileUpload} />
              <button
                className="lac-upload-btn"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                title="Upload document"
                style={{
                  width: 34, height: 34, borderRadius: 8,
                  background: "rgba(99,102,241,0.1)",
                  border: "1px solid rgba(99,102,241,0.2)",
                  color: uploading ? "#6366f1" : "rgba(160,170,220,0.5)",
                  cursor: uploading ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.2s", flexShrink: 0,
                }}
              >
                <UploadIcon />
              </button>

              {/* Language selector */}
              <div ref={dropdownRef} style={{ position: "relative" }}>
                <button
                  onClick={() => setDropdown(!dropdownOpen)}
                  style={{
                    height: 34, padding: "0 12px",
                    background: "rgba(99,102,241,0.1)",
                    border: "1px solid rgba(99,102,241,0.2)",
                    borderRadius: 8, color: "#a5b4fc",
                    fontSize: 12, fontWeight: 700,
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                    transition: "all 0.2s", flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: 10 }}>🌐</span>
                  {selectedLang.native}
                  <span style={{ fontSize: 8, opacity: 0.6 }}>▼</span>
                </button>

                {/* ✅ FIX 2: zIndex 9999 so dropdown appears above everything */}
                {dropdownOpen && (
                  <div style={{
                    position: "absolute", bottom: "calc(100% + 8px)", left: 0,
                    background: "#0d1224",
                    border: "1px solid rgba(99,102,241,0.2)",
                    borderRadius: 12,
                    boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
                    zIndex: 9999, minWidth: 200,
                    maxHeight: 280, overflowY: "auto",
                  }}>
                    {LANGUAGES.map((lang) => (
                      <div
                        key={lang.code}
                        className="lac-lang-item"
                        onClick={() => { setLang(lang); setDropdown(false); }}
                        style={{
                          padding: "9px 16px",
                          display: "flex", justifyContent: "space-between", alignItems: "center",
                          cursor: "pointer",
                          borderBottom: "1px solid rgba(99,102,241,0.06)",
                          background: lang.code === selectedLang.code ? "rgba(99,102,241,0.12)" : "transparent",
                          transition: "background 0.15s",
                        }}
                      >
                        <span style={{ color: lang.code === selectedLang.code ? "#a5b4fc" : "rgba(190,200,240,0.7)", fontSize: 13, fontWeight: 600 }}>
                          {lang.name}
                        </span>
                        <span style={{ color: "rgba(160,170,220,0.45)", fontSize: 14 }}>{lang.native}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ flex: 1 }} />

              <span style={{ fontSize: 11, color: "rgba(99,102,241,0.35)" }}>
                Enter to send · Shift+Enter for new line
              </span>

              <button
                className="lac-send-btn"
                onClick={sendMessage}
                disabled={!hasInput}
                style={{
                  width: 34, height: 34, borderRadius: 8,
                  background: hasInput ? "linear-gradient(135deg, #6366f1, #4f46e5)" : "rgba(255,255,255,0.05)",
                  border: hasInput ? "none" : "1px solid rgba(255,255,255,0.08)",
                  cursor: hasInput ? "pointer" : "default",
                  color: hasInput ? "#fff" : "rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0, transition: "all 0.2s",
                  boxShadow: hasInput ? "0 0 16px rgba(99,102,241,0.4)" : "none",
                }}
              >
                <SendIcon />
              </button>
            </div>
          </div>

          <div style={{ textAlign: "center", color: "rgba(99,102,241,0.25)", fontSize: 11, marginTop: 8 }}>
            LAC Chatbot · Multilingual Campus Assistant · Prototype v1.0
          </div>
        </div>
      </div>
    </div>
  );
}