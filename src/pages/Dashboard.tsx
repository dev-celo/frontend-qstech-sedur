import { useState, useEffect, useMemo, useCallback } from "react";
import { Loader2 } from "lucide-react";
import StatsCards from "@/components/StatsCards";
import { FilterBar } from "@/components/FilterBar";
import { KanbanColumn } from "@/components/KanbanColumn";
import { LoginButton } from "@/components/LoginButton";
import { ExtracaoButton } from "@/components/ExtracaoButton";
import { FirestoreButton } from "@/components/FirestoreButton";
import { DiagnosticButtons } from "@/components/DiagnosticButton";
import { HeroDashboard } from "@/components/HeroDashboard";
import {
  getProcessos,
  getUltimaAtualizacaoReal,
  getTodosProcessosCache,
  limparCache,
} from "@/services/processosService";
import type { FilterState, Processo } from "@/types";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { parseBRDate } from "@/utils/date";

// Função para formatar data ISO para padrão brasileiro
function formatarDataBR(dataISO: string): string {
  if (!dataISO) return "—";
  try {
    const data = new Date(dataISO);
    return data.toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dataISO;
  }
}

/**
 * 🔥 Função auxiliar para ordenar processos pela data da última tramitação
 */
function ordenarPorUltimaTramitacao(processos: Processo[]): Processo[] {
  return [...processos].sort((a, b) => {
    const dataA = a.ultima_tramitacao?.data || a.data;
    const dataB = b.ultima_tramitacao?.data || b.data;

    const getTimestamp = (dataStr: string): number => {
      if (!dataStr) return 0;
      const date = parseBRDate(dataStr);
      return date ? date.getTime() : 0;
    };

    return getTimestamp(dataB) - getTimestamp(dataA);
  });
}

