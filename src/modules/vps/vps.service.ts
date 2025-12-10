import { VirtualizorHttpClient } from "../../client/httpClient";

export class VPSService extends VirtualizorHttpClient {
  async list() {
    const res = await this.request("vs");
    return this.config.isRawResponse ? res : res.vs || {};
  }

  async get(vpsId: number) {
    if (!vpsId) throw new Error("vpsId is required");

    const res = await this.request("vs", { vpsid: vpsId });
    return this.config.isRawResponse ? res : res.vs?.[vpsId];
  }

  async start(vpsId: number) {
    return this.simpleAction("start", { vpsid: vpsId });
  }

  async stop(vpsId: number) {
    return this.simpleAction("stop", { vpsid: vpsId });
  }

  async restart(vpsId: number | string) {
    return this.simpleAction("vs", { action: "restart", vpsid: vpsId }, "POST");
  }

  async ram(vpsId: number) {
    const res = await this.request("ram", { svs: vpsId });
    return { ram: res.ram, time_taken: res.time_taken };
  }

  async cpu(vpsId: number) {
    const res = await this.request("cpu", { svs: vpsId });
    return { cpu: res.cpu, time_taken: res.time_taken };
  }

  async disk(vpsId: number) {
    const res = await this.request("disk", { changeserid: vpsId });
    return { disk: res.disk, time_taken: res.time_taken };
  }

  async bandwidth(vpsId: number, month: string) {
    const res = await this.request("bandwidth", { changeserid: vpsId });
    return {
      bandwidth: res.bandwidth?.[month],
      time_taken: res.time_taken,
    };
  }

  // === Additional Virtualizor actions ===

  async suspend(vpsId: number) {
    return this.simpleAction("suspend", { vpsid: vpsId });
  }

  async unsuspend(vpsId: number) {
    return this.simpleAction("unsuspend", { vpsid: vpsId });
  }

  async destroy(vpsId: number) {
    return this.simpleAction("destroy", { vpsid: vpsId });
  }

  async reboot(vpsId: number) {
    return this.simpleAction("reboot", { vpsid: vpsId });
  }

  async edit(vpsId: number, options: Record<string, any>) {
    if (!vpsId) throw new Error("vpsId is required");
    return this.simpleAction("editvs", { vpsid: vpsId, ...options }, "POST");
  }

  async create(options: Record<string, any>) {
    return this.simpleAction("addvs", options, "POST");
  }

  async isoList() {
    const res = await this.request("iso");
    return this.config.isRawResponse ? res : res.iso || [];
  }

  async isoMount(vpsId: number, iso: string) {
    return this.simpleAction("mountiso", { vpsid: vpsId, iso });
  }

  async isoUnmount(vpsId: number) {
    return this.simpleAction("umountiso", { vpsid: vpsId });
  }
}
