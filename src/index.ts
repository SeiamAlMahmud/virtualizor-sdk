import { VirtualizorConfig } from "./client/httpClient";
import { VPSService } from "./modules/vps";
import { PlansService } from "./modules/plans";

export class VirtualizorSDK {
  public vps: VPSService;
  public plans: PlansService;

  constructor(config: VirtualizorConfig) {
    this.vps = new VPSService(config);
    this.plans = new PlansService(config);
  }
}

export * from "./client/httpClient";
