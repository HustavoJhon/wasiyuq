import { expect, test } from "@playwright/test";
import { linkFromEmail, verifiedUser } from "./support";

test.describe("organizations", () => {
  test("create, invite (least-privilege default), accept by email, roles enforced, other orgs hidden", async ({ browser }) => {
    const owner = await verifiedUser(browser, "Duenio");
    const orgName = `Albergue E2E ${Date.now().toString(36)}`;
    await owner.page.goto("/app/organizations");
    await owner.page.getByLabel("Nombre de la organización").fill(orgName);
    await owner.page.getByRole("button", { name: "Crear organización" }).click();
    await expect(owner.page.getByRole("heading", { name: orgName })).toBeVisible();
    const orgUrl = owner.page.url();

    const member = await verifiedUser(browser, "Voluntaria");
    // Invitation form defaults to the least-privileged role.
    await expect(owner.page.locator("#invite-role")).toHaveValue("member");
    await owner.page.getByRole("textbox", { name: "Correo electrónico" }).fill(member.email);
    await owner.page.getByRole("button", { name: "Invitar" }).click();
    const invitation = await linkFromEmail(member.email, /Invitación a/);

    // Someone else signed in cannot accept it.
    const outsider = await verifiedUser(browser, "Ajeno");
    await outsider.page.goto(invitation);
    await expect(outsider.page.getByText("fue enviada a otra dirección de correo")).toBeVisible();
    await expect(outsider.page.getByRole("button", { name: "Aceptar invitación" })).toHaveCount(0);

    // The invitee accepts and lands in the organization with the invited role.
    await member.page.goto(invitation);
    await member.page.getByRole("button", { name: "Aceptar invitación" }).click();
    await expect(member.page.getByRole("heading", { name: orgName })).toBeVisible();
    // A plain member cannot manage invitations or the organization.
    await expect(member.page.getByRole("button", { name: "Invitar" })).toHaveCount(0);
    await expect(member.page.getByRole("button", { name: "Guardar cambios" })).toHaveCount(0);

    // Non-members get "not found" for the organization (no existence leak).
    await outsider.page.goto(orgUrl.replace(/^https?:\/\/[^/]+/, ""));
    await expect(outsider.page.getByText(/no encontrad/i)).toBeVisible();
    await expect(outsider.page.getByRole("heading", { name: orgName })).toHaveCount(0);

    // Accepted invitations cannot be reused.
    await member.page.goto(invitation);
    await expect(member.page.getByText("Esta invitación ya fue aceptada.")).toBeVisible();

    await Promise.all([owner.context.close(), member.context.close(), outsider.context.close()]);
  });

  test("organization pages fit a phone-sized screen", async ({ browser }) => {
    const user = await verifiedUser(browser, "Movil", { width: 390, height: 844 });
    await user.page.goto("/app/organizations");
    await user.page.getByLabel("Nombre de la organización").fill(`Refugio Movil ${Date.now().toString(36)}`);
    await user.page.getByRole("button", { name: "Crear organización" }).click();
    await expect(user.page.getByRole("heading", { name: /Refugio Movil/ })).toBeVisible();
    // No horizontal overflow on a phone-sized screen.
    const overflow = await user.page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    await expect(user.page.getByRole("button", { name: "Cerrar sesión" })).toBeVisible();
    await user.context.close();
  });
});
