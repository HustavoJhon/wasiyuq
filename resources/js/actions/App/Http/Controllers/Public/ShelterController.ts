import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Public\ShelterController::index
* @see app/Http/Controllers/Public/ShelterController.php:14
* @route '/mi-adopcion/albergues'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/mi-adopcion/albergues',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\ShelterController::index
* @see app/Http/Controllers/Public/ShelterController.php:14
* @route '/mi-adopcion/albergues'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\ShelterController::index
* @see app/Http/Controllers/Public/ShelterController.php:14
* @route '/mi-adopcion/albergues'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\ShelterController::index
* @see app/Http/Controllers/Public/ShelterController.php:14
* @route '/mi-adopcion/albergues'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Public\ShelterController::index
* @see app/Http/Controllers/Public/ShelterController.php:14
* @route '/mi-adopcion/albergues'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\ShelterController::index
* @see app/Http/Controllers/Public/ShelterController.php:14
* @route '/mi-adopcion/albergues'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\ShelterController::index
* @see app/Http/Controllers/Public/ShelterController.php:14
* @route '/mi-adopcion/albergues'
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
* @see \App\Http\Controllers\Public\ShelterController::show
* @see app/Http/Controllers/Public/ShelterController.php:35
* @route '/mi-adopcion/albergues/{id}'
*/
export const show = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/mi-adopcion/albergues/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\ShelterController::show
* @see app/Http/Controllers/Public/ShelterController.php:35
* @route '/mi-adopcion/albergues/{id}'
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
* @see \App\Http\Controllers\Public\ShelterController::show
* @see app/Http/Controllers/Public/ShelterController.php:35
* @route '/mi-adopcion/albergues/{id}'
*/
show.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\ShelterController::show
* @see app/Http/Controllers/Public/ShelterController.php:35
* @route '/mi-adopcion/albergues/{id}'
*/
show.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Public\ShelterController::show
* @see app/Http/Controllers/Public/ShelterController.php:35
* @route '/mi-adopcion/albergues/{id}'
*/
const showForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\ShelterController::show
* @see app/Http/Controllers/Public/ShelterController.php:35
* @route '/mi-adopcion/albergues/{id}'
*/
showForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\ShelterController::show
* @see app/Http/Controllers/Public/ShelterController.php:35
* @route '/mi-adopcion/albergues/{id}'
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
* @see \App\Http\Controllers\Public\ShelterController::store
* @see app/Http/Controllers/Public/ShelterController.php:50
* @route '/mi-adopcion/albergues/agregar'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/mi-adopcion/albergues/agregar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Public\ShelterController::store
* @see app/Http/Controllers/Public/ShelterController.php:50
* @route '/mi-adopcion/albergues/agregar'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\ShelterController::store
* @see app/Http/Controllers/Public/ShelterController.php:50
* @route '/mi-adopcion/albergues/agregar'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Public\ShelterController::store
* @see app/Http/Controllers/Public/ShelterController.php:50
* @route '/mi-adopcion/albergues/agregar'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Public\ShelterController::store
* @see app/Http/Controllers/Public/ShelterController.php:50
* @route '/mi-adopcion/albergues/agregar'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Public\ShelterController::rate
* @see app/Http/Controllers/Public/ShelterController.php:64
* @route '/mi-adopcion/albergues/{id}/calificar'
*/
export const rate = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rate.url(args, options),
    method: 'post',
})

rate.definition = {
    methods: ["post"],
    url: '/mi-adopcion/albergues/{id}/calificar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Public\ShelterController::rate
* @see app/Http/Controllers/Public/ShelterController.php:64
* @route '/mi-adopcion/albergues/{id}/calificar'
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
* @see \App\Http\Controllers\Public\ShelterController::rate
* @see app/Http/Controllers/Public/ShelterController.php:64
* @route '/mi-adopcion/albergues/{id}/calificar'
*/
rate.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Public\ShelterController::rate
* @see app/Http/Controllers/Public/ShelterController.php:64
* @route '/mi-adopcion/albergues/{id}/calificar'
*/
const rateForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: rate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Public\ShelterController::rate
* @see app/Http/Controllers/Public/ShelterController.php:64
* @route '/mi-adopcion/albergues/{id}/calificar'
*/
rateForm.post = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: rate.url(args, options),
    method: 'post',
})

rate.form = rateForm

const ShelterController = { index, show, store, rate }

export default ShelterController