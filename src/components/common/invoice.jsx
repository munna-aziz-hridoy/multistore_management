"use client";

import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";

const Invoice = ({ data }) => {
  if (!data) return <div>No data available</div>;

  const componentRef = useRef();

  // Function to handle print using react-to-print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Invoice_${data.id}`,
  });

  return (
    <div
      style={{
        maxWidth: "800px",
        margin: "0 auto",
      }}
    >
      <button
        onClick={handlePrint}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          cursor: "pointer",
          borderRadius: "4px",
        }}
      >
        Print Invoice
      </button>

      <div
        ref={componentRef} // Attach the ref here
        style={{
          margin: "20px auto",
          padding: "20px",
          border: "1px solid #ddd",
          backgroundColor: "#fff",
          fontFamily: "Arial, sans-serif",
        }}
      >
        {/* Header Section */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <div>
            <h1 style={{ margin: 0 }}>INVOICE</h1>
            <p>Invoice No: {data.id}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p>
              <strong>Invoice Date:</strong>{" "}
              {new Date(data.date_created).toLocaleDateString()}
            </p>
            <p>
              <strong>Due Date:</strong>{" "}
              {new Date(data.date_completed).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Billing & Shipping Info */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
          }}
        >
          <div>
            <h2 style={{ margin: 0 }}>Billed To:</h2>
            <p>
              {data.billing.first_name} {data.billing.last_name}
            </p>
            <p>
              {data.billing.address_1} {data.billing.address_2}
            </p>
            <p>
              {data.billing.city}, {data.billing.state}, {data.billing.postcode}
            </p>
            <p>{data.billing.country}</p>
            <p>Email: {data.billing.email}</p>
            <p>Phone: {data.billing.phone}</p>
          </div>
          <div>
            <h2 style={{ margin: 0 }}>Shipped To:</h2>
            <p>
              {data.shipping.first_name} {data.shipping.last_name}
            </p>
            <p>
              {data.shipping.address_1} {data.shipping.address_2}
            </p>
            <p>
              {data.shipping.city}, {data.shipping.state},{" "}
              {data.shipping.postcode}
            </p>
            <p>{data.shipping.country}</p>
            <p>Phone: {data.shipping.phone}</p>
          </div>
        </div>

        {/* Items Table */}
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "20px",
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  borderBottom: "1px solid #ddd",
                  padding: "10px",
                  textAlign: "left",
                }}
              >
                Description
              </th>
              <th style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                Qty
              </th>
              <th style={{ borderBottom: "1px solid #ddd", padding: "10px" }}>
                Price
              </th>
              <th
                style={{
                  borderBottom: "1px solid #ddd",
                  padding: "10px",
                  textAlign: "right",
                }}
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {data.line_items.map((item, index) => (
              <tr key={index}>
                <td style={{ padding: "10px", borderBottom: "1px solid #ddd" }}>
                  {item.name}
                </td>
                <td
                  style={{
                    padding: "10px",
                    textAlign: "center",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  {item.quantity}
                </td>
                <td
                  style={{
                    padding: "10px",
                    textAlign: "center",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  ${parseFloat(item.price).toFixed(2)}
                </td>
                <td
                  style={{
                    padding: "10px",
                    textAlign: "right",
                    borderBottom: "1px solid #ddd",
                  }}
                >
                  ${parseFloat(item.total).toFixed(2)}
                </td>
              </tr>
            ))}
            <tr>
              <td
                colSpan="3"
                style={{
                  padding: "10px",
                  textAlign: "right",
                  fontWeight: "bold",
                }}
              >
                Subtotal
              </td>
              <td style={{ padding: "10px", textAlign: "right" }}>
                ${parseFloat(data.total - data.shipping_total).toFixed(2)}
              </td>
            </tr>
            <tr>
              <td
                colSpan="3"
                style={{
                  padding: "10px",
                  textAlign: "right",
                  fontWeight: "bold",
                }}
              >
                Shipping
              </td>
              <td style={{ padding: "10px", textAlign: "right" }}>
                ${parseFloat(data.shipping_total).toFixed(2)}
              </td>
            </tr>
            <tr>
              <td
                colSpan="3"
                style={{
                  padding: "10px",
                  textAlign: "right",
                  fontWeight: "bold",
                }}
              >
                Total
              </td>
              <td
                style={{
                  padding: "10px",
                  textAlign: "right",
                  fontWeight: "bold",
                }}
              >
                ${parseFloat(data.total).toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Payment Info */}
        <div style={{ marginTop: "20px" }}>
          <p>
            <strong>Payment Method:</strong>{" "}
            {data.payment_method_title || "N/A"}
          </p>
        </div>

        {/* Footer Section */}
        <div
          style={{
            marginTop: "20px",
            borderTop: "1px solid #ddd",
            paddingTop: "10px",
            textAlign: "center",
          }}
        >
          <p style={{ fontSize: "12px" }}>
            Thank you for your business! If you have any questions about this
            invoice, please contact us.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
