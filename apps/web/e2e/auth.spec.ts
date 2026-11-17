import { expect, test } from "@playwright/test";
import { emailCount, linkFromEmail, login, newClient, PASSWORD, register, sessionCookie, uniqueEmail, verifiedUser } from "./support";

test.describe("authentication", () => {
  test("registration → verification email → signed in, with a hardened session cookie", async ({ browser }) => {
    const { context, page } = await newClient(browser);
    const email = uniqueEmail("ana");
    await register(page, "Ana", email);
    // Registration alone opens no session.
    expect(await sessionCookie(context)).toBeUndefined();

    await page.goto(await linkFromEmail(email, /Verifica tu correo/));
    await expect(page.getByRole("heading", { name: "Hola, Ana" })).toBeVisible();
    await expect(page.getByText("Tu correo fue verificado correctamente.")).toBeVisible();

    const cookie = await sessionCookie(context);
    expect(cookie).toBeDefined();
    expect(cookie!.httpOnly).toBe(true);
    expect(cookie!.sameSite).toBe("Lax");
    // httpOnly: page scripts cannot read the session.
    expect(await page.evaluate(() => document.cookie)).not.toContain("session_token");
    await context.close();
  });

  test("registering an existing email looks identical and notifies the owner instead", async ({ browser }) => {
    const owner = await verifiedUser(browser, "Duena");
    const { context, page } = await newClient(browser);
    await register(page, "Intruso", owner.email);
    await expect.poll(() => emailCount(owner.email, /Intento de registro/)).toBe(1);
    await context.close();
    await owner.context.close();
  });

  test("logout ends the session; protected pages redirect to login", async ({ browser }) => {
    const { context, page } = await verifiedUser(browser, "Luis");
    await page.getByRole("button", { name: "Cerrar sesión" }).click();
    await expect(page).toHaveURL(/\/login/);
    expect(await sessionCookie(context)).toBeUndefined();
    await page.goto("/app/profile");
    await expect(page).toHaveURL(/\/login\?redirect=/);
    await context.close();
  });

  test("wrong password and unknown email get the same generic error", async ({ browser }) => {
    const { context, page, email } = await verifiedUser(browser, "Rosa");
    await page.getByRole("button", { name: "Cerrar sesión" }).click();
    await login(page, email, "wrong-password-123");
    const wrong = await page.getByRole("alert").innerText();
    await login(page, uniqueEmail("ghost"), "wrong-password-123");
    const unknown = await page.getByRole("alert").innerText();
    expect(wrong).toBe(unknown);
    await context.close();
  });

  test("password recovery: email link, new password, old sessions revoked, link single-use", async ({ browser }) => {
    const first = await verifiedUser(browser, "Carla");
    const { context, page } = await newClient(browser);
    await page.goto("/forgot-password");
    await page.getByLabel("Correo electrónico").fill(first.email);
    await page.getByRole("button", { name: "Enviar enlace" }).click();
    await expect(page.getByText("Si existe una cuenta con ese correo")).toBeVisible();

    const link = await linkFromEmail(first.email, /Restablece tu contraseña/);
    await page.goto(link);
    await page.getByLabel("Nueva contraseña").fill("brand-new-password-9");
    await page.getByLabel("Confirmar contraseña").fill("brand-new-password-9");
    await page.getByRole("button", { name: "Guardar contraseña" }).click();
    await expect(page).toHaveURL(/\/login\?reset=/);
    await expect.poll(() => emailCount(first.email, /Tu contraseña de WASIYUQ cambió/)).toBe(1);

    // The session opened before the reset is gone.
    await first.page.goto("/app/profile");
    await expect(first.page).toHaveURL(/\/login/);

    await login(page, first.email, PASSWORD);
    await expect(page.getByRole("alert")).toBeVisible();
    await login(page, first.email, "brand-new-password-9");
    await expect(page.getByRole("heading", { name: "Hola, Carla" })).toBeVisible();

    // Reusing the link fails: the server rejects the consumed token and the form stays disabled.
    const reuse = await newClient(browser);
    await reuse.page.goto(link);
    await expect(reuse.page).toHaveURL(/\/reset-password\?error=INVALID_TOKEN/);
    await expect(reuse.page.getByRole("alert")).toBeVisible();
    await expect(reuse.page.getByRole("button", { name: "Guardar contraseña" })).toBeDisabled();
    await Promise.all([context.close(), first.context.close(), reuse.context.close()]);
  });

  test("password recovery for an unknown email shows the same confirmation and sends nothing", async ({ browser }) => {
    const { context, page } = await newClient(browser);
    const ghost = uniqueEmail("nobody");
    await page.goto("/forgot-password");
    await page.getByLabel("Correo electrónico").fill(ghost);
    await page.getByRole("button", { name: "Enviar enlace" }).click();
    await expect(page.getByText("Si existe una cuenta con ese correo")).toBeVisible();
    await page.waitForTimeout(1000);
    expect(await emailCount(ghost, /./)).toBe(0);
    await context.close();
  });
});
