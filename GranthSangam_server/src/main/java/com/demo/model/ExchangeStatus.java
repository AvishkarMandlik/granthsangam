
package com.demo.model;

public enum ExchangeStatus {
    PENDING,    // Request created but not yet approved/rejected
    APPROVED,   // Owner approved the exchange
    REJECTED,   // Owner rejected the exchange
    CANCELLED,  // Requester cancelled the request
    COMPLETED   // Exchange was successfully completed
}