export function Dashboard() {
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [todosProcessosCache, setTodosProcessosCache] = useState<Processo[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [extractionId, setExtractionId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState<number>(0);
  const [cacheInfo, setCacheInfo] = useState<{
    ativo: boolean;
    data: string | null;
  }>({
    ativo: false,
    data: null,
  });
  const [filters, setFilters] = useState<FilterState>({
    search: "",
    dateFrom: "",
    dateTo: "",
    status: "",
  });

  const carregarProcessos = useCallback(
    async (showLoading = true) => {
      if (showLoading) setLoading(true);
      try {
        const data = await getProcessos();
        const todos = getTodosProcessosCache();

        setTodosProcessosCache(todos);
        setProcessos(ordenarPorUltimaTramitacao(data));

        const atualizacao = await getUltimaAtualizacaoReal();

        const meta = localStorage.getItem("processos_meta_v3");
        if (meta) {
          const parsed = JSON.parse(meta);
          setCacheInfo({
            ativo: true,
            data: parsed.ultima_atualizacao
              ? formatarDataBR(parsed.ultima_atualizacao)
              : null,
          });
        } else {
          setCacheInfo({ ativo: false, data: null });
        }

        if (atualizacao) {
          setLastUpdate(formatarDataBR(atualizacao));
        } else if (cacheInfo.data) {
          setLastUpdate(cacheInfo.data);
        }

        console.log("📅 Última atualização:", atualizacao);
        console.log("📊 Processos carregados:", data.length);
        console.log("📊 Todos no cache:", todos.length);
      } catch (error) {
        console.error("Erro ao carregar processos:", error);
      } finally {
        if (showLoading) setLoading(false);
        setRefreshing(false);
      }
    },
    [cacheInfo.data]
  );

  useEffect(() => {
    carregarProcessos();
  }, [refreshKey, carregarProcessos]);

  const handleManualRefresh = useCallback(async () => {
    setRefreshing(true);
    await carregarProcessos(true);
  }, [carregarProcessos]);

  const handleExtracaoCompleta = (_dados: unknown, id: string) => {
    setExtractionId(id);
    const agora = new Date().toISOString();
    limparCache();
    setLastUpdate(formatarDataBR(agora));
    setCacheInfo({ ativo: false, data: null });
    carregarProcessos(false);
  };

  const handleFirestoreSuccess = () => {
    setRefreshKey((prev) => prev + 1);
  };

  // 🔥 FILTROS (sem loading, sem debounce duplicado)
  const filteredProcessos = useMemo(() => {
    const source = todosProcessosCache.length > 0 ? todosProcessosCache : processos;

    let resultado = [...source];

    // 🔥 FILTRO POR TEXTO
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      resultado = resultado.filter((p) => {
        return (
          p.protocolo?.toLowerCase().includes(searchLower) ||
          p.servico?.toLowerCase().includes(searchLower) ||
          p.empresa?.toLowerCase().includes(searchLower) ||
          p.estagio?.toLowerCase().includes(searchLower) ||
          p.cnpj_cpf?.toLowerCase().includes(searchLower) ||
          p.id?.toLowerCase().includes(searchLower)
        );
      });
    }

    // 🔥 FILTRO POR STATUS
    if (filters.status) {
      resultado = resultado.filter((p) => p.estagio === filters.status);
    }

    // 🔥 FILTRO POR DATA INICIAL
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      resultado = resultado.filter((p) => {
        const dataP = p.ultima_tramitacao?.data || p.data;
        const dataObj = parseBRDate(dataP);
        return dataObj && dataObj >= fromDate;
      });
    }

    // 🔥 FILTRO POR DATA FINAL
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      resultado = resultado.filter((p) => {
        const dataP = p.ultima_tramitacao?.data || p.data;
        const dataObj = parseBRDate(dataP);
        return dataObj && dataObj <= toDate;
      });
    }

    return ordenarPorUltimaTramitacao(resultado);
  }, [
    todosProcessosCache,
    processos,
    filters.search,
    filters.status,
    filters.dateFrom,
    filters.dateTo,
  ]);

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
  };

  return (
    <>
      <Header />
      
      {/* Container principal com gradientes premium e margens otimizadas */}
      <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100/30 overflow-hidden">
        
        {/* ========================================================= */}
        {/* CAMADA 1: GRADIENTES DE FUNDO (Profundidade)             */}
        {/* ========================================================= */}
        
        {/* Gradiente superior direito - turquesa translúcido */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-emerald-100/20 via-teal-100/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        {/* Gradiente inferior esquerdo - verde suave */}
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-gradient-to-tr from-teal-100/15 to-emerald-100/5 rounded-full blur-3xl pointer-events-none" />
        
        {/* Gradiente central - azul muito suave */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-100/5 rounded-full blur-3xl pointer-events-none" />

        {/* Grid técnico sutil (opacidade mínima) */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.012]"
          style={{
            backgroundImage: `
              linear-gradient(to right, #0F172A 1px, transparent 1px),
              linear-gradient(to bottom, #0F172A 1px, transparent 1px)
            `,
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(circle at center, black 40%, transparent 85%)',
            WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 85%)',
          }}
        />

        {/* ========================================================= */}
        {/* CAMADA 2: CONTEÚDO PRINCIPAL                            */}
        {/* ========================================================= */}
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
          
          {/* Hero Dashboard - Central de Monitoramento */}
          <HeroDashboard
            totalProcessos={todosProcessosCache.length}
            emAndamento={resumo.andamento}
            emConvite={resumo.convite}
            finalizados={resumo.finalizado}
            ultimaAtualizacao={lastUpdate}
            sessaoValida={true}
            movimentacoesHoje={filteredProcessos.filter(p => p.isRecente).length}
          />

          {/* ===================================================== */}
          {/* BARRA DE STATUS E AÇÕES (Refinada)                    */}
          {/* ===================================================== */}
          
          <div className="flex flex-wrap justify-between items-center gap-3 mb-6 bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-slate-100/80 shadow-sm">
            <div className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full animate-pulse ${
                  refreshing ? "bg-amber-500" : "bg-emerald-500"
                }`}
              />
              <div>
                <p className="text-xs text-slate-500 flex items-center gap-2">
                  Última atualização
                  {cacheInfo.ativo && (
                    <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">
                      Cache
                    </span>
                  )}
                  {refreshing && (
                    <span className="text-xs bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">
                      Atualizando...
                    </span>
                  )}
                </p>
                <p className="font-semibold text-slate-700 text-sm">
                  {lastUpdate || "—"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <DiagnosticButtons onRefreshComplete={handleManualRefresh} />
              <LoginButton onLoginSuccess={() => carregarProcessos()} />
              <ExtracaoButton onExtracaoComplete={handleExtracaoCompleta} />
              <FirestoreButton onSuccess={handleFirestoreSuccess} />
            </div>
          </div>

          {/* ===================================================== */}
          {/* STATS CARDS                                           */}
          {/* ===================================================== */}
          
          <StatsCards resumo={resumo} total={filteredProcessos.length} />

          {/* ===================================================== */}
          {/* FILTER BAR                                            */}
          {/* ===================================================== */}
          
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

          {/* ===================================================== */}
          {/* KANBAN COLUMNS                                        */}
          {/* ===================================================== */}
          
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-emerald-500" />
              <span className="ml-3 text-slate-500">
                Carregando processos...
              </span>
              {cacheInfo.ativo && (
                <p className="text-xs text-slate-400 ml-2">(usando cache)</p>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                <KanbanColumn
                  title="Em Andamento"
                  count={andamento.length}
                  processos={ordenarPorUltimaTramitacao(andamento)}
                  type="andamento"
                  index={0}
                />
                <KanbanColumn
                  title="Em Convite"
                  count={convite.length}
                  processos={ordenarPorUltimaTramitacao(convite)}
                  type="convite"
                  index={1}
                />
                <KanbanColumn
                  title="Finalizados"
                  count={finalizados.length}
                  processos={ordenarPorUltimaTramitacao(finalizados)}
                  type="finalizado"
                  index={2}
                />
              </div>

              {/* ===================================================== */}
              {/* RODAPÉ DE ESTATÍSTICAS                                */}
              {/* ===================================================== */}
              
              <div className="mt-8 text-center text-xs text-slate-400 bg-white/50 backdrop-blur-sm p-3 rounded-lg border border-slate-100/60">
                <p>
                  📊 Total no cache: {todosProcessosCache.length} processos •
                  Exibindo: {filteredProcessos.length} • Andamento:{" "}
                  {resumo.andamento} • Convite: {resumo.convite} • Finalizados:{" "}
                  {resumo.finalizado}
                </p>
                {extractionId && (
                  <p className="text-emerald-500 mt-1 text-[11px]">
                    ✅ Última extração: {extractionId.slice(-8)}
                  </p>
                )}
                {cacheInfo.ativo && cacheInfo.data && (
                  <p className="text-blue-500 mt-1 text-[10px]">
                    💾 Cache: {cacheInfo.data} • 0 leituras no Firestore
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      
      <Footer />
    </>
  );
}