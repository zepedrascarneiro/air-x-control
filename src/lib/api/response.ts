/**
 * API Response Helper
 * 
 * Padroniza todas as respostas da API para garantir consistência
 * entre Web, PWA e Apps nativos.
 */

import { NextResponse } from 'next/server';

// Tipos
export interface ApiMeta {
  timestamp: string;
  version: string;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T;
  meta: ApiMeta;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta: ApiMeta;
}

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiListResponse<T> {
  success: true;
  data: T[];
  pagination: PaginationInfo;
  meta: ApiMeta;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse | ApiListResponse<T>;

// Códigos de erro padrão
export const ErrorCodes = {
  // Autenticação
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  SESSION_EXPIRED: 'SESSION_EXPIRED',
  TOKEN_INVALID: 'TOKEN_INVALID',
  
  // Validação
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  MISSING_FIELD: 'MISSING_FIELD',
  INVALID_FORMAT: 'INVALID_FORMAT',
  
  // Recursos
  NOT_FOUND: 'NOT_FOUND',
  ALREADY_EXISTS: 'ALREADY_EXISTS',
  CONFLICT: 'CONFLICT',
  
  // Servidor
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  SERVICE_UNAVAILABLE: 'SERVICE_UNAVAILABLE',
  
  // Rate limiting
  TOO_MANY_REQUESTS: 'TOO_MANY_REQUESTS',
} as const;

export type ErrorCode = typeof ErrorCodes[keyof typeof ErrorCodes];

// Helper para criar meta
function createMeta(): ApiMeta {
  return {
    timestamp: new Date().toISOString(),
    version: '1.0',
  };
}

/**
 * Resposta de sucesso
 */
export function apiSuccess<T>(data: T, status: number = 200): NextResponse<ApiSuccessResponse<T>> {
  return NextResponse.json(
    {
      success: true as const,
      data,
      meta: createMeta(),
    },
    { status }
  );
}

/**
 * Resposta de sucesso para criação (201)
 */
export function apiCreated<T>(data: T): NextResponse<ApiSuccessResponse<T>> {
  return apiSuccess(data, 201);
}

/**
 * Resposta de lista com paginação
 */
export function apiList<T>(
  data: T[],
  pagination: { page: number; limit: number; total: number }
): NextResponse<ApiListResponse<T>> {
  return NextResponse.json(
    {
      success: true as const,
      data,
      pagination: {
        ...pagination,
        totalPages: Math.ceil(pagination.total / pagination.limit),
      },
      meta: createMeta(),
    },
    { status: 200 }
  );
}

/**
 * Resposta de erro
 */
export function apiError(
  code: ErrorCode,
  message: string,
  status: number = 400,
  details?: Record<string, unknown>
): NextResponse<ApiErrorResponse> {
  return NextResponse.json(
    {
      success: false as const,
      error: {
        code,
        message,
        ...(details && { details }),
      },
      meta: createMeta(),
    },
    { status }
  );
}

// Erros comuns pré-definidos
export const ApiErrors = {
  unauthorized: (message = 'Não autorizado') => 
    apiError(ErrorCodes.UNAUTHORIZED, message, 401),
  
  forbidden: (message = 'Acesso negado') => 
    apiError(ErrorCodes.FORBIDDEN, message, 403),
  
  notFound: (resource = 'Recurso') => 
    apiError(ErrorCodes.NOT_FOUND, `${resource} não encontrado`, 404),
  
  invalidCredentials: () => 
    apiError(ErrorCodes.INVALID_CREDENTIALS, 'Email ou senha incorretos', 401),
  
  validationError: (message: string, details?: Record<string, unknown>) => 
    apiError(ErrorCodes.VALIDATION_ERROR, message, 400, details),
  
  missingField: (field: string) => 
    apiError(ErrorCodes.MISSING_FIELD, `Campo obrigatório: ${field}`, 400, { field }),
  
  alreadyExists: (resource: string) => 
    apiError(ErrorCodes.ALREADY_EXISTS, `${resource} já existe`, 409),
  
  internalError: (message = 'Erro interno do servidor') => 
    apiError(ErrorCodes.INTERNAL_ERROR, message, 500),
  
  tooManyRequests: (retryAfter?: number) => 
    apiError(
      ErrorCodes.TOO_MANY_REQUESTS, 
      'Muitas requisições. Tente novamente mais tarde.',
      429,
      retryAfter ? { retryAfter } : undefined
    ),
};

/**
 * Wrapper para tratamento de erros em endpoints
 */
export async function withErrorHandler<T>(
  handler: () => Promise<NextResponse<T | ApiErrorResponse>>
): Promise<NextResponse<T | ApiErrorResponse>> {
  try {
    return await handler();
  } catch (error) {
    console.error('[API Error]', error);
    
    if (error instanceof Error) {
      // Erros conhecidos do Prisma
      if (error.message.includes('Unique constraint')) {
        return ApiErrors.alreadyExists('Registro') as NextResponse<ApiErrorResponse>;
      }
      if (error.message.includes('Record to update not found')) {
        return ApiErrors.notFound('Registro') as NextResponse<ApiErrorResponse>;
      }
    }
    
    return ApiErrors.internalError() as NextResponse<ApiErrorResponse>;
  }
}

/**
 * Parser de query params para paginação
 */
export function parsePagination(searchParams: URLSearchParams): { page: number; limit: number; skip: number } {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20', 10)));
  const skip = (page - 1) * limit;
  
  return { page, limit, skip };
}

/**
 * Parser de query params para ordenação
 */
export function parseSort(searchParams: URLSearchParams, allowedFields: string[]): { 
  orderBy: Record<string, 'asc' | 'desc'> 
} {
  const sortField = searchParams.get('sort') || 'createdAt';
  const sortOrder = (searchParams.get('order') || 'desc') as 'asc' | 'desc';
  
  // Validar campo permitido
  const field = allowedFields.includes(sortField) ? sortField : 'createdAt';
  
  return {
    orderBy: { [field]: sortOrder },
  };
}
