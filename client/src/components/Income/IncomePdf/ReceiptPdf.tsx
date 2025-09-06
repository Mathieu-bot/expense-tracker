import { forwardRef } from "react";
import type { Income } from "../../../types/Income";
import { formatCurrency, formatDate } from "../../../utils/formatters";

interface ReceiptPdfProps {
  incomes: Income[];
  startDate?: string;
  endDate?: string;
  totalAmount: number;
}

export const ReceiptPdf = forwardRef<HTMLDivElement, ReceiptPdfProps>(
  ({ incomes, startDate, endDate, totalAmount }, ref) => {
    const currentDate = new Date();

    return (
      <div
        ref={ref}
        style={{
          padding: "40px 32px",
          backgroundColor: "#ffffff",
          color: "#010c19",
          fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
          fontSize: "13px",
          lineHeight: 1.5,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "32px",
            paddingBottom: "24px",
            borderBottom: "1px solid #e5e7eb",
          }}
        >
          <img
            src="./Monogram.png"
            alt="Company Logo"
            style={{
              width: "48px",
              height: "48px",
              marginRight: "16px",
            }}
          />
          <div>
            <h1
              style={{
                fontSize: "28px",
                fontWeight: "700",
                color: "#01153e",
                margin: "0 0 4px 0",
                letterSpacing: "-0.5px",
              }}
            >
              Income Receipt
            </h1>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "32px",
            padding: "24px",
            backgroundColor: "#f8fafc",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
          }}
        >
          <div>
            <p
              style={{
                color: "#6b7280",
                margin: "0 0 8px 0",
                fontSize: "12px",
                fontWeight: "500",
              }}
            >
              REPORT PERIOD
            </p>
            <p
              style={{
                color: "#01153e",
                margin: "0",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              {startDate && endDate
                ? `${formatDate(startDate)} - ${formatDate(endDate)}`
                : "All Time Records"}
            </p>
          </div>

          <div>
            <p
              style={{
                color: "#6b7280",
                margin: "0 0 8px 0",
                fontSize: "12px",
                fontWeight: "500",
                textAlign: "right",
              }}
            >
              GENERATED ON
            </p>
            <p
              style={{
                color: "#01153e",
                margin: "0",
                fontSize: "14px",
                fontWeight: "600",
                textAlign: "right",
              }}
            >
              {currentDate.toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            marginBottom: "32px",
          }}
        >
          <div
            style={{
              padding: "20px",
              backgroundColor: "#052261",
              color: "white",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: "0 0 8px 0",
                fontSize: "12px",
                opacity: "0.9",
              }}
            >
              TOTAL INCOME
            </p>
            <p
              style={{
                margin: "0",
                fontSize: "24px",
                fontWeight: "700",
              }}
            >
              {formatCurrency(totalAmount)}
            </p>
          </div>

          <div
            style={{
              padding: "20px",
              backgroundColor: "#ffdd33",
              color: "#010c19",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <p
              style={{
                margin: "0 0 8px 0",
                fontSize: "12px",
                fontWeight: "500",
              }}
            >
              NUMBER OF RECORDS
            </p>
            <p
              style={{
                margin: "0",
                fontSize: "24px",
                fontWeight: "700",
              }}
            >
              {incomes.length}
            </p>
          </div>
        </div>

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "32px",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: "#052261",
                color: "white",
              }}
            >
              <th
                style={{
                  textAlign: "left",
                  padding: "12px 16px",
                  fontSize: "12px",
                  fontWeight: "600",
                  borderTopLeftRadius: "8px",
                }}
              >
                Date
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "12px 16px",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                Source
              </th>
              <th
                style={{
                  textAlign: "left",
                  padding: "12px 16px",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                Description
              </th>
              <th
                style={{
                  textAlign: "right",
                  padding: "12px 16px",
                  fontSize: "12px",
                  fontWeight: "600",
                  borderTopRightRadius: "8px",
                }}
              >
                Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {incomes.map((income, index) => (
              <tr
                key={income.income_id}
                style={{
                  backgroundColor: index % 2 === 0 ? "#f8fafc" : "#ffffff",
                  borderBottom: "1px solid #e5e7eb",
                }}
              >
                <td
                  style={{
                    padding: "12px 16px",
                    fontWeight: "500",
                    color: "#01153e",
                  }}
                >
                  {formatDate(income.date)}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    fontWeight: "600",
                    color: "#052261",
                  }}
                >
                  {income.source}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    color: "#6b7280",
                    fontStyle: income.description ? "normal" : "italic",
                  }}
                >
                  {income.description || "No description provided"}
                </td>
                <td
                  style={{
                    padding: "12px 16px",
                    textAlign: "right",
                    fontWeight: "600",
                    color: "#052261",
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
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
            paddingTop: "32px",
            borderTop: "1px solid #e5e7eb",
            textAlign: "center",
            color: "#6b7280",
            fontSize: "11px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: "12px",
            }}
          >
            <div
              style={{
                width: "16px",
                height: "16px",
                backgroundColor: "#ffdd33",
                borderRadius: "2px",
                marginRight: "8px",
              }}
            ></div>
            <p
              style={{
                margin: "0",
                fontWeight: "600",
                color: "#052261",
              }}
            >
              PennyPal • {currentDate.getFullYear()}
            </p>
          </div>
          <p style={{ margin: "4px 0" }}>
            Thank you for using our income tracking system
          </p>
          <p style={{ margin: "4px 0" }}>
            This is an automatically generated receipt
          </p>
        </div>
      </div>
    );
  }
);

ReceiptPdf.displayName = "ReceiptPdf";
