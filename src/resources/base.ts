import APIClient from "../api-client";

export class Resource {
  protected apiClient:  APIClient;

  constructor(apiClient: APIClient) {
    this.apiClient = apiClient;
  }
}
