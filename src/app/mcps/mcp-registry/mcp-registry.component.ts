import { Component, inject, signal, effect } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { McpRegistryService } from './mcp-registry.service';
import type { McpServerResponse } from './interfaces/mcp-registry.interface';

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

  constructor() {
    effect(() => {
      const serverCount = this.servers().length;
      const loading = this.isLoading();
      const err = this.error();
      console.log(`[McpRegistryComponent] 📊 UI State -> isLoading: ${loading}, servers: ${serverCount}, error: ${err ?? 'none'}`);
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

  public clearSearch(): void {
    console.log('[McpRegistryComponent] 🧹 Search cleared');
    this.searchInputValue.set('');
    this.registryService.searchQuery$.next('');
  }

  public onFetchServers(): void {
    console.log('[McpRegistryComponent] 🔄 "Get Registry" clicked.');
    this.hasFetched.set(true);
    this.registryService.fetchServers();
  }
}

