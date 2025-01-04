import { Response } from 'express';

class ErroBase extends Error {
  status: number;
  constructor(msgErro = 'Erro interno do Servidor', status = 500) {
    super();
    this.message = msgErro;
    this.status = status;
  }

  enviarRes(res: Response) {
    res.status(this.status).send({
      msg: this.message,
      status: this.status,
    });
  }
}

export { ErroBase };
