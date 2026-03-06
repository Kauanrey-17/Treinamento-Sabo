"use client"

import { useState, useEffect, useRef } from "react"
import { signIn } from "next-auth/react"
import { Eye, EyeOff, AlertCircle, ShieldCheck, ArrowRight, Lock } from "lucide-react"
import { toast } from "sonner"

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [tipo, setTipo] = useState<"admin" | "funcionario">("funcionario")
  const [erro, setErro] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [capsLock, setCapsLock] = useState(false)
  const [lembrar, setLembrar] = useState(false)
  const [tentativas, setTentativas] = useState(0)
  const [bloqueado, setBloqueado] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [animIn, setAnimIn] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    setTimeout(() => setAnimIn(true), 50)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [])

  useEffect(() => {
    if (tentativas >= 5) {
      setBloqueado(true)
      setCountdown(30)
      setErro("")
      timerRef.current = setInterval(() => {
        setCountdown((c) => {
          if (c <= 1) {
            clearInterval(timerRef.current!)
            setBloqueado(false)
            setTentativas(0)
            return 0
          }
          return c - 1
        })
      }, 1000)
    }
  }, [tentativas])

  function handleCapsLock(e: React.KeyboardEvent) {
    setCapsLock(e.getModifierState("CapsLock"))
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (bloqueado) return
    setLoading(true)
    setErro("")

    const res = await signIn("credentials", {
      email,
      senha,
      tipo,
      redirect: false,
    })

    setLoading(false)

    if (res?.ok) {
      toast.success("Acesso autorizado!")
      window.location.href = tipo === "admin" ? "/admin" : "/"
    } else {
      const novasTentativas = tentativas + 1
      setTentativas(novasTentativas)
      setSenha("")
      if (novasTentativas >= 5) {
        setErro("")
      } else {
        const restantes = 5 - novasTentativas
        setErro(
          restantes === 1
            ? "Credenciais inválidas. Mais 1 tentativa antes do bloqueio."
            : `Credenciais inválidas. ${restantes} tentativas restantes.`
        )
      }
    }
  }

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-[#0d0d0d]">

      {/* ── PAINEL ESQUERDO ─────────────────────────────────────── */}
      <div className="relative hidden lg:flex lg:w-[52%] flex-col justify-between p-12 overflow-hidden">

        {/* Fundo geométrico animado */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#8b0000] via-[#c0392b] to-[#e74c3c]" />

        {/* Grid de pontos */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Formas geométricas decorativas */}
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full border border-white/10" />
        <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full border border-white/10" />
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/40 to-transparent" />
        <div className="absolute top-1/2 -right-20 w-72 h-72 rotate-45 border border-white/5" />
        <div className="absolute top-1/3 -right-10 w-48 h-48 rotate-12 border border-white/5" />

        {/* Linhas diagonais */}
        <svg className="absolute inset-0 w-full h-full opacity-5" xmlns="http://www.w3.org/2000/svg">
          <line x1="0" y1="100%" x2="100%" y2="0" stroke="white" strokeWidth="1" />
          <line x1="0" y1="80%" x2="80%" y2="0" stroke="white" strokeWidth="1" />
          <line x1="0" y1="60%" x2="60%" y2="0" stroke="white" strokeWidth="1" />
        </svg>

        {/* Logo */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
              <span className="text-white font-black text-lg tracking-tighter">S</span>
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-none tracking-wide">SABO</p>
              <p className="text-white/60 text-xs tracking-widest uppercase">Treinamentos</p>
            </div>
          </div>
        </div>

        {/* Conteúdo central */}
        <div className="relative z-10 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-1.5 backdrop-blur-sm">
              <div className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              <span className="text-white/80 text-xs tracking-widest uppercase font-medium">Sistema Ativo</span>
            </div>
            <h1 className="text-5xl font-black text-white leading-[1.05] tracking-tight">
              Portal de<br />
              <span className="text-white/40">Treinamento</span><br />
              Corporativo
            </h1>
            <p className="text-white/60 text-base leading-relaxed max-w-xs">
              Plataforma centralizada para gestão de conhecimento e capacitação da equipe SABO.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { valor: "4", label: "Módulos" },
              { valor: "100%", label: "Digital" },
              { valor: "24/7", label: "Disponível" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-white/10 border border-white/10 p-4 backdrop-blur-sm">
                <p className="text-white font-black text-2xl">{s.valor}</p>
                <p className="text-white/50 text-xs mt-1 uppercase tracking-wider">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Rodapé esquerdo */}
        <div className="relative z-10">
          <p className="text-white/30 text-xs">
            SABO Indústria e Comércio de Autopeças S.A. · v1.0
          </p>
        </div>
      </div>

      {/* ── PAINEL DIREITO ──────────────────────────────────────── */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 lg:p-12 bg-[#111111]">

        {/* Logo mobile */}
        <div className="lg:hidden mb-10 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c0392b]">
            <span className="text-white font-black text-base">S</span>
          </div>
          <div>
            <p className="text-white font-bold tracking-wide">SABO</p>
            <p className="text-white/40 text-xs tracking-widest uppercase">Treinamentos</p>
          </div>
        </div>

        <div
          className="w-full max-w-[400px] space-y-7"
          style={{
            opacity: animIn ? 1 : 0,
            transform: animIn ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          {/* Cabeçalho */}
          <div className="space-y-1">
            <h2 className="text-2xl font-black text-white tracking-tight">Acesse sua conta</h2>
            <p className="text-white/40 text-sm">Insira suas credenciais para continuar</p>
          </div>

          {/* Toggle de tipo */}
          <div className="relative flex rounded-xl bg-white/5 border border-white/10 p-1">
            <div
              className="absolute top-1 bottom-1 rounded-lg bg-[#c0392b] transition-all duration-300"
              style={{
                left: tipo === "funcionario" ? "4px" : "calc(50% + 0px)",
                width: "calc(50% - 4px)",
              }}
            />
            {(["funcionario", "admin"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => { setTipo(t); setErro("") }}
                className="relative z-10 flex-1 py-2 text-sm font-semibold transition-colors duration-200"
                style={{ color: tipo === t ? "white" : "rgba(255,255,255,0.35)" }}
              >
                {t === "funcionario" ? "Funcionário" : "Administrador"}
              </button>
            ))}
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Erro */}
            {erro && (
              <div
                className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4"
                style={{ animation: "shake 0.4s ease" }}
              >
                <AlertCircle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                <p className="text-sm text-red-400 leading-relaxed">{erro}</p>
              </div>
            )}

            {/* Bloqueio */}
            {bloqueado && (
              <div className="flex items-start gap-3 rounded-xl border border-orange-500/30 bg-orange-500/10 p-4">
                <Lock className="h-4 w-4 text-orange-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-orange-400 font-semibold">Acesso temporariamente bloqueado</p>
                  <p className="text-xs text-orange-400/70 mt-0.5">Tente novamente em {countdown}s</p>
                </div>
              </div>
            )}

            {/* Campo e-mail */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-widest">
                E-mail corporativo
              </label>
              <div
                className="relative rounded-xl border transition-all duration-200"
                style={{
                  borderColor: focusedField === "email" ? "#c0392b" : "rgba(255,255,255,0.08)",
                  background: focusedField === "email" ? "rgba(192,57,43,0.05)" : "rgba(255,255,255,0.03)",
                }}
              >
                <input
                  type="email"
                  name="email"
                  placeholder="seu.nome@sabo.com.br"
                  required
                  autoComplete="off"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setErro("") }}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  disabled={bloqueado}
                  className="w-full bg-transparent px-4 py-3.5 text-sm text-white placeholder:text-white/20 outline-none rounded-xl disabled:opacity-40"
                />
              </div>
            </div>

            {/* Campo senha */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-white/50 uppercase tracking-widest">
                Senha
              </label>
              <div
                className="relative rounded-xl border transition-all duration-200"
                style={{
                  borderColor: focusedField === "senha" ? "#c0392b" : "rgba(255,255,255,0.08)",
                  background: focusedField === "senha" ? "rgba(192,57,43,0.05)" : "rgba(255,255,255,0.03)",
                }}
              >
                <input
                  type={mostrarSenha ? "text" : "password"}
                  name="senha"
                  placeholder="••••••••"
                  required
                  autoComplete="off"
                  value={senha}
                  onChange={(e) => { setSenha(e.target.value); setErro("") }}
                  onFocus={() => setFocusedField("senha")}
                  onBlur={() => setFocusedField(null)}
                  onKeyUp={handleCapsLock}
                  disabled={bloqueado}
                  className="w-full bg-transparent px-4 py-3.5 pr-12 text-sm text-white placeholder:text-white/20 outline-none rounded-xl disabled:opacity-40"
                />
                <button
                  type="button"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors p-1"
                  tabIndex={-1}
                >
                  {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {/* Caps Lock */}
              {capsLock && (
                <p className="text-xs text-yellow-400/80 flex items-center gap-1.5">
                  <span>⇪</span> Caps Lock ativado
                </p>
              )}
            </div>

            {/* Lembrar + Esqueci */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div
                  onClick={() => setLembrar(!lembrar)}
                  className="relative h-4 w-4 rounded border transition-all duration-200 flex items-center justify-center cursor-pointer"
                  style={{
                    borderColor: lembrar ? "#c0392b" : "rgba(255,255,255,0.2)",
                    background: lembrar ? "#c0392b" : "transparent",
                  }}
                >
                  {lembrar && (
                    <svg className="h-2.5 w-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </div>
                <span className="text-xs text-white/40 group-hover:text-white/60 transition-colors">Manter conectado</span>
              </label>
              <button
                type="button"
                className="text-xs text-white/30 hover:text-[#c0392b] transition-colors"
                onClick={() => toast.info("Entre em contato com o administrador para redefinir sua senha.")}
              >
                Esqueci minha senha
              </button>
            </div>

            {/* Botão */}
            <button
              type="submit"
              disabled={loading || bloqueado}
              className="relative w-full overflow-hidden rounded-xl py-3.5 text-sm font-bold text-white transition-all duration-200 disabled:opacity-50 group"
              style={{ background: "linear-gradient(135deg, #c0392b, #e74c3c)" }}
            >
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-all duration-200" />
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Verificando...
                  </>
                ) : (
                  <>
                    Entrar
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Rodapé segurança */}
          <div className="flex items-center justify-center gap-2 pt-2">
            <ShieldCheck className="h-3.5 w-3.5 text-white/20" />
            <p className="text-xs text-white/20">
              Conexão criptografada · Dados protegidos
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  )
}