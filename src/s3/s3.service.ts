import * as moment from 'moment';
import { SHA256 } from "@/shared/crypto";
import { AxiosRequestHeaders, HttpClient } from "@/shared/http";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class S3Service extends HttpClient {
  
  private region: string;

  constructor(
    private readonly config: ConfigService,
  ) {
    super();
    this.disableLog();
    this.setBaseUrl(this.config.get<string>('S3_HOST'));
    this.region = this.config.get<string>('S3_REGION') || 'us-east-1';
  }

  private generateAuthorization(uri: string, amzDate: string, payload: Buffer) {
    const dateStamp = amzDate.substring(0, 8);
    const host = new URL(this.config.get<string>('S3_HOST')).host;
    const canonicalHeaders = `host:${host}\n`;
    const signedHeaders = 'host';
    const payloadHash = SHA256.encode(payload);
    const canonicalRequest = [
      "PUT",
      uri,
      "",
      canonicalHeaders,
      signedHeaders,
      payloadHash,
    ].join("\n");
    const algorithm = "AWS4-HMAC-SHA256";
    const credentialScope = `${dateStamp}/${this.region}/s3/aws4_request`;
    const stringToSign = [
      algorithm,
      amzDate,
      credentialScope,
      SHA256.encode(canonicalRequest),
    ].join("\n");
    const kDate = SHA256.createHmac(dateStamp, `AWS4${this.config.get<string>('S3_CLIENT_SECRET')}`);
    const kRegion = SHA256.createHmac(this.region, kDate);
    const kService = SHA256.createHmac('s3', kRegion);
    const signingKey = SHA256.createHmac('aws4_request', kService);
    const signature = SHA256.createHmac(stringToSign, signingKey);
    const authorizationHeader = `${algorithm} Credential=${this.config.get<string>('S3_CLIENT_ID')}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
    return authorizationHeader;
  }

  private generateHeaders(uri: string, payload: Buffer, mimetype: string) {
    const now = moment();
    const amzDate = now.clone().toDate().toISOString().replace(/[:-]|\.\d{3}/g, "");
    return {
      'Content-Type': mimetype,
      "Content-Length": payload.length,
      'x-amz-acl': 'public-read',
      'x-amz-date': amzDate,
      'Authorization': this.generateAuthorization(uri, amzDate, payload),
    } as any as AxiosRequestHeaders;
  }

  async upload(bucket: string, fileBuffer: Buffer, fileName: string, mimetype: string) {
    const endpoint = `/${bucket}/${fileName}`;
    await this.put(endpoint, fileBuffer, {
      headers: this.generateHeaders(endpoint, fileBuffer, mimetype)
    })
    return `${this.config.get<string>('S3_HOST')}${endpoint}`;
  }
}