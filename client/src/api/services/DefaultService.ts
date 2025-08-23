/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Register a new user
     * @param requestBody
     * @returns any User created
     * @throws ApiError
     */
    public static postAuthSignup(
        requestBody: {
            email: string;
            password: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/signup',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Login and receive JWT token
     * @param requestBody
     * @returns any Token returned
     * @throws ApiError
     */
    public static postAuthLogin(
        requestBody: {
            email: string;
            password: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/auth/login',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * List all user expenses
     * @param start Start date
     * @param end End date
     * @param category
     * @param type
     * @returns any List of expenses
     * @throws ApiError
     */
    public static getExpenses(
        start?: string,
        end?: string,
        category?: string,
        type?: 'recurring' | 'one-time',
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/expenses',
            query: {
                'start': start,
                'end': end,
                'category': category,
                'type': type,
            },
        });
    }
    /**
     * Create a new expense
     * @param formData
     * @returns any Expense created
     * @throws ApiError
     */
    public static postExpenses(
        formData?: {
            amount: number;
            date: string;
            categoryId: string;
            description?: string;
            type?: 'one-time' | 'recurring';
            startDate?: string;
            endDate?: string;
            receipt?: Blob;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/expenses',
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * Get a single expense
     * @param id
     * @returns any Expense data
     * @throws ApiError
     */
    public static getExpenses1(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/expenses/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update an expense
     * @param id
     * @param formData
     * @returns any Expense updated
     * @throws ApiError
     */
    public static putExpenses(
        id: string,
        formData?: {
            amount?: number;
            date?: string;
            categoryId?: string;
            description?: string;
            type?: 'one-time' | 'recurring';
            startDate?: string;
            endDate?: string;
            receipt?: Blob;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/expenses/{id}',
            path: {
                'id': id,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
        });
    }
    /**
     * Delete an expense
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static deleteExpenses(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/expenses/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * List all incomes
     * @param start
     * @param end
     * @returns any List of incomes
     * @throws ApiError
     */
    public static getIncomes(
        start?: string,
        end?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/incomes',
            query: {
                'start': start,
                'end': end,
            },
        });
    }
    /**
     * Create new income
     * @param requestBody
     * @returns any Income created
     * @throws ApiError
     */
    public static postIncomes(
        requestBody?: {
            amount: number;
            date: string;
            source?: string;
            description?: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/incomes',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Get an income entry
     * @param id
     * @returns any Income data
     * @throws ApiError
     */
    public static getIncomes1(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/incomes/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Update an income entry
     * @param id
     * @param requestBody
     * @returns any Income updated
     * @throws ApiError
     */
    public static putIncomes(
        id: string,
        requestBody?: {
            amount?: number;
            date?: string;
            source?: string;
            description?: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/incomes/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete an income entry
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static deleteIncomes(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/incomes/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * List user categories
     * @returns any List of categories
     * @throws ApiError
     */
    public static getCategories(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/categories',
        });
    }
    /**
     * Create new category
     * @param requestBody
     * @returns any Category created
     * @throws ApiError
     */
    public static postCategories(
        requestBody?: {
            name: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/categories',
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Rename a category
     * @param id
     * @param requestBody
     * @returns any Category updated
     * @throws ApiError
     */
    public static putCategories(
        id: string,
        requestBody?: {
            name?: string;
        },
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/categories/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Delete a category
     * @param id
     * @returns void
     * @throws ApiError
     */
    public static deleteCategories(
        id: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/categories/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Get current month summary
     * @param month
     * @returns any Monthly summary
     * @throws ApiError
     */
    public static getSummaryMonthly(
        month?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/summary/monthly',
            query: {
                'month': month,
            },
        });
    }
    /**
     * Get summary for custom range
     * @param start
     * @param end
     * @returns any Summary
     * @throws ApiError
     */
    public static getSummary(
        start?: string,
        end?: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/summary',
            query: {
                'start': start,
                'end': end,
            },
        });
    }
    /**
     * Budget overrun alert
     * @returns any Alert info
     * @throws ApiError
     */
    public static getSummaryAlerts(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/summary/alerts',
        });
    }
    /**
     * Download/view receipt
     * @param id
     * @returns any Receipt file
     * @throws ApiError
     */
    public static getReceipts(
        id: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/receipts/{id}',
            path: {
                'id': id,
            },
        });
    }
    /**
     * Get user profile
     * @returns any Profile info
     * @throws ApiError
     */
    public static getUserProfile(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/profile',
        });
    }
}
