import { Component, inject, signal, computed, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { McpRegistryService } from './mcp-registry.service';
import type { McpServerResponse } from './interfaces/mcp-registry.interface';

export type CategoryType = 'all' | 'transactionEscrow' | 'catalogInfrastructure' | 'pricingB2bRules';

@Component({
  selector: 'app-mcp-registry',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './mcp-registry.component.html',
  styleUrl: './mcp-registry.component.css'
})
export class McpRegistryComponent {
  private readonly registryService = inject(McpRegistryService);

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

}



