import { Component, inject, signal, computed, effect, PLATFORM_ID } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe, isPlatformBrowser } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { McpRegistryService, parseCommerceKeywords } from './mcp-registry.service';
import type { McpServerResponse, ParsedCommerceMetadata, CommerceServerCategorization } from './interfaces/mcp-registry.interface';

export type CategoryType = 'all' | 'transactions' | 'catalogInfrastructure' | 'pricingB2bRules' | 'agenticProtocols' | 'autonomousProcurement';

@Component({
  selector: 'app-mcp-registry',
  imports: [RouterLink, RouterLinkActive, DatePipe],
  templateUrl: './mcp-registry.component.html',
  styleUrl: './mcp-registry.component.css'
})
export class McpRegistryComponent {
  private readonly registryService = inject(McpRegistryService);
  private readonly platformId = inject(PLATFORM_ID);

  // Signals for UI binding converted from service RxJS streams
  public readonly servers = toSignal(this.registryService.filteredServers$, { initialValue: [] as McpServerResponse[] });
  public readonly isLoading = toSignal(this.registryService.isLoading$, { initialValue: false });
  public readonly error = toSignal(this.registryService.error$, { initialValue: null as string | null });

  public readonly registryText = signal<string>('Click below the AI commerce tools within the Official MCP Registry');
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
    return categorization[cat as keyof Omit<CommerceServerCategorization, 'allCommerceServers'>] || [];
  });

  constructor() {
    effect(() => {
      const serverCount = this.displayedServers().length;
      const loading = this.isLoading();
      const err = this.error();
      console.log(
				`[McpRegistryComponent] 📊 UI State -> isLoading: ${loading}, 
				displayedServers: ${serverCount}, 
				category: ${this.selectedCategory()}, 
				categoryDisabled: ${this.areCategoryButtonsDisabled()}, 
				error: ${err ?? 'none'}`
			);
    });
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
  public clearResults(): void {
    console.log('[McpRegistryComponent] 🧹 Results cleared');
    this.selectedCategory.set('all');
    this.hasFetched.set(false);
  }
  public getCommerceInfo(item: McpServerResponse): ParsedCommerceMetadata {
    return parseCommerceKeywords(item);
  }
  public getCategoryLabel(cat: 'transactions' | 'catalogInfrastructure' | 'pricingB2bRules' | 'agenticProtocols' | 'autonomousProcurement'): string {
    switch (cat) {
      case 'transactions':
        return 'Transaction & Escrow';
      case 'catalogInfrastructure':
        return 'Catalog Infrastructure';
      case 'pricingB2bRules':
        return 'Pricing & B2B Rules';
      case 'agenticProtocols':
        return 'Agentic AI Protocols';
      case 'autonomousProcurement':
        return 'Autonomous Procurement';
    }
  }
}
