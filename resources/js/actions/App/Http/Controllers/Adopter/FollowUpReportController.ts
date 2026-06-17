import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Adopter\FollowUpReportController::index
* @see app/Http/Controllers/Adopter/FollowUpReportController.php:18
* @route '/mi-adopcion/seguimientos'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/mi-adopcion/seguimientos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Adopter\FollowUpReportController::index
* @see app/Http/Controllers/Adopter/FollowUpReportController.php:18
* @route '/mi-adopcion/seguimientos'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Adopter\FollowUpReportController::index
* @see app/Http/Controllers/Adopter/FollowUpReportController.php:18
* @route '/mi-adopcion/seguimientos'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Adopter\FollowUpReportController::index
* @see app/Http/Controllers/Adopter/FollowUpReportController.php:18
* @route '/mi-adopcion/seguimientos'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Adopter\FollowUpReportController::index
* @see app/Http/Controllers/Adopter/FollowUpReportController.php:18
* @route '/mi-adopcion/seguimientos'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Adopter\FollowUpReportController::index
* @see app/Http/Controllers/Adopter/FollowUpReportController.php:18
* @route '/mi-adopcion/seguimientos'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Adopter\FollowUpReportController::index
* @see app/Http/Controllers/Adopter/FollowUpReportController.php:18
* @route '/mi-adopcion/seguimientos'
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
* @see \App\Http\Controllers\Adopter\FollowUpReportController::show
* @see app/Http/Controllers/Adopter/FollowUpReportController.php:27
* @route '/mi-adopcion/seguimientos/{followUp}'
*/
export const show = (args: { followUp: number | { id: number } } | [followUp: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/mi-adopcion/seguimientos/{followUp}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Adopter\FollowUpReportController::show
* @see app/Http/Controllers/Adopter/FollowUpReportController.php:27
* @route '/mi-adopcion/seguimientos/{followUp}'
*/
show.url = (args: { followUp: number | { id: number } } | [followUp: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { followUp: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { followUp: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            followUp: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        followUp: typeof args.followUp === 'object'
        ? args.followUp.id
        : args.followUp,
    }

    return show.definition.url
            .replace('{followUp}', parsedArgs.followUp.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Adopter\FollowUpReportController::show
* @see app/Http/Controllers/Adopter/FollowUpReportController.php:27
* @route '/mi-adopcion/seguimientos/{followUp}'
*/
show.get = (args: { followUp: number | { id: number } } | [followUp: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Adopter\FollowUpReportController::show
* @see app/Http/Controllers/Adopter/FollowUpReportController.php:27
* @route '/mi-adopcion/seguimientos/{followUp}'
*/
show.head = (args: { followUp: number | { id: number } } | [followUp: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Adopter\FollowUpReportController::show
* @see app/Http/Controllers/Adopter/FollowUpReportController.php:27
* @route '/mi-adopcion/seguimientos/{followUp}'
*/
const showForm = (args: { followUp: number | { id: number } } | [followUp: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Adopter\FollowUpReportController::show
* @see app/Http/Controllers/Adopter/FollowUpReportController.php:27
* @route '/mi-adopcion/seguimientos/{followUp}'
*/
showForm.get = (args: { followUp: number | { id: number } } | [followUp: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Adopter\FollowUpReportController::show
* @see app/Http/Controllers/Adopter/FollowUpReportController.php:27
* @route '/mi-adopcion/seguimientos/{followUp}'
*/
showForm.head = (args: { followUp: number | { id: number } } | [followUp: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Adopter\FollowUpReportController::report
* @see app/Http/Controllers/Adopter/FollowUpReportController.php:42
* @route '/mi-adopcion/seguimientos/{followUp}/reportar'
*/
export const report = (args: { followUp: number | { id: number } } | [followUp: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: report.url(args, options),
    method: 'post',
})

report.definition = {
    methods: ["post"],
    url: '/mi-adopcion/seguimientos/{followUp}/reportar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Adopter\FollowUpReportController::report
* @see app/Http/Controllers/Adopter/FollowUpReportController.php:42
* @route '/mi-adopcion/seguimientos/{followUp}/reportar'
*/
report.url = (args: { followUp: number | { id: number } } | [followUp: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { followUp: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { followUp: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            followUp: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        followUp: typeof args.followUp === 'object'
        ? args.followUp.id
        : args.followUp,
    }

    return report.definition.url
            .replace('{followUp}', parsedArgs.followUp.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Adopter\FollowUpReportController::report
* @see app/Http/Controllers/Adopter/FollowUpReportController.php:42
* @route '/mi-adopcion/seguimientos/{followUp}/reportar'
*/
report.post = (args: { followUp: number | { id: number } } | [followUp: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: report.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Adopter\FollowUpReportController::report
* @see app/Http/Controllers/Adopter/FollowUpReportController.php:42
* @route '/mi-adopcion/seguimientos/{followUp}/reportar'
*/
const reportForm = (args: { followUp: number | { id: number } } | [followUp: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: report.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Adopter\FollowUpReportController::report
* @see app/Http/Controllers/Adopter/FollowUpReportController.php:42
* @route '/mi-adopcion/seguimientos/{followUp}/reportar'
*/
reportForm.post = (args: { followUp: number | { id: number } } | [followUp: number | { id: number } ] | number | { id: number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: report.url(args, options),
    method: 'post',
})

report.form = reportForm

const FollowUpReportController = { index, show, report }

export default FollowUpReportController