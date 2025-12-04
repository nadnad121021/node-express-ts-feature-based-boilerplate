import type { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { BadRequestException } from '@core/exceptions/http.exception';

/**
 * validateDto(DTO, partial = false)
 * 
 * partial = true → allows partial updates (PATCH or update operations)
 * partial = false → strict validation for create operations
 */
export const validateDto = (dtoClass: any, partial = false) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const dtoObject = plainToInstance(dtoClass, req.body);

    const errors = await validate(dtoObject, {
      whitelist: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: partial,  // 🟢 <— this enables partial validation
    });

    if (errors.length > 0) {
      const formattedErrors = errors.map((e) => ({
        property: e.property,
        constraints: e.constraints,
      }));

      return next(new BadRequestException('Validation failed', formattedErrors));
    }

    next();
  };
};
