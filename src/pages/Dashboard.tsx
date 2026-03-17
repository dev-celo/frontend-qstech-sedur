import { useState, useEffect, useMemo } from "react";
import StatsCards from "@/components/StatsCards";
import { FilterBar } from "@/components/FilterBar";
import { KanbanColumn } from "@/components/KanbanColumn";
import { UpdateButton } from "@/components/UpdateButton";
import { HeroDashboard } from "@/components/HeroDashboard";
import { getProcessos, getUltimaAtualizacaoReal } from "@/services/processosService";
import type { FilterState, Processo } from "@/types";

export function Dashboard() {
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    dateFrom: "",
    dateTo: "",
    status: "",
  });

  const carregarProcessos = async () => {
    setLoading(true);
    try {
      const [data, atualizacao] = await Promise.all([
        getProcessos(),
        getUltimaAtualizacaoReal(),
      ]);

      setProcessos(data);
      setLastUpdate(atualizacao);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarProcessos();
  }, []);

  const filteredProcessos = useMemo(() => {
    return processos.filter((p) => {
      if (filters.search) {
        const s = filters.search.toLowerCase();
        return (
          p.protocolo?.toLowerCase().includes(s) ||
          p.servico?.toLowerCase().includes(s) ||
          p.empresa?.toLowerCase().includes(s)
        );
      }
      return true;
    });
  }, [processos, filters]);

  const { andamento, convite, finalizados } = useMemo(() => {
    const r = {
      andamento: [] as Processo[],
      convite: [] as Processo[],
      finalizados: [] as Processo[],
    };

    for (const p of filteredProcessos) {
      if (p.aba === "andamento") r.andamento.push(p);
      else if (p.aba === "convite") r.convite.push(p);
      else r.finalizados.push(p);
    }

    return r;
  }, [filteredProcessos]);

  const resumo = {
    andamento: andamento.length,
    convite: convite.length,
    finalizado: finalizados.length,
    total_recentes: andamento.length + convite.length,
  };

  return (
    <div className="min-h-screen bg-[#f5f7fa] pt-[110px] md:pt-[130px] px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* HERO */}
        <HeroDashboard />

        {/* HEADER INTERNO */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <p className="text-sm text-gray-500">
              Última atualização real:
            </p>
            <p className="font-semibold text-green-600">
              {lastUpdate || "—"}
            </p>
          </div>

          <UpdateButton
            lastUpdate={lastUpdate}
            onUpdate={carregarProcessos}
            loading={loading}
          />
        </div>

        <StatsCards resumo={resumo} total={resumo.total_recentes} />

        <FilterBar
          filters={filters}
          onFilterChange={setFilters}
          onClearFilters={() =>
            setFilters({
              search: "",
              dateFrom: "",
              dateTo: "",
              status: "",
            })
          }
        />

        {/* KANBAN */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <KanbanColumn title="Andamento" count={andamento.length} processos={andamento} type="andamento" index={0} />
          <KanbanColumn title="Convite" count={convite.length} processos={convite} type="convite" index={1} />
          <KanbanColumn title="Finalizados" count={finalizados.length} processos={finalizados} type="finalizado" index={2} />
        </div>
      </div>
    </div>
  );
}