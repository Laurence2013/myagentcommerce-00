import { Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { McpRegistryService } from './mcp-registry.service';
import type { McpServerResponse } from './interfaces/mcp-registry.interface';
import { McpHeaderComponent } from './components/mcp-header.component';
import { McpSearchBarComponent } from './components/mcp-search-bar.component';
import { McpServerCardComponent } from './components/mcp-server-card.component';
import { McpServerSkeletonComponent } from './components/mcp-server-skeleton.component';

@Component({
  selector: 'app-mcp-registry',
  imports: [
    McpHeaderComponent,
    McpSearchBarComponent,
    McpServerCardComponent,
    McpServerSkeletonComponent
  ],
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

  public readonly searchInputValue = signal<string>('');

  public readonly skeletonItems = [1, 2, 3, 4, 5, 6];

  public onSearchInput(query: string): void {
    this.searchInputValue.set(query);
    this.registryService.searchQuery$.next(query);
  }

  public clearSearch(): void {
    this.searchInputValue.set('');
    this.registryService.searchQuery$.next('');
  }

  public onFetchServers(): void {
    this.registryService.fetchServers();
  }
}
