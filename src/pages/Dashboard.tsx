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
import { getProcessos, getUltimaAtualizacaoReal } from "@/services/processosService";
import type { FilterState, Processo } from "@/types";

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
      minute: '2-digit',
      second: '2-digit'
    });
  } catch {
    return dataISO;
  }
}

export function Dashboard() {
  const [processos, setProcessos] = useState<Processo[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [extractionId, setExtractionId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
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

  const carregarProcessos = useCallback(async (showLoading = true) => {
    if (showLoading) setLoading(true);
    try {
      const [data, atualizacao] = await Promise.all([
        getProcessos(),
        getUltimaAtualizacaoReal(),
      ]);

      setProcessos(data);
      
      // Verifica se está usando cache
      const meta = localStorage.getItem('processos_meta_v2');
      if (meta) {
        const parsed = JSON.parse(meta);
        setCacheInfo({
          ativo: true,
          data: parsed.ultima_atualizacao ? formatarDataBR(parsed.ultima_atualizacao) : null
        });
      } else {
        setCacheInfo({ ativo: false, data: null });
      }
      
      // Formata a data para exibição
      if (atualizacao) {
        setLastUpdate(formatarDataBR(atualizacao));
      } else {
        // Se não tiver data do Firestore, tenta do meta do cache
        const meta = localStorage.getItem('processos_meta_v2');
        if (meta) {
          const parsed = JSON.parse(meta);
          if (parsed.ultima_atualizacao) {
            setLastUpdate(formatarDataBR(parsed.ultima_atualizacao));
          }
        }
      }
      
      console.log("📅 Última atualização:", atualizacao);
    } catch (error) {
      console.error("Erro ao carregar processos:", error);
    } finally {
      if (showLoading) setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    carregarProcessos();
  }, [refreshKey, carregarProcessos]);

  // Handler para refresh manual (chamado pelo DiagnosticButtons)
  const handleManualRefresh = useCallback(async () => {
    setRefreshing(true);
    await carregarProcessos(true);
  }, [carregarProcessos]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleExtracaoCompleta = (dados: any, id: string) => {
    setExtractionId(id);
    
    // Salva a data atual no cache
    const agora = new Date().toISOString();
    
    localStorage.setItem("processos_cache_v2", JSON.stringify(dados.processos));
    localStorage.setItem(
      "processos_meta_v2",
      JSON.stringify({
        ultima_atualizacao: agora,
        version: "2.0",
      })
    );
    
    // Atualiza o lastUpdate imediatamente
    setLastUpdate(formatarDataBR(agora));
    setCacheInfo({
      ativo: true,
      data: formatarDataBR(agora)
    });
    
    carregarProcessos(false);
  };

  const handleFirestoreSuccess = () => {
    // Recarrega para pegar a data do Firestore
    setRefreshKey(prev => prev + 1);
  };

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
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 pt-[110px] md:pt-[130px] px-4">
      <div className="max-w-7xl mx-auto">
        
        <HeroDashboard />

        {/* Header com última atualização */}
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
            
            {extractionId && (
              <FirestoreButton
                extractionId={extractionId}
                onSuccess={handleFirestoreSuccess}
              />
            )}
          </div>
        </div>

        <StatsCards resumo={resumo} total={processos.length} />

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

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-green-600" />
            <span className="ml-3 text-gray-500">Carregando processos...</span>
            {cacheInfo.ativo && (
              <p className="text-xs text-gray-400 ml-2">
                (usando cache)
              </p>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <KanbanColumn
                title="Em Andamento"
                count={andamento.length}
                processos={andamento}
                type="andamento"
                index={0}
              />
              <KanbanColumn
                title="Em Convite"
                count={convite.length}
                processos={convite}
                type="convite"
                index={1}
              />
              <KanbanColumn
                title="Finalizados"
                count={finalizados.length}
                processos={finalizados}
                type="finalizado"
                index={2}
              />
            </div>

            {/* Rodapé com estatísticas */}
            <div className="mt-6 text-center text-xs text-gray-400 bg-white p-3 rounded-lg shadow-sm">
              <p>
                📊 Total: {processos.length} processos • 
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
                  💾 Cache: {cacheInfo.data}
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}