import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetPayload = createParamDecorator(
  (param: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    if (param) {
      return request.user[param];
    }

    return request.user;
  },
);
