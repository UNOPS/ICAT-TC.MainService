import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/** Marks a route as accessible without a JWT (e.g. password reset, registration). */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
