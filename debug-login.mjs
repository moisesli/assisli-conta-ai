// Quick diagnostic script to check what happens during login
import { chromium } from "playwright";

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

page.on("console", (msg) => console.log("CONSOLE:", msg.type(), msg.text()));
page.on("pageerror", (err) => console.log("PAGE_ERROR:", err.message));
page.on("requestfailed", (req) =>
  console.log("REQUEST_FAILED:", req.url(), req.failure()?.errorText),
);

await page.goto("http://localhost:3000/login", { waitUntil: "networkidle" });
console.log("--- Page loaded ---");

await page.getByPlaceholder("Email").fill("amoiseslinares@gmail.com");
await page.getByPlaceholder("Contraseña").fill("123456");
await page.getByRole("button", { name: "Iniciar sesión" }).click();

// Wait for either navigation or some time
await page.waitForTimeout(5000);

console.log("--- After click ---");
console.log("URL:", page.url());

// Get the error message text if any
const errorText = await page
  .locator(".error")
  .textContent()
  .catch(() => "no .error element found");
console.log("Error text:", errorText);

// Check button state and text
const btnText = await page
  .getByRole("button", { name: /iniciar/i })
  .textContent()
  .catch(() => "no button found");
console.log("Button text:", btnText);

// Get inner HTML
const html = await page.evaluate(() =>
  document.body.innerHTML.substring(0, 3000),
);
console.log("HTML snippet:", html);

await browser.close();
