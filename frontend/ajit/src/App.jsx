import { useState } from "react";
import {
  Sparkles,
  Download,
  Image as ImageIcon,
  LoaderCircle,
  WandSparkles,
  AlertCircle,
  RefreshCw,
  ArrowRight,
  Palette,
  Zap,
  Layers,
  ArrowLeft,
} from "lucide-react";

import "./App.css";

const styles = [
  "Realistic",
  "Anime",
  "Digital",
  "Cinematic",
  "Fantasy",
  "3D Render",
  "Watercolor",
  "Oil Painting",
];

const ratios = [
  { label: "Square", value: "1:1" },
  { label: "Landscape", value: "16:9" },
  { label: "Portrait", value: "9:16" },
  { label: "Classic", value: "4:3" },
  { label: "Photo", value: "3:2" },
];

function App() {
  const [showWelcome, setShowWelcome] = useState(true);

  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Realistic");
  const [ratio, setRatio] = useState("1:1");
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);

  async function handleGenerate() {
    if (!prompt.trim()) {
      setError("Please enter a prompt to generate an image.");
      return;
    }

    setLoading(true);
    setError("");
    setImage("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/generate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: prompt.trim(),
            style,
            ratio,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Image generation failed."
        );
      }

      setImage(data.image);

      setHistory((previous) => [
        {
          id: Date.now(),
          image: data.image,
          prompt: data.prompt || prompt.trim(),
          style: data.style || style,
        },
        ...previous,
      ]);
    } catch (err) {
      setError(
        err.message ||
          "Unable to connect to the backend. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  function downloadImage() {
    if (!image) return;

    const link = document.createElement("a");

    link.href = image;
    link.download = `pixelforge-${Date.now()}.png`;

    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function useExample(text) {
    setPrompt(text);
    setError("");
  }

  if (showWelcome) {
    return (
      <div className="welcome-page">
        <div className="welcome-orb orb-one"></div>
        <div className="welcome-orb orb-two"></div>
        <div className="welcome-orb orb-three"></div>

        <header className="welcome-navbar">
          <a className="brand" href="#welcome">
            <span className="brand-icon">
              <Sparkles size={23} />
            </span>

            <span>
              PixelForge
              <span className="brand-ai"> AI</span>
            </span>
          </a>

          <span className="welcome-status">
            <span className="status-dot"></span>
            AI CREATIVE STUDIO
          </span>
        </header>

        <main id="welcome" className="welcome-content">
          <div className="welcome-badge">
            <Sparkles size={15} />
            YOUR IMAGINATION, POWERED BY AI
          </div>

          <h1 className="welcome-title">
            Your imagination.
            <br />
            <span>Unlimited creation.</span>
          </h1>

          <p className="welcome-description">
            Turn simple words into extraordinary artwork.
            Explore your creativity and bring your ideas
            to life with PixelForge AI.
          </p>

          <button
            type="button"
            className="welcome-start-button"
            onClick={() => setShowWelcome(false)}
          >
            Start Creating
            <ArrowRight size={20} />
          </button>

          <div className="welcome-features">
            <div className="welcome-feature">
              <span className="welcome-feature-icon">
                <WandSparkles size={23} />
              </span>
              <h3>AI-Powered Art</h3>
              <p>Transform text into images.</p>
            </div>

            <div className="welcome-feature">
              <span className="welcome-feature-icon">
                <Palette size={23} />
              </span>
              <h3>Creative Styles</h3>
              <p>Explore different art styles.</p>
            </div>

            <div className="welcome-feature">
              <span className="welcome-feature-icon">
                <Download size={23} />
              </span>
              <h3>Easy Downloads</h3>
              <p>Save your generated artwork.</p>
            </div>
          </div>

          <div className="welcome-art-preview">
            <div className="preview-glow"></div>

            <div className="preview-card preview-card-left">
              <ImageIcon size={21} />
              <span>Dream it</span>
            </div>

            <div className="preview-main-card">
              <div className="preview-main-art">
                <Sparkles size={54} />
                <span>IMAGINE</span>
                <strong>CREATE</strong>
              </div>
              <div className="preview-card-caption">
                <span className="preview-live-dot"></span>
                Creativity without limits
              </div>
            </div>

            <div className="preview-card preview-card-right">
              <Zap size={21} />
              <span>Make it real</span>
            </div>
          </div>

          <p className="welcome-bottom-text">
            MADE FOR CREATORS, DREAMERS & EXPLORERS
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <nav className="navbar">
        <a
          href="#dashboard"
          className="brand"
          onClick={(e) => {
            e.preventDefault();
            setShowWelcome(true);
          }}
        >
          <span className="brand-icon">
            <Sparkles size={22} />
          </span>
          <span>
            PixelForge<span className="brand-ai"> AI</span>
          </span>
        </a>

        <div className="navbar-right">
          <span className="nav-status">
            <span className="status-dot"></span>
            AI Studio
          </span>

          <button
            type="button"
            className="back-home-button"
            onClick={() => setShowWelcome(true)}
          >
            <ArrowLeft size={16} />
            Home
          </button>
        </div>
      </nav>

      <main id="dashboard" className="main-content">
        <section className="hero">
          <div className="hero-badge">
            <Sparkles size={15} />
            AI IMAGE GENERATOR
          </div>

          <h1>
            Imagine it. <span>Create it.</span>
          </h1>

          <p>
            Turn your imagination into stunning artwork with
            the power of AI.
          </p>
        </section>

        <section className="generator-card">
          <div className="section-heading">
            <div className="section-icon">
              <WandSparkles size={21} />
            </div>

            <div>
              <h2>Create Your Image</h2>
              <p>Describe what you want to create.</p>
            </div>
          </div>

          <label htmlFor="prompt" className="field-label">
            Image Prompt
          </label>

          <textarea
            id="prompt"
            className="prompt-input"
            placeholder="A futuristic city at sunset, glowing neon lights, cinematic atmosphere..."
            value={prompt}
            onChange={(e) => {
              setPrompt(e.target.value);
              if (error) setError("");
            }}
            maxLength={1000}
            rows={5}
          />

          <div className="prompt-footer">
            <span>Be descriptive for better results</span>
            <span>{prompt.length}/1000</span>
          </div>

          <div className="examples-section">
            <span className="field-label">Try an example</span>

            <div className="example-buttons">
              <button
                type="button"
                onClick={() =>
                  useExample(
                    "A futuristic city at sunset with glowing neon lights, cinematic atmosphere, highly detailed"
                  )
                }
              >
                Futuristic City
              </button>

              <button
                type="button"
                onClick={() =>
                  useExample(
                    "A cute anime cat sitting under cherry blossom trees, beautiful colors, detailed illustration"
                  )
                }
              >
                Anime Cat
              </button>

              <button
                type="button"
                onClick={() =>
                  useExample(
                    "A peaceful mountain lake surrounded by green forests, golden sunlight, photorealistic landscape"
                  )
                }
              >
                Nature
              </button>
            </div>
          </div>

          <div className="options-grid">
            <div className="option-group">
              <label htmlFor="style" className="field-label">
                <Palette size={16} />
                Art Style
              </label>

              <select
                id="style"
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="option-select"
              >
                {styles.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="option-group">
              <label htmlFor="ratio" className="field-label">
                <Layers size={16} />
                Image Ratio
              </label>

              <select
                id="ratio"
                value={ratio}
                onChange={(e) => setRatio(e.target.value)}
                className="option-select"
              >
                {ratios.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label} ({item.value})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="button"
            className="generate-button"
            onClick={handleGenerate}
            disabled={loading}
          >
            {loading ? (
              <>
                <LoaderCircle size={20} className="spin" />
                Generating Image...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate Image
              </>
            )}
          </button>

          <p className="generation-note">
            <Zap size={14} />
            Your creativity, powered by AI.
          </p>

          {error && (
            <div className="error-message" role="alert">
              <AlertCircle size={19} />
              <span>{error}</span>
            </div>
          )}
        </section>

        <section className="result-section">
          <div className="result-heading">
            <div>
              <h2>Your Creation</h2>
              <p>Your generated image will appear here.</p>
            </div>

            {image && !loading && (
              <button
                type="button"
                className="secondary-button"
                onClick={handleGenerate}
                disabled={loading}
              >
                <RefreshCw size={16} />
                Regenerate
              </button>
            )}
          </div>

          <div className="result-card">
            {loading ? (
              <div className="loading-state">
                <div className="loading-icon">
                  <LoaderCircle size={42} className="spin" />
                </div>

                <h3>Creating your masterpiece...</h3>

                <p>
                  AI is bringing your imagination to life.
                </p>

                <div className="loading-progress">
                  <span></span>
                </div>
              </div>
            ) : image ? (
              <div className="generated-result">
                <img
                  src={image}
                  alt={prompt || "AI-generated artwork"}
                  className="generated-image"
                />

                <div className="image-details">
                  <div className="image-description">
                    <span className="result-label">
                      GENERATED ARTWORK
                    </span>

                    <h3>{style} Style</h3>

                    <p>{prompt}</p>
                  </div>

                  <button
                    type="button"
                    className="download-button"
                    onClick={downloadImage}
                  >
                    <Download size={18} />
                    Download
                  </button>
                </div>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">
                  <ImageIcon size={42} />
                </div>

                <h3>Your next masterpiece starts here</h3>

                <p>
                  Enter a prompt above and click Generate Image
                  to see your creation.
                </p>

                <div className="empty-decoration">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}
          </div>
        </section>

        {history.length > 0 && (
          <section className="history-section">
            <div className="history-heading">
              <div>
                <h2>Recent Creations</h2>
                <p>
                  Your images from this session.
                </p>
              </div>

              <span className="history-count">
                {history.length}{" "}
                {history.length === 1 ? "image" : "images"}
              </span>
            </div>

            <div className="history-grid">
              {history.map((item) => (
                <button
                  type="button"
                  className="history-item"
                  key={item.id}
                  onClick={() => {
                    setImage(item.image);
                    setPrompt(item.prompt);
                    setStyle(item.style);
                    setError("");

                    window.scrollTo({
                      top: 0,
                      behavior: "smooth",
                    });
                  }}
                  title="View this creation"
                >
                  <img
                    src={item.image}
                    alt={item.prompt}
                    className="history-image"
                  />

                  <div className="history-item-info">
                    <span>{item.style}</span>
                    <p>{item.prompt}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </main>
<footer className="footer">
        <a
          href="#welcome"
          className="footer-brand"
          onClick={(e) => {
            e.preventDefault();
            setShowWelcome(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
        >
          <span className="footer-logo">
            <Sparkles size={21} />
          </span>

          <span className="footer-brand-text">
            PixelForge <span>AI</span>
          </span>
        </a>

        <div className="footer-center">
          <p>
            Turn imagination into <span>art.</span>
          </p>

          <div className="footer-divider">
            <span></span>
            <Sparkles size={12} />
            <span></span>
          </div>

          <span className="footer-tagline">
            AI CREATIVE STUDIO
          </span>
        </div>

        <div className="footer-right">
          <span className="footer-status-dot"></span>
          <span>CREATIVITY UNLEASHED</span>
        </div>
      </footer>
    </div>
  );
}

export default App;