import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see \App\Http\Controllers\Public\LostPetController::index
* @see app/Http/Controllers/Public/LostPetController.php:13
* @route '/mascotas-perdidas'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/mascotas-perdidas',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\LostPetController::index
* @see app/Http/Controllers/Public/LostPetController.php:13
* @route '/mascotas-perdidas'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\LostPetController::index
* @see app/Http/Controllers/Public/LostPetController.php:13
* @route '/mascotas-perdidas'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\LostPetController::index
* @see app/Http/Controllers/Public/LostPetController.php:13
* @route '/mascotas-perdidas'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Public\LostPetController::index
* @see app/Http/Controllers/Public/LostPetController.php:13
* @route '/mascotas-perdidas'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\LostPetController::index
* @see app/Http/Controllers/Public/LostPetController.php:13
* @route '/mascotas-perdidas'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\LostPetController::index
* @see app/Http/Controllers/Public/LostPetController.php:13
* @route '/mascotas-perdidas'
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
* @see \App\Http\Controllers\Public\LostPetController::show
* @see app/Http/Controllers/Public/LostPetController.php:54
* @route '/mascotas-perdidas/{id}'
*/
export const show = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/mascotas-perdidas/{id}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\LostPetController::show
* @see app/Http/Controllers/Public/LostPetController.php:54
* @route '/mascotas-perdidas/{id}'
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
* @see \App\Http\Controllers\Public\LostPetController::show
* @see app/Http/Controllers/Public/LostPetController.php:54
* @route '/mascotas-perdidas/{id}'
*/
show.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\LostPetController::show
* @see app/Http/Controllers/Public/LostPetController.php:54
* @route '/mascotas-perdidas/{id}'
*/
show.head = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Public\LostPetController::show
* @see app/Http/Controllers/Public/LostPetController.php:54
* @route '/mascotas-perdidas/{id}'
*/
const showForm = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\LostPetController::show
* @see app/Http/Controllers/Public/LostPetController.php:54
* @route '/mascotas-perdidas/{id}'
*/
showForm.get = (args: { id: string | number } | [id: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\LostPetController::show
* @see app/Http/Controllers/Public/LostPetController.php:54
* @route '/mascotas-perdidas/{id}'
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
* @see \App\Http\Controllers\Public\LostPetController::store
* @see app/Http/Controllers/Public/LostPetController.php:72
* @route '/mascotas-perdidas/reportar'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/mascotas-perdidas/reportar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Public\LostPetController::store
* @see app/Http/Controllers/Public/LostPetController.php:72
* @route '/mascotas-perdidas/reportar'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\LostPetController::store
* @see app/Http/Controllers/Public/LostPetController.php:72
* @route '/mascotas-perdidas/reportar'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Public\LostPetController::store
* @see app/Http/Controllers/Public/LostPetController.php:72
* @route '/mascotas-perdidas/reportar'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Public\LostPetController::store
* @see app/Http/Controllers/Public/LostPetController.php:72
* @route '/mascotas-perdidas/reportar'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const lostPets = {
    index: Object.assign(index, index),
    show: Object.assign(show, show),
    store: Object.assign(store, store),
}

export default lostPets