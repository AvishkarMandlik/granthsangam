import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ExchangeService } from '../../exchange/exchange.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-exchange-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './exchange-management.component.html',
  styleUrl: './exchange-management.component.css'
})
export class ExchangeManagementComponent {
  @Input() allExchanges: any[] = [];
  @Input() exchangeStats: any = {};
  @Input() isLoading: boolean = false;
  
  @Output() refreshData = new EventEmitter<void>();
  @Output() approve = new EventEmitter<number>();
  @Output() reject = new EventEmitter<number>();
  @Output() cancel = new EventEmitter<number>();

  constructor(private exchangeService: ExchangeService) {}

  approveExchange(id: number): void {
    this.approve.emit(id);
  }

  rejectExchange(id: number): void {
    this.reject.emit(id);
  }

  cancelExchange(id: number): void {
    this.cancel.emit(id);
  }

  getStatusClass(status: string): string {
    switch(status) {
      case 'PENDING': return 'bg-yellow-500/20 text-yellow-400';
      case 'APPROVED': return 'bg-green-500/20 text-green-400';
      case 'COMPLETED': return 'bg-blue-500/20 text-blue-400';
      case 'REJECTED': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  }
}
