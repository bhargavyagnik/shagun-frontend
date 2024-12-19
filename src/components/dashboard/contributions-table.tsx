import { useState } from "react";
import { 
  ChevronDown, 
  ChevronUp, 
  Search,
  Filter
} from "lucide-react";

interface Contribution {
  id: string;
  name:string;
  amount: number;
  relation: "bride" | "groom";
  message?: string;
  createdAt: {
    _seconds: number;
    _nanoseconds: number;
  };
}

export function ContributionsTable({ contributions }: { contributions: Contribution[] }) {
  type SortableFields = keyof Contribution | "createdAt._seconds";  // Add nested field
  const [sortField, setSortField] = useState<SortableFields>("createdAt._seconds");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filters, setFilters] = useState({
    search: "",
    relation: "all",
  });

  const filteredContributions = contributions
    .filter((contribution) => {
      const matchesSearch = contribution.name?.toLowerCase()
        .includes(filters.search.toLowerCase());
      const matchesRelation = 
        filters.relation === "all" || 
        contribution.relation === filters.relation;
      return matchesSearch && matchesRelation;
    })
    .sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      return sortDirection === "asc" 
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });

  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name..."
            className="w-full pl-10 pr-4 py-2 rounded-md border"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>
        <select
          className="px-4 py-2 rounded-md border"
          value={filters.relation}
          onChange={(e) => setFilters({ ...filters, relation: e.target.value })}
        >
          <option value="all">All Relations</option>
          <option value="bride">Bride's Side</option>
          <option value="groom">Groom's Side</option>
        </select>
      </div>

      <div className="rounded-lg border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Amount</th>
              <th className="px-4 py-3 text-left">Relation</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Message</th>
            </tr>
          </thead>
          <tbody>
            {filteredContributions.map((contribution) => (
              <tr key={contribution.id} className="border-t hover:bg-muted/50">
                <td className="px-4 py-3">{contribution.name}</td>
                <td className="px-4 py-3">₹{contribution.amount.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-sm ${
                    contribution.relation === "bride" 
                      ? "bg-blue-500/10 text-blue-600" 
                      : "bg-violet-500/10 text-violet-600"
                  }`}>
                    {contribution.relation === "bride" ? "Bride's Side" : "Groom's Side"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  {new Date(contribution.createdAt._seconds).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 max-w-xs truncate">{contribution.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}