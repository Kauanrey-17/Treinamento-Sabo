import { CardModulo } from "@/components/card-modulo"
import { modulos } from "@/lib/modulos-data"

export default function ModulosPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Modulos do Treinamento
        </h1>
        <p className="mt-1 text-muted-foreground leading-relaxed">
          Navegue pelos 4 modulos e complete cada etapa do treinamento.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {modulos.map((m) => (
          <CardModulo key={m.id} modulo={m} />
        ))}
      </div>
    </div>
  )
}
