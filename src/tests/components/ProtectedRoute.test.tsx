// src/tests/components/ProtectedRoute.test.tsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

// ── Mock de useUser ────────────────────────────────────────────────────────

const mockUseUser = vi.fn();
vi.mock("@/hooks", () => ({
  useUser: () => mockUseUser(),
}));

// ── Helpers ────────────────────────────────────────────────────────────────

const ProtectedPage = () => <div>Contenido protegido</div>;
const LoginPage = () => <div>Página de login</div>;

const renderWithRouter = (initialPath = "/protected") =>
  render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/protected" element={<ProtectedPage />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

// ── Tests ──────────────────────────────────────────────────────────────────

describe("ProtectedRoute", () => {
  it("muestra Loader mientras isLoading es true", () => {
    mockUseUser.mockReturnValue({ session: null, isLoading: true });
    const { container } = renderWithRouter();

    // El Loader renderiza un SVG o elemento de carga
    expect(container.firstChild).toBeTruthy();
    expect(screen.queryByText("Contenido protegido")).not.toBeInTheDocument();
    expect(screen.queryByText("Página de login")).not.toBeInTheDocument();
  });

  it("redirige a /login si no hay sesión", () => {
    mockUseUser.mockReturnValue({ session: null, isLoading: false });
    renderWithRouter();

    expect(screen.getByText("Página de login")).toBeInTheDocument();
    expect(screen.queryByText("Contenido protegido")).not.toBeInTheDocument();
  });

  it("renderiza el contenido protegido si hay sesión", () => {
    mockUseUser.mockReturnValue({
      session: { access_token: "token", user: { id: "user-1" } },
      isLoading: false,
    });
    renderWithRouter();

    expect(screen.getByText("Contenido protegido")).toBeInTheDocument();
    expect(screen.queryByText("Página de login")).not.toBeInTheDocument();
  });

  it("redirige a una ruta personalizada si se pasa redirectTo", () => {
    mockUseUser.mockReturnValue({ session: null, isLoading: false });

    render(
      <MemoryRouter initialEntries={["/protected"]}>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/inicio" element={<div>Inicio</div>} />
          <Route element={<ProtectedRoute redirectTo="/inicio" />}>
            <Route path="/protected" element={<ProtectedPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText("Inicio")).toBeInTheDocument();
  });
});
