import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
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

/**
* @see \App\Http\Controllers\Adopter\ApplicationController::store
* @see app/Http/Controllers/Adopter/ApplicationController.php:27
* @route '/mascotas/{slug}/postular'
*/
export const store = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/mascotas/{slug}/postular',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Adopter\ApplicationController::store
* @see app/Http/Controllers/Adopter/ApplicationController.php:27
* @route '/mascotas/{slug}/postular'
*/
store.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { slug: args }
    }

    if (Array.isArray(args)) {
        args = {
            slug: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        slug: args.slug,
    }

    return store.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Adopter\ApplicationController::store
* @see app/Http/Controllers/Adopter/ApplicationController.php:27
* @route '/mascotas/{slug}/postular'
*/
store.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Adopter\ApplicationController::store
* @see app/Http/Controllers/Adopter/ApplicationController.php:27
* @route '/mascotas/{slug}/postular'
*/
const storeForm = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Adopter\ApplicationController::store
* @see app/Http/Controllers/Adopter/ApplicationController.php:27
* @route '/mascotas/{slug}/postular'
*/
storeForm.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(args, options),
    method: 'post',
})

store.form = storeForm

const ApplicationController = { index, store }

export default ApplicationController