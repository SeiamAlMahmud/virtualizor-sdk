// index.ts
import { VirtualizorSDK } from "../dist/index.js"; // local dist path

async function main() {
  const sdk = new VirtualizorSDK({
    hostname: "54.99.145.125",
    adminapikey: "api_key",
    adminapipass: "api_pass",
    port: 4085,
  });

  try {
    // ========== VPS ==========

    const vpsList = await sdk.vps.list();
    // console.log("VPS List:", vpsList);

    // Restart first VPS safely
    const vpsIds = Object.keys(vpsList || {});
    if (vpsIds.length > 0) {
      const vpsId = Number(vpsIds[0]);

      if (!isNaN(vpsId)) {
        const restartRes = await sdk.vps.restart(vpsId);
        console.log(`Restart VPS ${vpsId}:`, restartRes);
      } else {
        console.warn("Invalid VPS ID, cannot restart.");
      }
    } else {
      console.log("No VPS found to restart.");
    }

    // ========== Plans ==========

    const plans = await sdk.plans.list();
    // console.log("Available Plans:", plans);
  } catch (err) {
    console.error("Error:", err);
  }
}

main();
