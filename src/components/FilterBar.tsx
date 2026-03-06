import { useState, useRef, useEffect } from 'react';
import { Search, Calendar, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { FilterState } from '@/types';
import gsap from 'gsap';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClearFilters: () => void;
}

export function FilterBar({ filters, onFilterChange, onClearFilters }: FilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (filterRef.current) {
      gsap.fromTo(
        filterRef.current,
        { y: -20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.3 }
      );
    }
  }, []);

  const hasActiveFilters = filters.search || filters.dateFrom || filters.dateTo || filters.status;

  return (
    <div
      ref={filterRef}
      className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6"
    >
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7f8c8d]" />
          <Input
            type="text"
            placeholder="Buscar por protocolo, serviço, estágio..."
            value={filters.search}
            onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
            className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#27ae60] 
                       focus:ring-[#27ae60]/20 rounded-xl transition-all"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ ...filters, search: '' })}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="w-4 h-4 text-[#7f8c8d] hover:text-[#2c3e50]" />
            </button>
          )}
        </div>

        {/* Expand Button (Mobile) */}
        <Button
          variant="outline"
          className="lg:hidden h-11"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Filter className="w-4 h-4 mr-2" />
          Filtros
        </Button>

        {/* Date and Status Filters */}
        <div className={`flex flex-col sm:flex-row gap-3 ${isExpanded ? 'block' : 'hidden lg:flex'}`}>
          {/* Date From */}
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7f8c8d]" />
            <Input
              type="date"
              placeholder="Data inicial"
              value={filters.dateFrom}
              onChange={(e) => onFilterChange({ ...filters, dateFrom: e.target.value })}
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
              onChange={(e) => onFilterChange({ ...filters, dateTo: e.target.value })}
              className="pl-10 h-11 bg-gray-50 border-gray-200 focus:bg-white focus:border-[#27ae60] 
                         focus:ring-[#27ae60]/20 rounded-xl w-full sm:w-40"
            />
          </div>

          {/* Status Select */}
          <select
            value={filters.status}
            onChange={(e) => onFilterChange({ ...filters, status: e.target.value })}
            className="h-11 px-4 bg-gray-50 border border-gray-200 rounded-xl text-sm 
                       focus:bg-white focus:border-[#27ae60] focus:ring-[#27ae60]/20 
                       focus:outline-none w-full sm:w-44"
          >
            <option value="">Todos os status</option>
            <option value="Encaminhado">Encaminhado</option>
            <option value="Em convite">Em convite</option>
            <option value="Finalizado">Finalizado</option>
          </select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            onClick={onClearFilters}
            className="h-11 text-[#7f8c8d] hover:text-[#e74c3c] hover:bg-red-50"
          >
            <X className="w-4 h-4 mr-2" />
            Limpar
          </Button>
        )}
      </div>
    </div>
  );
}
