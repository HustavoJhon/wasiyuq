import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Adopter\DashboardController::index
* @see app/Http/Controllers/Adopter/DashboardController.php:13
* @route '/mi-adopcion'
*/
const indexbbf9b25e49836c941d4db9da2f439941 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexbbf9b25e49836c941d4db9da2f439941.url(options),
    method: 'get',
})

indexbbf9b25e49836c941d4db9da2f439941.definition = {
    methods: ["get","head"],
    url: '/mi-adopcion',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Adopter\DashboardController::index
* @see app/Http/Controllers/Adopter/DashboardController.php:13
* @route '/mi-adopcion'
*/
indexbbf9b25e49836c941d4db9da2f439941.url = (options?: RouteQueryOptions) => {
    return indexbbf9b25e49836c941d4db9da2f439941.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Adopter\DashboardController::index
* @see app/Http/Controllers/Adopter/DashboardController.php:13
* @route '/mi-adopcion'
*/
indexbbf9b25e49836c941d4db9da2f439941.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: indexbbf9b25e49836c941d4db9da2f439941.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Adopter\DashboardController::index
* @see app/Http/Controllers/Adopter/DashboardController.php:13
* @route '/mi-adopcion'
*/
indexbbf9b25e49836c941d4db9da2f439941.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: indexbbf9b25e49836c941d4db9da2f439941.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Adopter\DashboardController::index
* @see app/Http/Controllers/Adopter/DashboardController.php:13
* @route '/mi-adopcion'
*/
const indexbbf9b25e49836c941d4db9da2f439941Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexbbf9b25e49836c941d4db9da2f439941.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Adopter\DashboardController::index
* @see app/Http/Controllers/Adopter/DashboardController.php:13
* @route '/mi-adopcion'
*/
indexbbf9b25e49836c941d4db9da2f439941Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexbbf9b25e49836c941d4db9da2f439941.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Adopter\DashboardController::index
* @see app/Http/Controllers/Adopter/DashboardController.php:13
* @route '/mi-adopcion'
*/
indexbbf9b25e49836c941d4db9da2f439941Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: indexbbf9b25e49836c941d4db9da2f439941.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

indexbbf9b25e49836c941d4db9da2f439941.form = indexbbf9b25e49836c941d4db9da2f439941Form
/**
* @see \App\Http\Controllers\Adopter\DashboardController::index
* @see app/Http/Controllers/Adopter/DashboardController.php:13
* @route '/mi-adopcion/inicio'
*/
const index8f3568cc7ebdf86ba48e2558f4ef1773 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index8f3568cc7ebdf86ba48e2558f4ef1773.url(options),
    method: 'get',
})

index8f3568cc7ebdf86ba48e2558f4ef1773.definition = {
    methods: ["get","head"],
    url: '/mi-adopcion/inicio',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Adopter\DashboardController::index
* @see app/Http/Controllers/Adopter/DashboardController.php:13
* @route '/mi-adopcion/inicio'
*/
index8f3568cc7ebdf86ba48e2558f4ef1773.url = (options?: RouteQueryOptions) => {
    return index8f3568cc7ebdf86ba48e2558f4ef1773.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Adopter\DashboardController::index
* @see app/Http/Controllers/Adopter/DashboardController.php:13
* @route '/mi-adopcion/inicio'
*/
index8f3568cc7ebdf86ba48e2558f4ef1773.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index8f3568cc7ebdf86ba48e2558f4ef1773.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Adopter\DashboardController::index
* @see app/Http/Controllers/Adopter/DashboardController.php:13
* @route '/mi-adopcion/inicio'
*/
index8f3568cc7ebdf86ba48e2558f4ef1773.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index8f3568cc7ebdf86ba48e2558f4ef1773.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Adopter\DashboardController::index
* @see app/Http/Controllers/Adopter/DashboardController.php:13
* @route '/mi-adopcion/inicio'
*/
const index8f3568cc7ebdf86ba48e2558f4ef1773Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index8f3568cc7ebdf86ba48e2558f4ef1773.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Adopter\DashboardController::index
* @see app/Http/Controllers/Adopter/DashboardController.php:13
* @route '/mi-adopcion/inicio'
*/
index8f3568cc7ebdf86ba48e2558f4ef1773Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index8f3568cc7ebdf86ba48e2558f4ef1773.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Adopter\DashboardController::index
* @see app/Http/Controllers/Adopter/DashboardController.php:13
* @route '/mi-adopcion/inicio'
*/
index8f3568cc7ebdf86ba48e2558f4ef1773Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index8f3568cc7ebdf86ba48e2558f4ef1773.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index8f3568cc7ebdf86ba48e2558f4ef1773.form = index8f3568cc7ebdf86ba48e2558f4ef1773Form

/**
* Multiple routes resolve to \App\Http\Controllers\Adopter\DashboardController::index, so this export is a
* dictionary keyed by URI rather than a callable. Call a specific route with `index['<uri>'](...)`,
* or import the route by name from your generated `routes/` directory.
*/
export const index = {
    '/mi-adopcion': indexbbf9b25e49836c941d4db9da2f439941,
    '/mi-adopcion/inicio': index8f3568cc7ebdf86ba48e2558f4ef1773,
}

const DashboardController = { index }

export default DashboardController