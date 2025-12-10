import axios, { AxiosInstance } from "axios";
import https from "https";

export interface VirtualizorConfig {
  hostname: string;
  port?: number;
  adminapikey: string;
  adminapipass: string;
  isRawResponse?: boolean;
}

export class VirtualizorHttpClient {
  protected client: AxiosInstance;
  protected config: Required<VirtualizorConfig>;

  constructor(config: VirtualizorConfig) {
    this.config = {
      hostname: config.hostname,
      port: config.port ?? 4085,
      adminapikey: config.adminapikey,
      adminapipass: config.adminapipass,
      isRawResponse: config.isRawResponse ?? false,
    };

    this.client = axios.create({
      baseURL: `https://${this.config.hostname}:${this.config.port}`,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
  }

  /**
   *  SAME IDEA AS YOUR buildQuery()
   */
  protected buildQuery(params: Record<string, any> = {}): string {
    const query: Record<string, any> = {
      api: "json",
      adminapikey: this.config.adminapikey,
      adminapipass: this.config.adminapipass,
      ...params,
    };

    Object.keys(query).forEach(
      (key) => query[key] === undefined && delete query[key]
    );

    return `?${new URLSearchParams(query).toString()}`;
  }

  /**
   *  SAME IDEA AS YOUR request()
   */
  protected async request(
    action: string,
    params: Record<string, any> = {},
    method: "GET" | "POST" = "GET"
  ): Promise<any> {
    const url = `/index.php${this.buildQuery({
      act: action,
      ...params,
    })}`;

    const res = await this.client.request({
      url,
      method,
    });

    return res.data;
  }

  /**
   * Generic simple action handler
   * @param act - The module/action (e.g., 'vs', 'addvs')
   * @param params - All query/body params
   * @param method - 'GET' or 'POST'
   */
  public async simpleAction<T = any>(
    act: string,
    params: Record<string, any> = {},
    method: "GET" | "POST" = "POST"
  ): Promise<{ success: boolean; message?: string; data?: T; error?: string }> {
    try {
      const data = await this.request(act, params, method);

      // Virtualizor VPS action response
      const success = data.done === true || data.done === "1";

      return {
        success,
        message: data.done_msg,
        data,
        error: success ? undefined : data.error_msg ?? "Unknown error",
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.message ?? "Request failed",
      };
    }
  }
}
