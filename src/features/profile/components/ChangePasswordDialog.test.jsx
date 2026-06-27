import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { useChangePassword } from "../hooks/useChangePassword"
import ChangePasswordDialog from "./ChangePasswordDialog"

vi.mock(import("../hooks/useChangePassword"), () => ({
  useChangePassword: vi.fn(),
}))

const BASE_STATE = {
  currentPassword: "",
  setCurrentPassword: vi.fn(),
  newPassword: "",
  setNewPassword: vi.fn(),
  confirmNewPassword: "",
  setConfirmNewPassword: vi.fn(),
  showCurrentPassword: false,
  toggleShowCurrentPassword: vi.fn(),
  showNewPassword: false,
  toggleShowNewPassword: vi.fn(),
  saving: false,
  fieldErrors: {},
  handleSave: vi.fn(),
  handleCancel: vi.fn(),
}

const renderDialog = (overrides = {}) => {
  useChangePassword.mockReturnValue({ ...BASE_STATE, ...overrides })
  return render(<ChangePasswordDialog isOpen onClose={vi.fn()} />)
}

describe("ChangePasswordDialog", () => {
  it("renders the current values from the hook", () => {
    renderDialog({ currentPassword: "abc", newPassword: "def", confirmNewPassword: "ghi" })

    expect(screen.getByLabelText("Contraseña actual")).toHaveValue("abc")
    expect(screen.getByLabelText("Nueva contraseña")).toHaveValue("def")
    expect(screen.getByLabelText("Confirmar nueva contraseña")).toHaveValue("ghi")
  })

  it("calls the corresponding setter when a field changes", async () => {
    const setCurrentPassword = vi.fn()
    renderDialog({ setCurrentPassword })

    await userEvent.type(screen.getByLabelText("Contraseña actual"), "x")

    expect(setCurrentPassword).toHaveBeenCalledWith("x")
  })

  it("toggles password visibility when the eye icon is clicked", async () => {
    const toggleShowCurrentPassword = vi.fn()
    renderDialog({ toggleShowCurrentPassword })

    const [currentPasswordToggle] = screen.getAllByRole("button", { name: "Mostrar contraseña" })
    await userEvent.click(currentPasswordToggle)

    expect(toggleShowCurrentPassword).toHaveBeenCalled()
  })

  it("shows field errors next to the relevant input", () => {
    renderDialog({ fieldErrors: { newPassword: "La nueva contraseña debe tener al menos 8 caracteres." } })

    expect(
      screen.getByText("La nueva contraseña debe tener al menos 8 caracteres."),
    ).toBeInTheDocument()
  })

  it("calls handleSave when clicking the save button", async () => {
    const handleSave = vi.fn()
    renderDialog({ handleSave })

    await userEvent.click(screen.getByRole("button", { name: "Guardar cambios" }))

    expect(handleSave).toHaveBeenCalled()
  })

  it("calls handleCancel when clicking the cancel button", async () => {
    const handleCancel = vi.fn()
    renderDialog({ handleCancel })

    await userEvent.click(screen.getByRole("button", { name: "Cancelar" }))

    expect(handleCancel).toHaveBeenCalled()
  })

  it("disables inputs and buttons and shows a saving label while saving", () => {
    renderDialog({ saving: true })

    expect(screen.getByLabelText("Contraseña actual")).toBeDisabled()
    expect(screen.getByRole("button", { name: "Guardando..." })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeDisabled()
  })
})
