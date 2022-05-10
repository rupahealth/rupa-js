import type Rupa from "../client";

export class Resource {
  // @ts-ignore
  protected request: typeof Rupa.prototype.request;

  // @ts-ignore
  constructor(request: typeof Rupa.prototype.request) {
    this.request = request;
  }
}
