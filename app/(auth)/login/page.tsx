"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2, GraduationCap, ChevronRight, Shield, User } from "lucide-react"
import { toast } from "sonner"

type Tipo = "funcionario" | "admin"

export default function LoginPage() {
  const router = useRouter()
  const [tipo, setTipo] = useState<Tipo>("funcionario")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [showSenha, setShowSenha] = useState(false)
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await signIn("credentials", {
        email,
        senha,
        tipo,
        redirect: false,
      })
      if (result?.error) {
        toast.error("Credenciais inválidas. Verifique e tente novamente.")
      } else {
        toast.success("Acesso autorizado.")
        router.push("/")
        router.refresh()
      }
    } catch {
      toast.error("Erro de conexão. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&display=swap');

        .login-root {
          min-height: 100svh;
          display: flex;
          background: #0d0604;
          font-family: 'Syne', sans-serif;
          overflow: hidden;
          position: relative;
        }

        /* Grid background */
        .login-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(180,40,20,0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(180,40,20,0.07) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
        }

        /* Red glow top-left */
        .glow-tl {
          position: absolute;
          top: -120px;
          left: -120px;
          width: 480px;
          height: 480px;
          background: radial-gradient(circle, rgba(190,30,15,0.25) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Red glow bottom-right */
        .glow-br {
          position: absolute;
          bottom: -80px;
          right: -80px;
          width: 320px;
          height: 320px;
          background: radial-gradient(circle, rgba(190,30,15,0.15) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Left panel */
        .left-panel {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 46%;
          padding: 56px 64px;
          border-right: 1px solid rgba(180,40,20,0.2);
          position: relative;
          z-index: 1;
        }

        @media (min-width: 1024px) {
          .left-panel { display: flex; }
        }

        .left-brand {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .brand-icon {
          width: 48px;
          height: 48px;
          background: #b01a0e;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 32px rgba(190,30,15,0.5);
        }

        .brand-name {
          font-size: 22px;
          font-weight: 800;
          color: #f5f0ef;
          letter-spacing: -0.5px;
        }

        .brand-sub {
          font-size: 12px;
          font-weight: 400;
          color: rgba(245,240,239,0.4);
          letter-spacing: 2px;
          text-transform: uppercase;
          font-family: 'DM Mono', monospace;
        }

        .left-center {
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 32px;
        }

        .left-headline {
          font-size: clamp(36px, 4vw, 52px);
          font-weight: 800;
          color: #f5f0ef;
          line-height: 1.1;
          letter-spacing: -1.5px;
        }

        .left-headline span {
          color: #c0392b;
        }

        .left-desc {
          font-size: 15px;
          color: rgba(245,240,239,0.45);
          line-height: 1.7;
          max-width: 360px;
          font-weight: 400;
        }

        .left-stats {
          display: flex;
          gap: 32px;
        }

        .stat-item {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .stat-num {
          font-size: 28px;
          font-weight: 800;
          color: #f5f0ef;
          letter-spacing: -1px;
        }

        .stat-label {
          font-size: 11px;
          color: rgba(245,240,239,0.35);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-family: 'DM Mono', monospace;
        }

        .left-footer {
          font-size: 11px;
          color: rgba(245,240,239,0.2);
          font-family: 'DM Mono', monospace;
          letter-spacing: 1px;
        }

        /* Separator line animated */
        .v-line {
          position: absolute;
          right: -1px;
          top: 10%;
          height: 80%;
          width: 1px;
          background: linear-gradient(to bottom, transparent, rgba(192,57,43,0.7) 30%, rgba(192,57,43,0.7) 70%, transparent);
        }

        /* Right panel */
        .right-panel {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 24px;
          position: relative;
          z-index: 1;
        }

        /* Mobile brand */
        .mobile-brand {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 40px;
        }
        @media (min-width: 1024px) {
          .mobile-brand { display: none; }
        }

        .form-card {
          width: 100%;
          max-width: 420px;
          opacity: ${mounted ? 1 : 0};
          transform: translateY(${mounted ? 0 : '16px'});
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .form-title {
          font-size: 26px;
          font-weight: 800;
          color: #f5f0ef;
          letter-spacing: -0.8px;
          margin-bottom: 4px;
        }

        .form-subtitle {
          font-size: 13px;
          color: rgba(245,240,239,0.4);
          margin-bottom: 32px;
          font-family: 'DM Mono', monospace;
        }

        /* Type switcher */
        .type-switcher {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-bottom: 32px;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.07);
          border-radius: 10px;
          padding: 4px;
        }

        .type-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 7px;
          border: none;
          cursor: pointer;
          font-family: 'Syne', sans-serif;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.2px;
          transition: all 0.2s ease;
          color: rgba(245,240,239,0.4);
          background: transparent;
        }

        .type-btn.active {
          background: #c0392b;
          color: #fff;
          box-shadow: 0 2px 16px rgba(192,57,43,0.4);
        }

        .type-btn:not(.active):hover {
          color: rgba(245,240,239,0.8);
          background: rgba(255,255,255,0.06);
        }

        /* Form fields */
        .field-group {
          display: flex;
          flex-direction: column;
          gap: 16px;
          margin-bottom: 24px;
        }

        .field-wrap {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .field-label {
          font-size: 11px;
          font-weight: 600;
          color: rgba(245,240,239,0.5);
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-family: 'DM Mono', monospace;
        }

        .field-input-wrap {
          position: relative;
        }

        .field-input {
          width: 100%;
          height: 48px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 10px;
          padding: 0 44px 0 16px;
          font-size: 14px;
          font-family: 'Syne', sans-serif;
          color: #f5f0ef;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }

        .field-input::placeholder {
          color: rgba(245,240,239,0.2);
        }

        .field-input:focus {
          border-color: rgba(192,57,43,0.7);
          background: rgba(192,57,43,0.06);
          box-shadow: 0 0 0 3px rgba(192,57,43,0.12);
        }

        .field-eye {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(245,240,239,0.3);
          padding: 0;
          display: flex;
          align-items: center;
          transition: color 0.2s;
        }

        .field-eye:hover {
          color: rgba(245,240,239,0.7);
        }

        /* Submit button */
        .submit-btn {
          width: 100%;
          height: 50px;
          background: #c0392b;
          border: none;
          border-radius: 10px;
          font-family: 'Syne', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #fff;
          letter-spacing: 0.5px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: background 0.2s, box-shadow 0.2s, transform 0.1s;
          box-shadow: 0 4px 24px rgba(192,57,43,0.35);
        }

        .submit-btn:hover:not(:disabled) {
          background: #a93226;
          box-shadow: 0 6px 32px rgba(192,57,43,0.5);
          transform: translateY(-1px);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        /* Security badge */
        .security-badge {
          margin-top: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 11px;
          color: rgba(245,240,239,0.2);
          font-family: 'DM Mono', monospace;
          letter-spacing: 0.5px;
        }

        /* Scan lines effect */
        .scanlines {
          position: fixed;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.03) 2px,
            rgba(0,0,0,0.03) 4px
          );
          pointer-events: none;
          z-index: 0;
        }
      `}</style>

      <div className="login-root">
        <div className="scanlines" />
        <div className="glow-tl" />
        <div className="glow-br" />

        {/* LEFT PANEL */}
        <div className="left-panel">
          <div className="left-brand">
            <div className="brand-icon">
              <GraduationCap size={24} color="#fff" />
            </div>
            <div>
              <div className="brand-name">SABO</div>
              <div className="brand-sub">Treinamentos</div>
            </div>
          </div>

          <div className="left-center">
            <div>
              <div className="left-headline">
                Capacite.<br />
                <span>Evolua.</span><br />
                Certifique.
              </div>
            </div>
            <p className="left-desc">
              Plataforma corporativa de treinamentos e certificações da SABO. Acesso restrito a colaboradores e administradores.
            </p>
            <div className="left-stats">
              <div className="stat-item">
                <div className="stat-num">5+</div>
                <div className="stat-label">Módulos</div>
              </div>
              <div className="stat-item">
                <div className="stat-num">100%</div>
                <div className="stat-label">Online</div>
              </div>
              <div className="stat-item">
                <div className="stat-num">24/7</div>
                <div className="stat-label">Disponível</div>
              </div>
            </div>
          </div>

          <div className="left-footer">© 2026 SABO · v1.0 · SISTEMA INTERNO</div>
          <div className="v-line" />
        </div>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          {/* Mobile brand */}
          <div className="mobile-brand">
            <div className="brand-icon">
              <GraduationCap size={22} color="#fff" />
            </div>
            <div>
              <div className="brand-name">SABO</div>
            </div>
          </div>

          <div className="form-card">
            <div className="form-title">Acesse o portal</div>
            <div className="form-subtitle">// autenticação segura</div>

            {/* Tipo switcher */}
            <div className="type-switcher">
              <button
                type="button"
                className={`type-btn ${tipo === "funcionario" ? "active" : ""}`}
                onClick={() => setTipo("funcionario")}
              >
                <User size={14} />
                Funcionário
              </button>
              <button
                type="button"
                className={`type-btn ${tipo === "admin" ? "active" : ""}`}
                onClick={() => setTipo("admin")}
              >
                <Shield size={14} />
                Administrador
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="field-group">
                <div className="field-wrap">
                  <label className="field-label">E-mail</label>
                  <div className="field-input-wrap">
                    <input
                      className="field-input"
                      type="email"
                      placeholder={tipo === "funcionario" ? "nome@sabo.com.br" : "admin@sabo.com.br"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      autoComplete="email"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="field-wrap">
                  <label className="field-label">Senha</label>
                  <div className="field-input-wrap">
                    <input
                      className="field-input"
                      type={showSenha ? "text" : "password"}
                      placeholder="••••••••"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      required
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      className="field-eye"
                      onClick={() => setShowSenha(!showSenha)}
                      tabIndex={-1}
                    >
                      {showSenha ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? (
                  <><Loader2 size={16} className="animate-spin" /> Verificando acesso...</>
                ) : (
                  <>Entrar <ChevronRight size={16} /></>
                )}
              </button>
            </form>

            <div className="security-badge">
              <Shield size={11} />
              Conexão segura · Sessão criptografada
            </div>
          </div>
        </div>
      </div>
    </>
  )
}