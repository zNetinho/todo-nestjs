import { ErroBase } from './error_base';

class RequestIncorreta extends ErroBase {
  constructor(
    msg = 'Um ou mais dados fornecidos estão incorretos, por favor verifique e tente novamente.',
  ) {
    super(msg, 400);
  }
}

export { RequestIncorreta };
