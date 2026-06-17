import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Admin\AdoptionController::index
* @see app/Http/Controllers/Admin/AdoptionController.php:12
* @route '/admin/adopciones'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/adopciones',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdoptionController::index
* @see app/Http/Controllers/Admin/AdoptionController.php:12
* @route '/admin/adopciones'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdoptionController::index
* @see app/Http/Controllers/Admin/AdoptionController.php:12
* @route '/admin/adopciones'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdoptionController::index
* @see app/Http/Controllers/Admin/AdoptionController.php:12
* @route '/admin/adopciones'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AdoptionController::index
* @see app/Http/Controllers/Admin/AdoptionController.php:12
* @route '/admin/adopciones'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdoptionController::index
* @see app/Http/Controllers/Admin/AdoptionController.php:12
* @route '/admin/adopciones'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdoptionController::index
* @see app/Http/Controllers/Admin/AdoptionController.php:12
* @route '/admin/adopciones'
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

/**
* @see \App\Http\Controllers\Admin\AdoptionController::show
* @see app/Http/Controllers/Admin/AdoptionController.php:79
* @route '/admin/adopciones/{adoption}'
*/
export const show = (args: { adoption: number | { id: number } } | [adoption: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/admin/adopciones/{adoption}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Admin\AdoptionController::show
* @see app/Http/Controllers/Admin/AdoptionController.php:79
* @route '/admin/adopciones/{adoption}'
*/
show.url = (args: { adoption: number | { id: number } } | [adoption: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { adoption: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { adoption: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            adoption: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        adoption: typeof args.adoption === 'object'
        ? args.adoption.id
        : args.adoption,
    }

    return show.definition.url
            .replace('{adoption}', parsedArgs.adoption.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Admin\AdoptionController::show
* @see app/Http/Controllers/Admin/AdoptionController.php:79
* @route '/admin/adopciones/{adoption}'
*/
show.get = (args: { adoption: number | { id: number } } | [adoption: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdoptionController::show
* @see app/Http/Controllers/Admin/AdoptionController.php:79
* @route '/admin/adopciones/{adoption}'
*/
show.head = (args: { adoption: number | { id: number } } | [adoption: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Admin\AdoptionController::show
* @see app/Http/Controllers/Admin/AdoptionController.php:79
* @route '/admin/adopciones/{adoption}'
*/
const showForm = (args: { adoption: number | { id: number } } | [adoption: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdoptionController::show
* @see app/Http/Controllers/Admin/AdoptionController.php:79
* @route '/admin/adopciones/{adoption}'
*/
showForm.get = (args: { adoption: number | { id: number } } | [adoption: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Admin\AdoptionController::show
* @see app/Http/Controllers/Admin/AdoptionController.php:79
* @route '/admin/adopciones/{adoption}'
*/
showForm.head = (args: { adoption: number | { id: number } } | [adoption: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const adoptions = {
    index: Object.assign(index, index),
    show: Object.assign(show, show),
}

export default adoptions