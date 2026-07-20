import { Component, inject, signal, computed, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { McpRegistryService } from './mcp-registry.service';
import type { McpServerResponse } from './interfaces/mcp-registry.interface';

export type CategoryType = 'all' | 'transactionEscrow' | 'catalogInfrastructure' | 'pricingB2bRules';

@Component({
  selector: 'app-mcp-registry',
  imports: [],
  templateUrl: './mcp-registry.component.html',
  styleUrl: './mcp-registry.component.css'
})
export class McpRegistryComponent {
  private readonly registryService = inject(McpRegistryService);

  public readonly apiUrl = 'https://registry.modelcontextprotocol.io/v0.1/servers';

  // Signals for UI binding converted from service RxJS streams
  public readonly servers = toSignal(this.registryService.filteredServers$, { initialValue: [] as McpServerResponse[] });
  public readonly isLoading = toSignal(this.registryService.isLoading$, { initialValue: false });
  public readonly error = toSignal(this.registryService.error$, { initialValue: null as string | null });

  public readonly searchInputValue = signal<string>('https://registry.modelcontextprotocol.io/');
  public readonly hasFetched = signal<boolean>(false);
  public readonly selectedCategory = signal<CategoryType>('all');
  public readonly areCategoryButtonsDisabled = signal<boolean>(false);

  /**
   * Derived state: filters servers based on selected commerce category.
   */
  public readonly displayedServers = computed(() => {
    const allServers = this.servers();
    const cat = this.selectedCategory();
    if (cat === 'all') {
      return allServers;
    }
    const categorization = this.registryService.categorizeCommerceServers(allServers);
    return categorization[cat] || [];
  });

  constructor() {
    effect(() => {
      const serverCount = this.displayedServers().length;
      const loading = this.isLoading();
      const err = this.error();
      console.log(`[McpRegistryComponent] 📊 UI State -> isLoading: ${loading}, displayedServers: ${serverCount}, category: ${this.selectedCategory()}, categoryDisabled: ${this.areCategoryButtonsDisabled()}, error: ${err ?? 'none'}`);
    });
  }

  public onSearchInput(query: string): void {
    console.log(`[McpRegistryComponent] 🔍 Search input changed: "${query}"`);
    this.searchInputValue.set(query);
    const trimmed = query.trim();
    if (trimmed === '' || trimmed === 'https://registry.modelcontextprotocol.io/' || trimmed === 'https://registry.modelcontextprotocol.io/v0.1/servers') {
      this.registryService.searchQuery$.next('');
    } else {
      this.registryService.searchQuery$.next(query);
    }
  }

  public selectCategory(cat: CategoryType): void {
    if (this.areCategoryButtonsDisabled()) {
      return;
    }
    console.log(`[McpRegistryComponent] 🏷️ Category selected: ${cat}`);
    this.selectedCategory.set(cat);
    this.hasFetched.set(true);
    if (this.servers().length === 0 && !this.isLoading()) {
      this.registryService.fetchServers();
    }
  }

  public clearSearch(): void {
    console.log('[McpRegistryComponent] 🧹 Search cleared');
    this.searchInputValue.set('');
    this.registryService.searchQuery$.next('');
  }

  public onFetchServers(): void {
    console.log('[McpRegistryComponent] 🔄 "Get Commerce MCP" clicked. Disabling category buttons.');
    this.hasFetched.set(true);
    this.areCategoryButtonsDisabled.set(true);
    this.selectedCategory.set('all');
    this.registryService.fetchServers();
  }
}



