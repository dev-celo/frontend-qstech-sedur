import { useState, useEffect, useMemo, useRef } from "react";
import { StatsCards } from "@/components/StatsCards";
import { FilterBar } from "@/components/FilterBar";
import { KanbanColumn } from "@/components/KanbanColumn";
import { UpdateButton } from "@/components/UpdateButton";
import { getProcessos } from "@/services/processosService";
import type { FilterState, Processo } from "@/types";
import gsap from "gsap";

export function Dashboard() {

  const [processos, setProcessos] = useState<Processo[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>("");

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    dateFrom: "",
    dateTo: "",
    status: "",
  });

  const heroRef = useRef<HTMLDivElement>(null);

  // animação
  useEffect(() => {
    if (heroRef.current) {
      gsap.fromTo(
        heroRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }
      );
    }
  }, []);

  // carregar dados do firestore
  const carregarProcessos = async () => {
    const data = await getProcessos();
    setProcessos(data);
    setLastUpdate(new Date().toISOString());
  };

  useEffect(() => {
    carregarProcessos();
  }, []);

  const handleUpdate = () => {
    carregarProcessos();
  };

  const handleClearFilters = () => {
    setFilters({
      search: "",
      dateFrom: "",
      dateTo: "",
      status: "",
    });
  };

  // parse data brasileira
  const parseDate = (dateStr: string): Date | null => {
    const parts = dateStr.split("/");
    if (parts.length === 3) {
      return new Date(
        parseInt(parts[2]),
        parseInt(parts[1]) - 1,
        parseInt(parts[0])
      );
    }
    return null;
  };

  // filtros
  const filteredProcessos = useMemo(() => {
    return processos.filter((processo: Processo) => {

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();

        const matchesSearch =
          processo.protocolo?.toLowerCase().includes(searchLower) ||
          processo.servico?.toLowerCase().includes(searchLower) ||
          processo.estagio?.toLowerCase().includes(searchLower) ||
          processo.empresa?.toLowerCase().includes(searchLower);

        if (!matchesSearch) return false;
      }

      if (filters.status && processo.estagio !== filters.status) {
        return false;
      }

      if (filters.dateFrom || filters.dateTo) {
        const processDate = parseDate(processo.data);
        if (!processDate) return true;

        if (filters.dateFrom) {
          const fromDate = new Date(filters.dateFrom);
          if (processDate < fromDate) return false;
        }

        if (filters.dateTo) {
          const toDate = new Date(filters.dateTo);
          toDate.setHours(23, 59, 59, 999);
          if (processDate > toDate) return false;
        }
      }

      return true;
    });
  }, [processos, filters]);

  // agrupamento
  const processosPorAba = useMemo(() => {
    return {
      andamento: filteredProcessos.filter((p) => p.aba === "andamento"),
      convite: filteredProcessos.filter((p) => p.aba === "convite"),
      finalizado: filteredProcessos.filter((p) => p.aba === "finalizado"),
    };
  }, [filteredProcessos]);

  const filteredResumo = useMemo(
    () => ({
      andamento: processosPorAba.andamento.length,
      convite: processosPorAba.convite.length,
      finalizado: processosPorAba.finalizado.length,
    }),
    [processosPorAba]
  );

  return (
    <div className="min-h-screen bg-[#f5f7fa]">
      <div ref={heroRef} className="pt-28 pb-8 px-4 sm:px-6 lg:px-8">

        <div className="max-w-7xl mx-auto">

          {/* HEADER */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-[#2c3e50] mb-2">
                Dashboard de Processos
              </h1>

              <p className="text-[#7f8c8d]">
                Visão geral dos processos ambientais capturados na plataforma Sedur
              </p>
            </div>

            <UpdateButton
              lastUpdate={lastUpdate}
              onUpdate={handleUpdate}
            />

          </div>

          {/* STATS */}
          <StatsCards
            resumo={filteredResumo}
            total={filteredProcessos.length}
          />

          {/* FILTROS */}
          <FilterBar
            filters={filters}
            onFilterChange={setFilters}
            onClearFilters={handleClearFilters}
          />

          {/* KANBAN */}
          <div className="overflow-x-auto pb-4 -mx-4 px-4">

            <div className="flex gap-6 min-w-fit">

              <KanbanColumn
                title="Em Andamento"
                count={processosPorAba.andamento.length}
                processos={processosPorAba.andamento}
                type="andamento"
                index={0}
              />

              <KanbanColumn
                title="Em Convite"
                count={processosPorAba.convite.length}
                processos={processosPorAba.convite}
                type="convite"
                index={1}
              />

              <KanbanColumn
                title="Finalizados"
                count={processosPorAba.finalizado.length}
                processos={processosPorAba.finalizado}
                type="finalizado"
                index={2}
              />

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}