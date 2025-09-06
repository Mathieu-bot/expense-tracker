import { forwardRef } from "react";
import type { Income } from "../../types/Income";
import { formatCurrency } from "../../utils/formatters";

interface ReceiptPdfProps {
  incomes: Income[];
  startDate?: string;
  endDate?: string;
  totalAmount: number;
}

export const ReceiptPdf = forwardRef<HTMLDivElement, ReceiptPdfProps>(
  ({ incomes, startDate, endDate, totalAmount }, ref) => {
    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    const currentDate = new Date();

    return (
      <div
        ref={ref}
        style={{
          padding: "32px",
          backgroundColor: "#ffffff", 
          color: "#000000", 
          fontFamily: "Arial, sans-serif",
          fontSize: "12px",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              color: "#4f46e5", 
              marginBottom: "8px",
            }}
          >
            Income Receipts
          </h1>
          <p style={{ color: "#4b5563", marginBottom: "4px" }}>
            {startDate && endDate
              ? `Period: ${formatDate(startDate)} - ${formatDate(endDate)}`
              : "All Time Records"}
          </p>
          <p style={{ color: "#4b5563" }}>
            Generated on:{" "}
            {currentDate.toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}{" "}
            at{" "}
            {currentDate.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <div
          style={{
            marginBottom: "24px",
            padding: "16px",
            backgroundColor: "#f3f4f6", 
            borderRadius: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "8px",
            }}
          >
            <span style={{ fontWeight: "bold" }}>Total Income:</span>
            <span
              style={{ fontSize: "18px", fontWeight: "bold", color: "#16a34a" }}
            >
              {formatCurrency(totalAmount)}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: "bold" }}>Number of Records:</span>
            <span>{incomes.length}</span>
          </div>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "2px solid #d1d5db" }}>
              <th style={{ textAlign: "left", padding: "8px" }}>Date</th>
              <th style={{ textAlign: "left", padding: "8px" }}>Source</th>
              <th style={{ textAlign: "left", padding: "8px" }}>Description</th>
              <th style={{ textAlign: "right", padding: "8px" }}>Amount</th>
            </tr>
          </thead>
          <tbody>
            {incomes.map((income, index) => (
              <tr
                key={income.income_id}
                style={{
                  backgroundColor: index % 2 === 0 ? "#f9fafb" : "#ffffff",
                }}
              >
                <td style={{ padding: "8px" }}>{formatDate(income.date)}</td>
                <td style={{ padding: "8px", fontWeight: "500" }}>
                  {income.source}
                </td>
                <td style={{ padding: "8px", color: "#4b5563" }}>
                  {income.description || "No description"}
                </td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "right",
                    fontFamily: "monospace",
                  }}
                >
                  {formatCurrency(income.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div
          style={{
            marginTop: "32px",
            paddingTop: "24px",
            borderTop: "1px solid #d1d5db",
            textAlign: "center",
            fontSize: "10px",
            color: "#6b7280",
          }}
        >
          <p>Thank you for using our income tracking system</p>
          <p style={{ marginTop: "4px" }}>
            This is an automatically generated receipt
          </p>
        </div>
      </div>
    );
  }
);

ReceiptPdf.displayName = "ReceiptPdf";
