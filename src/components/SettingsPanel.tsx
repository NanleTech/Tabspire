import React, { useState } from 'react';

interface SettingsPanelProps {
  open: boolean;
  onClose: () => void;
  language: string;
  onLanguageChange: (lang: string) => void;
  fontStyle: string;
  onFontStyleChange: (style: string) => void;
  voices: SpeechSynthesisVoice[];
  selectedVoice: string;
  onVoiceChange: (voiceURI: string) => void;
  theme: string;
  onThemeChange: (theme: string) => void;
  customBackground: { type: 'color' | 'gradient' | 'image' | ''; value: string };
  onSetBackground: (bg: string, type: 'color' | 'gradient' | 'image') => void;
  onResetBackground: () => void;
  onUploadBackground: (file: File) => void;
  showDateTime: boolean;
  onShowDateTimeChange: (val: boolean) => void;
}

const sampleVerse = {
  text: 'For God so loved the world, that he gave his only Son...',
  reference: 'John 3:16',
};

const BUILTIN_BACKGROUNDS = [
  { type: 'color', value: '#1a1a1a' },
  { type: 'color', value: '#f8fafc' },
  { type: 'color', value: '#38bdf8' },
  { type: 'gradient', value: 'linear-gradient(135deg, #38bdf8 0%, #818cf8 100%)' },
  { type: 'gradient', value: 'linear-gradient(135deg, #fbbf24 0%, #f472b6 100%)' },
  { type: 'image', value: '/images/1.jpg' },
  { type: 'image', value: '/images/2.jpg' },
  { type: 'image', value: '/images/3.jpg' },
];

