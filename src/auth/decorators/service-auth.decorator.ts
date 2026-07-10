import { SetMetadata } from '@nestjs/common';

export const SERVICE_AUTH_KEY = 'serviceAuth';

/** Allows trusted service-to-service calls authenticated via api-key header. */
export const ServiceAuth = () => SetMetadata(SERVICE_AUTH_KEY, true);
