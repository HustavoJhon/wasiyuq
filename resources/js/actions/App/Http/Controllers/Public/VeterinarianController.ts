import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Public\VeterinarianController::index
* @see app/Http/Controllers/Public/VeterinarianController.php:14
* @route '/veterinarias'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/veterinarias',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\VeterinarianController::index
* @see app/Http/Controllers/Public/VeterinarianController.php:14
* @route '/veterinarias'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\VeterinarianController::index
* @see app/Http/Controllers/Public/VeterinarianController.php:14
* @route '/veterinarias'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\VeterinarianController::index
* @see app/Http/Controllers/Public/VeterinarianController.php:14
* @route '/veterinarias'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Public\VeterinarianController::index
* @see app/Http/Controllers/Public/VeterinarianController.php:14
* @route '/veterinarias'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\VeterinarianController::index
* @see app/Http/Controllers/Public/VeterinarianController.php:14
* @route '/veterinarias'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\VeterinarianController::index
* @see app/Http/Controllers/Public/VeterinarianController.php:14
* @route '/veterinarias'
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
* @see \App\Http\Controllers\Public\VeterinarianController::show
* @see app/Http/Controllers/Public/VeterinarianController.php:56
* @route '/veterinarias/{id}'
*/
export const show = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/veterinarias/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\VeterinarianController::show
* @see app/Http/Controllers/Public/VeterinarianController.php:56
* @route '/veterinarias/{id}'
*/
show.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return show.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\VeterinarianController::show
* @see app/Http/Controllers/Public/VeterinarianController.php:56
* @route '/veterinarias/{id}'
*/
show.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\VeterinarianController::show
* @see app/Http/Controllers/Public/VeterinarianController.php:56
* @route '/veterinarias/{id}'
*/
show.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Public\VeterinarianController::show
* @see app/Http/Controllers/Public/VeterinarianController.php:56
* @route '/veterinarias/{id}'
*/
const showForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\VeterinarianController::show
* @see app/Http/Controllers/Public/VeterinarianController.php:56
* @route '/veterinarias/{id}'
*/
showForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\VeterinarianController::show
* @see app/Http/Controllers/Public/VeterinarianController.php:56
* @route '/veterinarias/{id}'
*/
showForm.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\Public\VeterinarianController::store
* @see app/Http/Controllers/Public/VeterinarianController.php:84
* @route '/veterinarias/agregar'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/veterinarias/agregar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Public\VeterinarianController::store
* @see app/Http/Controllers/Public/VeterinarianController.php:84
* @route '/veterinarias/agregar'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\VeterinarianController::store
* @see app/Http/Controllers/Public/VeterinarianController.php:84
* @route '/veterinarias/agregar'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Public\VeterinarianController::store
* @see app/Http/Controllers/Public/VeterinarianController.php:84
* @route '/veterinarias/agregar'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Public\VeterinarianController::store
* @see app/Http/Controllers/Public/VeterinarianController.php:84
* @route '/veterinarias/agregar'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Public\VeterinarianController::rate
* @see app/Http/Controllers/Public/VeterinarianController.php:108
* @route '/veterinarias/{id}/calificar'
*/
export const rate = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rate.url(args, options),
    method: 'post',
})

rate.definition = {
    methods: ["post"],
    url: '/veterinarias/{id}/calificar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Public\VeterinarianController::rate
* @see app/Http/Controllers/Public/VeterinarianController.php:108
* @route '/veterinarias/{id}/calificar'
*/
rate.url = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { id: args }
    }

    if (Array.isArray(args)) {
        args = {
            id: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        id: args.id,
    }

    return rate.definition.url
            .replace('{id}', parsedArgs.id.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\VeterinarianController::rate
* @see app/Http/Controllers/Public/VeterinarianController.php:108
* @route '/veterinarias/{id}/calificar'
*/
rate.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Public\VeterinarianController::rate
* @see app/Http/Controllers/Public/VeterinarianController.php:108
* @route '/veterinarias/{id}/calificar'
*/
const rateForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: rate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Public\VeterinarianController::rate
* @see app/Http/Controllers/Public/VeterinarianController.php:108
* @route '/veterinarias/{id}/calificar'
*/
rateForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: rate.url(args, options),
    method: 'post',
})

rate.form = rateForm

const VeterinarianController = { index, show, store, rate }

export default VeterinarianController