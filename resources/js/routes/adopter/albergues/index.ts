import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Public\AlbergueController::index
* @see app/Http/Controllers/Public/AlbergueController.php:14
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
* @see \App\Http\Controllers\Public\AlbergueController::index
* @see app/Http/Controllers/Public/AlbergueController.php:14
* @route '/mi-adopcion/albergues'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\AlbergueController::index
* @see app/Http/Controllers/Public/AlbergueController.php:14
* @route '/mi-adopcion/albergues'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\AlbergueController::index
* @see app/Http/Controllers/Public/AlbergueController.php:14
* @route '/mi-adopcion/albergues'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Public\AlbergueController::index
* @see app/Http/Controllers/Public/AlbergueController.php:14
* @route '/mi-adopcion/albergues'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\AlbergueController::index
* @see app/Http/Controllers/Public/AlbergueController.php:14
* @route '/mi-adopcion/albergues'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\AlbergueController::index
* @see app/Http/Controllers/Public/AlbergueController.php:14
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
* @see \App\Http\Controllers\Public\AlbergueController::show
* @see app/Http/Controllers/Public/AlbergueController.php:38
* @route '/mi-adopcion/albergues/{slug}'
*/
export const show = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/mi-adopcion/albergues/{slug}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\AlbergueController::show
* @see app/Http/Controllers/Public/AlbergueController.php:38
* @route '/mi-adopcion/albergues/{slug}'
*/
show.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return show.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\AlbergueController::show
* @see app/Http/Controllers/Public/AlbergueController.php:38
* @route '/mi-adopcion/albergues/{slug}'
*/
show.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\AlbergueController::show
* @see app/Http/Controllers/Public/AlbergueController.php:38
* @route '/mi-adopcion/albergues/{slug}'
*/
show.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Public\AlbergueController::show
* @see app/Http/Controllers/Public/AlbergueController.php:38
* @route '/mi-adopcion/albergues/{slug}'
*/
const showForm = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\AlbergueController::show
* @see app/Http/Controllers/Public/AlbergueController.php:38
* @route '/mi-adopcion/albergues/{slug}'
*/
showForm.get = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\AlbergueController::show
* @see app/Http/Controllers/Public/AlbergueController.php:38
* @route '/mi-adopcion/albergues/{slug}'
*/
showForm.head = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Public\AlbergueController::rate
* @see app/Http/Controllers/Public/AlbergueController.php:73
* @route '/mi-adopcion/albergues/{slug}/calificar'
*/
export const rate = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rate.url(args, options),
    method: 'post',
})

rate.definition = {
    methods: ["post"],
    url: '/mi-adopcion/albergues/{slug}/calificar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Public\AlbergueController::rate
* @see app/Http/Controllers/Public/AlbergueController.php:73
* @route '/mi-adopcion/albergues/{slug}/calificar'
*/
rate.url = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return rate.definition.url
            .replace('{slug}', parsedArgs.slug.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\AlbergueController::rate
* @see app/Http/Controllers/Public/AlbergueController.php:73
* @route '/mi-adopcion/albergues/{slug}/calificar'
*/
rate.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: rate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Public\AlbergueController::rate
* @see app/Http/Controllers/Public/AlbergueController.php:73
* @route '/mi-adopcion/albergues/{slug}/calificar'
*/
const rateForm = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: rate.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Public\AlbergueController::rate
* @see app/Http/Controllers/Public/AlbergueController.php:73
* @route '/mi-adopcion/albergues/{slug}/calificar'
*/
rateForm.post = (args: { slug: string | number } | [slug: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: rate.url(args, options),
    method: 'post',
})

rate.form = rateForm

const albergues = {
    index: Object.assign(index, index),
    show: Object.assign(show, show),
    rate: Object.assign(rate, rate),
}

export default albergues