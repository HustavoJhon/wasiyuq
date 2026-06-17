import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Adopter\DashboardController::index
* @see app/Http/Controllers/Adopter/DashboardController.php:13
* @route '/mi-adopcion/inicio'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/mi-adopcion/inicio',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Adopter\DashboardController::index
* @see app/Http/Controllers/Adopter/DashboardController.php:13
* @route '/mi-adopcion/inicio'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Adopter\DashboardController::index
* @see app/Http/Controllers/Adopter/DashboardController.php:13
* @route '/mi-adopcion/inicio'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Adopter\DashboardController::index
* @see app/Http/Controllers/Adopter/DashboardController.php:13
* @route '/mi-adopcion/inicio'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Adopter\DashboardController::index
* @see app/Http/Controllers/Adopter/DashboardController.php:13
* @route '/mi-adopcion/inicio'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Adopter\DashboardController::index
* @see app/Http/Controllers/Adopter/DashboardController.php:13
* @route '/mi-adopcion/inicio'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Adopter\DashboardController::index
* @see app/Http/Controllers/Adopter/DashboardController.php:13
* @route '/mi-adopcion/inicio'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

const dashboard = {
    index: Object.assign(index, index),
}

export default dashboard