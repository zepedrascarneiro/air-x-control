import { test, expect } from "@playwright/test";
import { execSync } from "node:child_process";

const ADMIN_EMAIL = "editor@airx.dev";
const ADMIN_PASSWORD = "airx1234";

test.beforeAll(() => {
  execSync("npm run seed:editor", { stdio: "inherit" });
});

test.describe("Fluxo do administrador/comandante", () => {
  test("permite cadastrar aeronave, login e uso dos filtros persistentes", async ({ page }) => {
    await page.goto("/login");

    await page.getByLabel("E-mail").fill(ADMIN_EMAIL);
    await page.getByLabel("Senha").fill(ADMIN_PASSWORD);
    await page.getByRole("button", { name: "Acessar painel" }).click();

    await page.waitForURL("**/dashboard");
    await expect(
      page.getByRole("heading", { name: "Central do Administrador / Comandante" }),
    ).toBeVisible();

    const tailNumber = `PR-${Date.now().toString().slice(-4).toUpperCase()}`;

    await page.getByLabel("Prefixo").fill(tailNumber);
    await page.getByLabel("Modelo").fill("Playwright Jet");
    await page.getByLabel("Fabricante (opcional)").fill("TestAir");
    await page.getByRole("button", { name: "Cadastrar aeronave" }).click();

    await expect(page.getByText(tailNumber)).toBeVisible();

    await page.getByRole("button", { name: "Voos" }).click();

    const flightFilter = page.getByLabel("Filtrar voos");
    await flightFilter.fill("teste");
    await expect(page).toHaveURL(/flight=teste/);

    await page.getByRole("button", { name: "Limpar" }).first().click();
    await expect(page).not.toHaveURL(/flight=/);

    await page.getByRole("button", { name: "Despesas" }).click();

    const expenseFilter = page.getByLabel("Filtrar despesas");
    await expenseFilter.fill("combustivel");
    await expect(page).toHaveURL(/expense=combustivel/);

    await page.getByRole("button", { name: "Limpar" }).click();
    await expect(page).not.toHaveURL(/expense=/);
  });
});