const SettingsPanel: React.FC<SettingsPanelProps> = ({
  open,
  onClose,
  language,
  onLanguageChange,
  fontStyle,
  onFontStyleChange,
  voices,
  selectedVoice,
  onVoiceChange,
  theme,
  onThemeChange,
  customBackground,
  onSetBackground,
  onResetBackground,
  onUploadBackground,
  showDateTime,
  onShowDateTimeChange,
}) => {
  const [previewVoice, setPreviewVoice] = useState<string>(selectedVoice);

  const handleVoicePreview = () => {
    const utterance = new window.SpeechSynthesisUtterance(`${sampleVerse.text} - ${sampleVerse.reference}`);
    const voice = voices.find(v => v.voiceURI === previewVoice);
    if (voice) utterance.voice = voice;
    utterance.lang = voice?.lang || 'en';
    window.speechSynthesis.speak(utterance);
  };

  if (!open) return null;
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      background: 'rgba(0,0,0,0.45)',
      zIndex: 1000,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: '#fff',
        borderRadius: 12,
        padding: 32,
        minWidth: 340,
        maxWidth: 480,
        boxShadow: '0 8px 32px #0004',
        textAlign: 'left',
        position: 'relative',
      }}>
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, background: '#eee', border: 'none', fontSize: 26, cursor: 'pointer', color: '#333', borderRadius: '50%', width: 36, height: 36, lineHeight: '36px', fontWeight: 700 }} title="Close" aria-label="Close">×</button>
        <h2 style={{marginBottom: 18, textAlign: 'center'}}>Settings</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          <section>
            <div style={{ fontWeight: 600, fontSize: 16 }}>Background</div>
            <div style={{ color: '#666', fontSize: 13, marginBottom: 8 }}>Choose a background, upload your own, or use a random Unsplash image.</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 10 }}>
              {/* Built-in backgrounds */}
              {BUILTIN_BACKGROUNDS.map((bg, i) => (
                <button
                  key={i}
                  onClick={() => onSetBackground(bg.value, bg.type as 'color' | 'gradient' | 'image')}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 8,
                    border: customBackground.value === bg.value && customBackground.type === bg.type ? '2px solid #38bdf8' : '2px solid #e5e7eb',
                    background: bg.type === 'color' || bg.type === 'gradient' ? bg.value : undefined,
                    backgroundImage: bg.type === 'image' ? `url(${bg.value})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    cursor: 'pointer',
                    outline: 'none',
                  }}
                  title={bg.type === 'image' ? 'Sample Image' : bg.value}
                />
              ))}
              {/* Upload button */}
              <label style={{
                width: 48,
                height: 48,
                borderRadius: 8,
                border: '2px dashed #38bdf8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                background: '#f8fafc',
                color: '#38bdf8',
                fontWeight: 700,
                fontSize: 22,
              }} title="Upload Custom Image">
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={e => {
                    if (e.target.files && e.target.files[0]) {
                      const file = e.target.files[0];
                      const reader = new FileReader();
                      reader.onload = ev => {
                        if (ev.target?.result) {
                          onSetBackground(ev.target.result as string, 'image');
                        }
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                +
              </label>
              {/* Random/Unsplash */}
              <button
                onClick={onResetBackground}
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 8,
                  border: !customBackground.value ? '2px solid #38bdf8' : '2px solid #e5e7eb',
                  background: 'linear-gradient(135deg, #222 0%, #38bdf8 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 18,
                  cursor: 'pointer',
                  outline: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title="Random/Unsplash"
              >
                ?
              </button>
            </div>
            {customBackground.value && (
              <div style={{ fontSize: 13, color: '#38bdf8', marginTop: 2 }}>Custom background selected</div>
            )}
          </section>
          <section>
            <div style={{ fontWeight: 600, fontSize: 16 }}>Language</div>
            <div style={{ color: '#666', fontSize: 13, marginBottom: 6 }}>Choose the language for Bible verses and audio (if available).</div>
            <select value={language} onChange={e => onLanguageChange(e.target.value)} style={{ minWidth: 180, padding: 7, borderRadius: 6 }}>
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="hat">Haitian Creole</option>
              <option value="hau">Hausa</option>
              <option value="hbo">Hebrew (Ancient)</option>
              <option value="heb">Hebrew (Modern)</option>
              <option value="hi">Hindi</option>
              <option value="hrv">Croatian</option>
              <option value="hun">Hungarian</option>
              <option value="ibo">Igbo</option>
              <option value="ind">Indonesian</option>
              <option value="isl">Icelandic</option>
              <option value="ita">Italian</option>
              <option value="pol">Polish</option>
              <option value="por">Portuguese</option>
              <option value="swh">Swahili</option>
              <option value="vie">Vietnamese</option>
              <option value="yor">Yoruba</option>
              <option value="ukr">Ukrainian</option>
              <option value="lug">Luganda</option>
              <option value="lin">Lingala</option>
              <option value="nya">Chichewa</option>
              <option value="nob">Norwegian</option>
              <option value="sna">Shona</option>
              <option value="twi">Twi</option>
            </select>
          </section>
          <section>
            <div style={{ fontWeight: 600, fontSize: 16 }}>Font Style</div>
            <div style={{ color: '#666', fontSize: 13, marginBottom: 6 }}>Change the font used for displaying verses.</div>
            <select value={fontStyle} onChange={e => onFontStyleChange(e.target.value)} style={{ minWidth: 180, padding: 7, borderRadius: 6 }}>
              <option value="serif">Serif</option>
              <option value="sans-serif">Sans Serif</option>
              <option value="monospace">Monospace</option>
              <option value="cursive">Cursive</option>
            </select>
            <div style={{ marginTop: 10, background: '#f8fafc', borderRadius: 6, padding: 10, fontFamily: fontStyle, fontSize: 18, color: '#222', border: '1px solid #e5e7eb' }}>
              {sampleVerse.text}
            </div>
          </section>
          <section>
            <div style={{ fontWeight: 600, fontSize: 16 }}>Voice for AI Reading</div>
            <div style={{ color: '#666', fontSize: 13, marginBottom: 6 }}>Select a voice for text-to-speech. <span style={{ color: '#38bdf8', cursor: 'pointer', textDecoration: 'underline' }} onClick={handleVoicePreview}>Preview</span></div>
            <select value={selectedVoice} onChange={e => { onVoiceChange(e.target.value); setPreviewVoice(e.target.value); }} style={{ minWidth: 220, padding: 7, borderRadius: 6 }}>
              {voices.map(voice => (
                <option key={voice.voiceURI} value={voice.voiceURI}>
                  {voice.name} ({voice.lang})
                </option>
              ))}
            </select>
          </section>
          <section>
            <div style={{ fontWeight: 600, fontSize: 16 }}>Theme</div>
            <div style={{ color: '#666', fontSize: 13, marginBottom: 6 }}>Switch between minimal and full-featured layouts.</div>
            <select value={theme} onChange={e => onThemeChange(e.target.value)} style={{ minWidth: 180, padding: 7, borderRadius: 6 }}>
              <option value="minimal">Minimal</option>
              <option value="full">Full</option>
            </select>
          </section>
          <section>
            <div style={{ fontWeight: 600, fontSize: 16 }}>Date & Time</div>
            <div style={{ color: '#666', fontSize: 13, marginBottom: 6 }}>Show or hide the current date and time on the main screen.</div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 15, marginTop: 6 }}>
              <input
                type="checkbox"
                checked={showDateTime}
                onChange={e => onShowDateTimeChange(e.target.checked)}
                style={{ width: 18, height: 18 }}
              />
              Show date & time
            </label>
          </section>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel; 