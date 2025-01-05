import { SessionPayloadSchemaType } from '@hyperlog/shared';

import { ErrorResponseHandler, SuccessResponseHandler } from '../middlewares/jsonResponse.ts';

export type App = {
  Variables: {
    success: SuccessResponseHandler;
    error: ErrorResponseHandler;
    session: SessionPayloadSchemaType;
  };
};
