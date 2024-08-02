import { Injectable } from '@nestjs/common';
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { DateFormatter } from 'src/shared/formatters/date.formatter';

@Injectable()
export class Task {
  @ApiHideProperty()
  id?: string;

  @IsNotEmpty()
  @ApiProperty()
  nome: string;

  @IsNotEmpty()
  @ApiProperty()
  objetivo: string;

  @ApiHideProperty()
  concluido?: boolean;
  @ApiHideProperty()
  criado_em?: string;
  @ApiHideProperty()
  alterado_em?: string;

  formatterDate = DateFormatter;

  /**
   * Cria nova instância de Task.
   *
   * @param {string} id - id da tarefa.
   * @param {string} nome - Nome da tarefa.
   * @param {string} objetivo - Objetivo da tarefa.
   */
  constructor(id: string, nome: string, objetivo: string) {
    this.id = id;
    this.nome = nome;
    this.objetivo = objetivo;
    this.concluido = false;
    this.criado_em = this.formatterDate.format(new Date());
    this.alterado_em = this.formatterDate.format(new Date());
  }

  /**
   * Marca a tarefa como concluída e atualiza a data de alteração.
   * @return {void}
   */
  marcarConcluido() {
    this.concluido = true;
    this.alterado_em = this.formatterDate.format(new Date());
  }

  /**
   * Atualiza os detalhes da tarefa.
   *
   * @param {string} nome - Novo nome da tarefa.
   * @param {string} objetivo - Atualiza o objetivo.
   * @return {void} retorno vazio
   */
  atualizarDetalhes(nome: string, objetivo: string) {
    this.nome = nome;
    this.objetivo = objetivo;
    this.alterado_em = this.formatterDate.format(new Date());
  }
}
