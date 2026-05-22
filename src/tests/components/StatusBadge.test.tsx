// src/tests/components/StatusBadge.test.tsx
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { StatusBadge } from "@/components/dashboard/shared/StatusBadge";

describe("StatusBadge", () => {
  // ── Labels correctos ───────────────────────────────────────────────────

  it.each([
    ["pending", "Pendiente"],
    ["paid", "Pagado"],
    ["cancelled", "Cancelado"],
    ["refunded", "Reembolsado"],
    ["verified", "Verificado"],
    ["rejected", "Rechazado"],
    ["Pending", "Pendiente"],
    ["Paid", "Pagado"],
    ["Shipped", "Enviado"],
    ["Delivered", "Entregado"],
  ])("status '%s' muestra label '%s'", (status, label) => {
    render(<StatusBadge status={status} />);
    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("status desconocido muestra el valor raw como label", () => {
    render(<StatusBadge status="custom_status" />);
    expect(screen.getByText("custom_status")).toBeInTheDocument();
  });

  // ── Clases de color correctas ──────────────────────────────────────────

  it("'pending' tiene clase de color amber", () => {
    render(<StatusBadge status="pending" />);
    const badge = screen.getByText("Pendiente");
    expect(badge.className).toMatch(/amber/);
  });

  it("'paid' tiene clase de color green", () => {
    render(<StatusBadge status="paid" />);
    const badge = screen.getByText("Pagado");
    expect(badge.className).toMatch(/green/);
  });

  it("'cancelled' tiene clase de color red", () => {
    render(<StatusBadge status="cancelled" />);
    const badge = screen.getByText("Cancelado");
    expect(badge.className).toMatch(/red/);
  });

  it("'verified' tiene clase de color green", () => {
    render(<StatusBadge status="verified" />);
    const badge = screen.getByText("Verificado");
    expect(badge.className).toMatch(/green/);
  });

  it("'rejected' tiene clase de color red", () => {
    render(<StatusBadge status="rejected" />);
    const badge = screen.getByText("Rechazado");
    expect(badge.className).toMatch(/red/);
  });

  // ── Estructura del componente ──────────────────────────────────────────

  it("renderiza un elemento span", () => {
    render(<StatusBadge status="paid" />);
    const badge = screen.getByText("Pagado");
    expect(badge.tagName.toLowerCase()).toBe("span");
  });

  it("siempre tiene la clase rounded-full", () => {
    render(<StatusBadge status="pending" />);
    const badge = screen.getByText("Pendiente");
    expect(badge.className).toMatch(/rounded-full/);
  });
});
