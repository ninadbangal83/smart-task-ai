<?php

namespace App\Exceptions;

use RuntimeException;

/**
 * Base application exception — mirrors AppError from Node backends.
 * 
 * Node equivalent:
 *   export class AppError extends Error {
 *     constructor(public message: string, public statusCode: number) { ... }
 *   }
 */
class AppException extends RuntimeException
{
    public function __construct(string $message, public readonly int $statusCode = 500)
    {
        parent::__construct($message);
    }
}

/**
 * 404 Not Found — mirrors NotFoundError
 */
class NotFoundException extends AppException
{
    public function __construct(string $message = 'Resource not found')
    {
        parent::__construct($message, 404);
    }
}

/**
 * 400 Bad Request — mirrors BadRequestError
 */
class BadRequestException extends AppException
{
    public function __construct(string $message = 'Bad request')
    {
        parent::__construct($message, 400);
    }
}

/**
 * 401 Unauthorized — mirrors UnauthorizedError
 */
class UnauthorizedException extends AppException
{
    public function __construct(string $message = 'Unauthorized')
    {
        parent::__construct($message, 401);
    }
}

/**
 * 403 Forbidden — mirrors ForbiddenError
 */
class ForbiddenException extends AppException
{
    public function __construct(string $message = 'Forbidden')
    {
        parent::__construct($message, 403);
    }
}
