import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { GOOGLE_OAUTH_CLIENT_ID } from '../Helpers/Config';

class GoogleAdapter {
  public static readonly client = new OAuth2Client(GOOGLE_OAUTH_CLIENT_ID);

  public static async verify(token: string): Promise<TokenPayload | undefined> {
    try {
      const ticket = await this.client.verifyIdToken({
        idToken: token,
        audience: GOOGLE_OAUTH_CLIENT_ID,
      });
      const payload = ticket.getPayload();

      return payload;
    } catch (error: any) {
      throw new Error('Invalid token');
    }
  }
}
