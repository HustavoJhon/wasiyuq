import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\DniController::lookup
* @see app/Http/Controllers/Api/DniController.php:15
* @route '/api/dni/lookup'
*/
export const lookup = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: lookup.url(options),
    method: 'post',
})

lookup.definition = {
    methods: ["post"],
    url: '/api/dni/lookup',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\DniController::lookup
* @see app/Http/Controllers/Api/DniController.php:15
* @route '/api/dni/lookup'
*/
lookup.url = (options?: RouteQueryOptions) => {
    return lookup.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\DniController::lookup
* @see app/Http/Controllers/Api/DniController.php:15
* @route '/api/dni/lookup'
*/
lookup.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: lookup.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\DniController::lookup
* @see app/Http/Controllers/Api/DniController.php:15
* @route '/api/dni/lookup'
*/
const lookupForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: lookup.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\DniController::lookup
* @see app/Http/Controllers/Api/DniController.php:15
* @route '/api/dni/lookup'
*/
lookupForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: lookup.url(options),
    method: 'post',
})

lookup.form = lookupForm

const DniController = { lookup }

export default DniController