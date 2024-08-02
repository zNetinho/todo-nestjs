import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  /**
   * This method is called by Nest after the module is initialized.
   * It is used to connect to the Prisma database.
   * @returns {Promise<void>}
   */
  async onModuleInit(): Promise<void> {
    // Connect to the Prisma database
    await this.$connect();
  }
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    total: number;
    lastPage: number;
    currentPage: number;
    perPage: number;
    prev: number | string;
    next: number | string;
  };
}

export type PaginateOptions = {
  page?: number | string;
  perPage?: number | string;
};
export type PaginateFunction = <T, K>(
  model: any,
  args?: K,
  options?: PaginateOptions,
) => Promise<PaginatedResult<T>>;

export const paginator = (
  defaultOptions: PaginateOptions,
): PaginateFunction => {
  return async (model, args: any = { where: undefined }, options) => {
    const page = Number(options?.page || defaultOptions?.page) || 1;
    const perPage = Number(options?.perPage || defaultOptions?.perPage) || 10;

    const skip = page > 0 ? perPage * (page - 1) : 0;
    const [total, data] = await Promise.all([
      model.count({ where: args.where }),
      model.findMany({
        ...args,
        take: perPage,
        skip,
      }),
    ]);
    const lastPage = Math.ceil(total / perPage);
    const pagePrev = `${process.env.BASE_URL}${model.name.toLowerCase()}?page=${page > 1 ? page - 1 : ''}`;
    const pageNext = `${process.env.BASE_URL}${model.name.toLowerCase()}?page=${page < lastPage ? page + 1 : ''}`;

    return {
      data,
      meta: {
        total,
        lastPage,
        currentPage: page,
        perPage,
        prev: pagePrev,
        next: pageNext,
      },
    };
  };
};
