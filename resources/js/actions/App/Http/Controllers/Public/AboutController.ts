import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Public\AboutController::index
* @see app/Http/Controllers/Public/AboutController.php:10
* @route '/sobre-nosotros'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/sobre-nosotros',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Public\AboutController::index
* @see app/Http/Controllers/Public/AboutController.php:10
* @route '/sobre-nosotros'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Public\AboutController::index
* @see app/Http/Controllers/Public/AboutController.php:10
* @route '/sobre-nosotros'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\AboutController::index
* @see app/Http/Controllers/Public/AboutController.php:10
* @route '/sobre-nosotros'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Public\AboutController::index
* @see app/Http/Controllers/Public/AboutController.php:10
* @route '/sobre-nosotros'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\AboutController::index
* @see app/Http/Controllers/Public/AboutController.php:10
* @route '/sobre-nosotros'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Public\AboutController::index
* @see app/Http/Controllers/Public/AboutController.php:10
* @route '/sobre-nosotros'
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

const AboutController = { index }

export default AboutController