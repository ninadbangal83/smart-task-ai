import { config } from '@config/app.config';
import { IAuthStrategy } from './iauth.strategy';
import { JWTAuthStrategy } from './jwt.strategy';
import { SessionAuthStrategy } from './session.strategy';

export class AuthFactory {
  private static strategy: IAuthStrategy;

  static getStrategy(): IAuthStrategy {
    if (!this.strategy) {
      const type = config.AUTH_TYPE;
      this.strategy = type === 'SESSION' ? new SessionAuthStrategy() : new JWTAuthStrategy();
    }
    return this.strategy;
  }
}
