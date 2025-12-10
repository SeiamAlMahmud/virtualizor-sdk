import { VirtualizorHttpClient } from "../../client/httpClient";

export class PlansService extends VirtualizorHttpClient {
  async list() {
    const res = await this.request("plans");
    return { plans: res.plans, time_taken: res.time_taken };
  }
}
