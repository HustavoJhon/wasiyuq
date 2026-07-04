import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AlbergueController::index
* @see app/Http/Controllers/Admin/AlbergueController.php:11
* @route '/admin/albergues'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/albergues',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AlbergueController::index
* @see app/Http/Controllers/Admin/AlbergueController.php:11
* @route '/admin/albergues'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AlbergueController::index
* @see app/Http/Controllers/Admin/AlbergueController.php:11
* @route '/admin/albergues'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AlbergueController::index
* @see app/Http/Controllers/Admin/AlbergueController.php:11
* @route '/admin/albergues'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AlbergueController::index
* @see app/Http/Controllers/Admin/AlbergueController.php:11
* @route '/admin/albergues'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AlbergueController::index
* @see app/Http/Controllers/Admin/AlbergueController.php:11
* @route '/admin/albergues'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AlbergueController::index
* @see app/Http/Controllers/Admin/AlbergueController.php:11
* @route '/admin/albergues'
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

const AlbergueController = { index }

export default AlbergueController