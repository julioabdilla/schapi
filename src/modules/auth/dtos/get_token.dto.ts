import { Expose } from "class-transformer";

export class GetToken {
  @Expose({ name: 'grant_type' })
  grantType: string;
}

export class GetTokenResponse {
  token: string;
  @Expose({ name: 'expires_at'})
  expiresAt: string;
}