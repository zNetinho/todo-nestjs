import { HttpStatus } from '@nestjs/common';
import { ErroBase } from './error_base';

class NotFound extends ErroBase {
  constructor(msg = 'Pagina/Recurso não encontrada') {
    super(msg, HttpStatus.NOT_FOUND);
  }
}

export { NotFound };
