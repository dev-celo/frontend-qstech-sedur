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
import { getProcessos, getUltimaAtualizacaoReal, getTodosProcessosCache, limparCache } from "@/services/processosService";
import type { FilterState, Processo } from "@/types";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { parseBRDate } from "@/utils/date";

// Função para formatar data ISO para padrão brasileiro
function formatarDataBR(dataISO: string): string {
  if (!dataISO) return "—";
  try {
    const data = new Date(dataISO);
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
  const [cacheInfo, setCacheInfo] = useState<{ ativo: boolean; data: string | null }>({
    ativo: false,
    data: null
  });

  const [filters, setFilters] = useState<FilterState>({
    search: "",
    dateFrom: "",
    dateTo: "",
    status: "",
  });

  // 🔥 NOVO: Estado para controlar loading dos filtros
  const [filtering, setFiltering] = useState(false);

  // 🔥 NOVO: Debounce para o loading dos filtros
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  // 🔥 Atualiza o debounce dos filtros
  useEffect(() => {
    setFiltering(true);
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
      setFiltering(false);
    }, 150);
    return () => clearTimeout(timer);
  }, [filters]);

  const carregarProcessos = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const data = await getProcessos();
      const todos = getTodosProcessosCache();
      
      setTodosProcessosCache(todos);
      setProcessos(ordenarPorUltimaTramitacao(data));
      
      const atualizacao = await getUltimaAtualizacaoReal();
      
      const meta = localStorage.getItem('processos_meta_v3');
      if (meta) {
        const parsed = JSON.parse(meta);
        setCacheInfo({
          ativo: true,
          data: parsed.ultima_atualizacao ? formatarDataBR(parsed.ultima_atualizacao) : null
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
  }, [cacheInfo.data]);

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
    setRefreshKey(prev => prev + 1);
  };

  // 🔥 FILTROS usando debouncedFilters (para evitar loading a cada tecla)
  const filteredProcessos = useMemo(() => {
    const source = todosProcessosCache.length > 0 ? todosProcessosCache : processos;
    
    let resultado = [...source];
    
    // 🔥 FILTRO POR TEXTO
    if (debouncedFilters.search) {
      const searchLower = debouncedFilters.search.toLowerCase();
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
    if (debouncedFilters.status) {
      resultado = resultado.filter(p => p.estagio === debouncedFilters.status);
    }
    
    // 🔥 FILTRO POR DATA INICIAL
    if (debouncedFilters.dateFrom) {
      const fromDate = new Date(debouncedFilters.dateFrom);
      fromDate.setHours(0, 0, 0, 0);
      resultado = resultado.filter(p => {
        const dataP = p.ultima_tramitacao?.data || p.data;
        const dataObj = parseBRDate(dataP);
        return dataObj && dataObj >= fromDate;
      });
    }
    
    // 🔥 FILTRO POR DATA FINAL
    if (debouncedFilters.dateTo) {
      const toDate = new Date(debouncedFilters.dateTo);
      toDate.setHours(23, 59, 59, 999);
      resultado = resultado.filter(p => {
        const dataP = p.ultima_tramitacao?.data || p.data;
        const dataObj = parseBRDate(dataP);
        return dataObj && dataObj <= toDate;
      });
    }
    
    return ordenarPorUltimaTramitacao(resultado);
  }, [todosProcessosCache, processos, debouncedFilters]);

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

  // 🔥 Verifica se está carregando ou filtrando
  const isLoading = loading || filtering;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-[110px] md:pt-[130px] px-4">
        <div className="max-w-7xl mx-auto">
          
          <HeroDashboard />

          <div className="flex flex-wrap justify-between items-center gap-3 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full animate-pulse ${
                refreshing ? 'bg-yellow-500' : 'bg-green-500'
              }`} />
              <div>
                <p className="text-xs text-gray-500 flex items-center gap-2">
                  Última atualização
                  {cacheInfo.ativo && (
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                      Cache
                    </span>
                  )}
                  {refreshing && (
                    <span className="text-xs bg-yellow-100 text-yellow-600 px-2 py-0.5 rounded-full">
                      Atualizando...
                    </span>
                  )}
                </p>
                <p className="font-semibold text-green-600">
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

          <StatsCards resumo={resumo} total={filteredProcessos.length} />

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

          {/* 🔥 LOADING SMOOTH - não pisca mais */}
          {isLoading ? (
            <div className="flex justify-center items-center py-20 transition-opacity duration-300">
              <Loader2 className="w-8 h-8 animate-spin text-green-600" />
              <span className="ml-3 text-gray-500">
                {loading ? "Carregando processos..." : "Aplicando filtros..."}
              </span>
              {cacheInfo.ativo && (
                <p className="text-xs text-gray-400 ml-2">
                  (usando cache)
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 transition-opacity duration-300">
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

              <div className="mt-6 text-center text-xs text-gray-400 bg-white p-3 rounded-lg shadow-sm mb-6">
                <p>
                  📊 Total no cache: {todosProcessosCache.length} processos • 
                  Exibindo: {filteredProcessos.length} • 
                  Andamento: {resumo.andamento} • 
                  Convite: {resumo.convite} • 
                  Finalizados: {resumo.finalizado}
                </p>
                {extractionId && (
                  <p className="text-green-500 mt-1">
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