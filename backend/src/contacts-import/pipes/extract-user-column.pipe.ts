import { Inject, Injectable, PipeTransform, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';

@Injectable({ scope: Scope.REQUEST })
export class ExtractUserColumnsPipe implements PipeTransform<any> {
  constructor(@Inject(REQUEST) protected readonly request: Request) {}
  transform(value: any) {
    const userDefinedColumns = Object.keys(this.request.body).reduce(
      (container, col) => {
        container[this.request.body[col]] = col;
        return container;
      },
      {},
    );
    return { ...value, userDefinedColumns };
  }
}
