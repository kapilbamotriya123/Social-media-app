import { createRouteHandler } from 'uploadthing/next';

import { fileRouter } from '@/app/api/uploadThing/core';

export const { GET, POST } = createRouteHandler({ router: fileRouter });
