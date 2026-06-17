import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Adopter\ApplicationController::index
* @see app/Http/Controllers/Adopter/ApplicationController.php:18
* @route '/mi-adopcion/postulaciones'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/mi-adopcion/postulaciones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Adopter\ApplicationController::index
* @see app/Http/Controllers/Adopter/ApplicationController.php:18
* @route '/mi-adopcion/postulaciones'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Adopter\ApplicationController::index
* @see app/Http/Controllers/Adopter/ApplicationController.php:18
* @route '/mi-adopcion/postulaciones'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Adopter\ApplicationController::index
* @see app/Http/Controllers/Adopter/ApplicationController.php:18
* @route '/mi-adopcion/postulaciones'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Adopter\ApplicationController::index
* @see app/Http/Controllers/Adopter/ApplicationController.php:18
* @route '/mi-adopcion/postulaciones'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Adopter\ApplicationController::index
* @see app/Http/Controllers/Adopter/ApplicationController.php:18
* @route '/mi-adopcion/postulaciones'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Adopter\ApplicationController::index
* @see app/Http/Controllers/Adopter/ApplicationController.php:18
* @route '/mi-adopcion/postulaciones'
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

const applications = {
    index: Object.assign(index, index),
}

export default applications