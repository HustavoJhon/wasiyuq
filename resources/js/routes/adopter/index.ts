import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../wayfinder'
import dashboard074181 from './dashboard'
import applications from './applications'
import followUps from './follow-ups'
/**
* @see \App\Http\Controllers\Adopter\DashboardController::dashboard
* @see app/Http/Controllers/Adopter/DashboardController.php:13
* @route '/mi-adopcion'
*/
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/mi-adopcion',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Adopter\DashboardController::dashboard
* @see app/Http/Controllers/Adopter/DashboardController.php:13
* @route '/mi-adopcion'
*/
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Adopter\DashboardController::dashboard
* @see app/Http/Controllers/Adopter/DashboardController.php:13
* @route '/mi-adopcion'
*/
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Adopter\DashboardController::dashboard
* @see app/Http/Controllers/Adopter/DashboardController.php:13
* @route '/mi-adopcion'
*/
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Adopter\DashboardController::dashboard
* @see app/Http/Controllers/Adopter/DashboardController.php:13
* @route '/mi-adopcion'
*/
const dashboardForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Adopter\DashboardController::dashboard
* @see app/Http/Controllers/Adopter/DashboardController.php:13
* @route '/mi-adopcion'
*/
dashboardForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Adopter\DashboardController::dashboard
* @see app/Http/Controllers/Adopter/DashboardController.php:13
* @route '/mi-adopcion'
*/
dashboardForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: dashboard.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

dashboard.form = dashboardForm

const adopter = {
    dashboard: Object.assign(dashboard, dashboard074181),
    applications: Object.assign(applications, applications),
    followUps: Object.assign(followUps, followUps),
}

export default adopter