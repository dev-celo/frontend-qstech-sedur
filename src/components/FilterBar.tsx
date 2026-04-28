import { useState, useRef, useEffect, useCallback } from 'react';
import { Search, Calendar, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { FilterState } from '@/types';
import gsap from 'gsap';
import { useDebounce } from '@/hooks/useDebounce';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

const STATUS_OPTIONS = [
  { value: "Encaminhado", label: "Encaminhado" },
  { value: "Em convite", label: "Em convite" },
  { value: "Finalizado", label: "Finalizado" },
];

export function FilterBar({ filters, onFilterChange, onClearFilters }: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  
  // 🔥 ESTADO LOCAL para o campo de busca (para ser RÁPIDO)
  const [localSearch, setLocalSearch] = useState(filters.search);
  
  // 🔥 Debounce no valor local (300ms)
  const debouncedSearch = useDebounce(localSearch, 300);

  // Animação GSAP
  useEffect(() => {
    if (filterRef.current) {
      gsap.fromTo(
        filterRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.3 }
      );
    }
  }, []);

  // 🔥 Quando o debounce termina, atualiza o filtro global
  useEffect(() => {
    onFilterChange({ ...filters, search: debouncedSearch });
  }, [debouncedSearch, filters, onFilterChange]);

  // 🔥 Sincroniza se o filtro global mudar externamente
  useEffect(() => {
    if (filters.search !== localSearch) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalSearch(filters.search);
    }
  }, [filters.search, localSearch]);

  // Handlers otimizados com useCallback
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(e.target.value); // 🔥 Atualiza localmente (RÁPIDO!)
  }, []);

  const handleClearSearch = useCallback(() => {
    setLocalSearch('');
    onFilterChange({ ...filters, search: '' });
  }, [filters, onFilterChange]);

  const handleDateFromChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, dateFrom: e.target.value });
  }, [filters, onFilterChange]);

  const handleDateToChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange({ ...filters, dateTo: e.target.value });
  }, [filters, onFilterChange]);

  const handleStatusChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    onFilterChange({ ...filters, status: e.target.value });
  }, [filters, onFilterChange]);

  const hasActiveFilters = filters.search || filters.dateFrom || filters.dateTo || filters.status;
  
  const activeFiltersCount = [
    !!filters.search,
    !!filters.dateFrom,
    !!filters.dateTo,
    !!filters.status
  ].filter(Boolean).length;

  const searchPlaceholder = "Buscar por protocolo, serviço, empresa, CNPJ ou ID...";

  return (
    <div
      ref={filterRef}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6"
    >
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input - AGORA COM ESTADO LOCAL RÁPIDO */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7f8c8d]" />
          <Input
            type="text"
            placeholder={searchPlaceholder}
            value={localSearch}
            onChange={handleSearchChange}
            className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#27ae60] 
                       focus:ring-[#27ae60]/20 rounded-xl transition-all"
          />
          {localSearch && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              aria-label="Limpar busca"
            >
              <X className="w-4 h-4 text-[#7f8c8d] hover:text-[#2c3e50]" />
            </button>
          )}
        </div>

        {/* Expand Button (Mobile) */}
        <Button
          variant="outline"
          className="lg:hidden h-11 relative"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filtros
          {activeFiltersCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#27ae60] text-white text-[10px] rounded-full flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>

        {/* Date and Status Filters */}
        <div className={`flex flex-col sm:flex-row gap-3 ${isExpanded ? 'flex' : 'hidden lg:flex'}`}>
          {/* Date From */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7f8c8d]" />
            <Input
              type="date"
              placeholder="Data inicial"
              value={filters.dateFrom}
              onChange={handleDateFromChange}
              className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#27ae60] 
                         focus:ring-[#27ae60]/20 rounded-xl w-full sm:w-40"
            />
          </div>

          {/* Date To */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7f8c8d]" />
            <Input
              type="date"
              placeholder="Data final"
              value={filters.dateTo}
              onChange={handleDateToChange}
              className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#27ae60] 
                         focus:ring-[#27ae60]/20 rounded-xl w-full sm:w-40"
            />
          </div>

          {/* Status Select */}
          <select
            value={filters.status}
            onChange={handleStatusChange}
            className="h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm 
                       focus:bg-white focus:border-[#27ae60] focus:ring-[#27ae60]/20 
                       focus:outline-none w-full sm:w-44 cursor-pointer"
          >
            <option value="">Todos os status</option>
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={onClearFilters}
            className="h-11 text-[#7f8c8d] hover:text-[#e74c3c] hover:bg-red-50 transition-colors"
            aria-label="Limpar todos os filtros"
          >
            <X className="w-4 h-4 mr-2" />
            Limpar ({activeFiltersCount})
          </Button>
        )}
      </div>

      {/* Indicador de filtros ativos (mobile quando colapsado) */}
      {!isExpanded && activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-3 lg:hidden">
          {filters.search && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              Busca: {filters.search.length > 15 ? filters.search.slice(0, 15) + '...' : filters.search}
            </span>
          )}
          {filters.dateFrom && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              De: {filters.dateFrom}
            </span>
          )}
          {filters.dateTo && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              Até: {filters.dateTo}
            </span>
          )}
          {filters.status && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
              Status: {filters.status}
            </span>
          )}
        </div>
      )}
    </div>
  );
}