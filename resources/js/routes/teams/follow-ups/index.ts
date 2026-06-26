import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Dashboard\FollowUpController::index
* @see app/Http/Controllers/Dashboard/FollowUpController.php:20
* @route '/{current_team}/seguimientos'
*/
export const index = (args: { current_team: string | number } | [current_team: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/{current_team}/seguimientos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Dashboard\FollowUpController::index
* @see app/Http/Controllers/Dashboard/FollowUpController.php:20
* @route '/{current_team}/seguimientos'
*/
index.url = (args: { current_team: string | number } | [current_team: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { current_team: args }
    }

    if (Array.isArray(args)) {
        args = {
            current_team: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        current_team: args.current_team,
    }

    return index.definition.url
            .replace('{current_team}', parsedArgs.current_team.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Dashboard\FollowUpController::index
* @see app/Http/Controllers/Dashboard/FollowUpController.php:20
* @route '/{current_team}/seguimientos'
*/
index.get = (args: { current_team: string | number } | [current_team: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Dashboard\FollowUpController::index
* @see app/Http/Controllers/Dashboard/FollowUpController.php:20
* @route '/{current_team}/seguimientos'
*/
index.head = (args: { current_team: string | number } | [current_team: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Dashboard\FollowUpController::index
* @see app/Http/Controllers/Dashboard/FollowUpController.php:20
* @route '/{current_team}/seguimientos'
*/
const indexForm = (args: { current_team: string | number } | [current_team: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Dashboard\FollowUpController::index
* @see app/Http/Controllers/Dashboard/FollowUpController.php:20
* @route '/{current_team}/seguimientos'
*/
indexForm.get = (args: { current_team: string | number } | [current_team: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Dashboard\FollowUpController::index
* @see app/Http/Controllers/Dashboard/FollowUpController.php:20
* @route '/{current_team}/seguimientos'
*/
indexForm.head = (args: { current_team: string | number } | [current_team: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Dashboard\FollowUpController::show
* @see app/Http/Controllers/Dashboard/FollowUpController.php:36
* @route '/{current_team}/seguimientos/{followUp}'
*/
export const show = (args: { current_team: string | number | { slug: string | number }, followUp: string | number | { id: string | number } } | [current_team: string | number | { slug: string | number }, followUp: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/{current_team}/seguimientos/{followUp}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Dashboard\FollowUpController::show
* @see app/Http/Controllers/Dashboard/FollowUpController.php:36
* @route '/{current_team}/seguimientos/{followUp}'
*/
show.url = (args: { current_team: string | number | { slug: string | number }, followUp: string | number | { id: string | number } } | [current_team: string | number | { slug: string | number }, followUp: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            current_team: args[0],
            followUp: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        current_team: typeof args.current_team === 'object'
        ? args.current_team.slug
        : args.current_team,
        followUp: typeof args.followUp === 'object'
        ? args.followUp.id
        : args.followUp,
    }

    return show.definition.url
            .replace('{current_team}', parsedArgs.current_team.toString())
            .replace('{followUp}', parsedArgs.followUp.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Dashboard\FollowUpController::show
* @see app/Http/Controllers/Dashboard/FollowUpController.php:36
* @route '/{current_team}/seguimientos/{followUp}'
*/
show.get = (args: { current_team: string | number | { slug: string | number }, followUp: string | number | { id: string | number } } | [current_team: string | number | { slug: string | number }, followUp: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Dashboard\FollowUpController::show
* @see app/Http/Controllers/Dashboard/FollowUpController.php:36
* @route '/{current_team}/seguimientos/{followUp}'
*/
show.head = (args: { current_team: string | number | { slug: string | number }, followUp: string | number | { id: string | number } } | [current_team: string | number | { slug: string | number }, followUp: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Dashboard\FollowUpController::show
* @see app/Http/Controllers/Dashboard/FollowUpController.php:36
* @route '/{current_team}/seguimientos/{followUp}'
*/
const showForm = (args: { current_team: string | number | { slug: string | number }, followUp: string | number | { id: string | number } } | [current_team: string | number | { slug: string | number }, followUp: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Dashboard\FollowUpController::show
* @see app/Http/Controllers/Dashboard/FollowUpController.php:36
* @route '/{current_team}/seguimientos/{followUp}'
*/
showForm.get = (args: { current_team: string | number | { slug: string | number }, followUp: string | number | { id: string | number } } | [current_team: string | number | { slug: string | number }, followUp: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Dashboard\FollowUpController::show
* @see app/Http/Controllers/Dashboard/FollowUpController.php:36
* @route '/{current_team}/seguimientos/{followUp}'
*/
showForm.head = (args: { current_team: string | number | { slug: string | number }, followUp: string | number | { id: string | number } } | [current_team: string | number | { slug: string | number }, followUp: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Dashboard\FollowUpController::complete
* @see app/Http/Controllers/Dashboard/FollowUpController.php:50
* @route '/{current_team}/seguimientos/{followUp}/completar'
*/
export const complete = (args: { current_team: string | number | { slug: string | number }, followUp: string | number | { id: string | number } } | [current_team: string | number | { slug: string | number }, followUp: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(args, options),
    method: 'post',
})

complete.definition = {
    methods: ["post"],
    url: '/{current_team}/seguimientos/{followUp}/completar',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Dashboard\FollowUpController::complete
* @see app/Http/Controllers/Dashboard/FollowUpController.php:50
* @route '/{current_team}/seguimientos/{followUp}/completar'
*/
complete.url = (args: { current_team: string | number | { slug: string | number }, followUp: string | number | { id: string | number } } | [current_team: string | number | { slug: string | number }, followUp: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            current_team: args[0],
            followUp: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        current_team: typeof args.current_team === 'object'
        ? args.current_team.slug
        : args.current_team,
        followUp: typeof args.followUp === 'object'
        ? args.followUp.id
        : args.followUp,
    }

    return complete.definition.url
            .replace('{current_team}', parsedArgs.current_team.toString())
            .replace('{followUp}', parsedArgs.followUp.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Dashboard\FollowUpController::complete
* @see app/Http/Controllers/Dashboard/FollowUpController.php:50
* @route '/{current_team}/seguimientos/{followUp}/completar'
*/
complete.post = (args: { current_team: string | number | { slug: string | number }, followUp: string | number | { id: string | number } } | [current_team: string | number | { slug: string | number }, followUp: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: complete.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Dashboard\FollowUpController::complete
* @see app/Http/Controllers/Dashboard/FollowUpController.php:50
* @route '/{current_team}/seguimientos/{followUp}/completar'
*/
const completeForm = (args: { current_team: string | number | { slug: string | number }, followUp: string | number | { id: string | number } } | [current_team: string | number | { slug: string | number }, followUp: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: complete.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Dashboard\FollowUpController::complete
* @see app/Http/Controllers/Dashboard/FollowUpController.php:50
* @route '/{current_team}/seguimientos/{followUp}/completar'
*/
completeForm.post = (args: { current_team: string | number | { slug: string | number }, followUp: string | number | { id: string | number } } | [current_team: string | number | { slug: string | number }, followUp: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: complete.url(args, options),
    method: 'post',
})

complete.form = completeForm

/**
* @see \App\Http\Controllers\Dashboard\FollowUpController::missed
* @see app/Http/Controllers/Dashboard/FollowUpController.php:59
* @route '/{current_team}/seguimientos/{followUp}/no-realizado'
*/
export const missed = (args: { current_team: string | number | { slug: string | number }, followUp: string | number | { id: string | number } } | [current_team: string | number | { slug: string | number }, followUp: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: missed.url(args, options),
    method: 'post',
})

missed.definition = {
    methods: ["post"],
    url: '/{current_team}/seguimientos/{followUp}/no-realizado',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Dashboard\FollowUpController::missed
* @see app/Http/Controllers/Dashboard/FollowUpController.php:59
* @route '/{current_team}/seguimientos/{followUp}/no-realizado'
*/
missed.url = (args: { current_team: string | number | { slug: string | number }, followUp: string | number | { id: string | number } } | [current_team: string | number | { slug: string | number }, followUp: string | number | { id: string | number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            current_team: args[0],
            followUp: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        current_team: typeof args.current_team === 'object'
        ? args.current_team.slug
        : args.current_team,
        followUp: typeof args.followUp === 'object'
        ? args.followUp.id
        : args.followUp,
    }

    return missed.definition.url
            .replace('{current_team}', parsedArgs.current_team.toString())
            .replace('{followUp}', parsedArgs.followUp.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Dashboard\FollowUpController::missed
* @see app/Http/Controllers/Dashboard/FollowUpController.php:59
* @route '/{current_team}/seguimientos/{followUp}/no-realizado'
*/
missed.post = (args: { current_team: string | number | { slug: string | number }, followUp: string | number | { id: string | number } } | [current_team: string | number | { slug: string | number }, followUp: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: missed.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Dashboard\FollowUpController::missed
* @see app/Http/Controllers/Dashboard/FollowUpController.php:59
* @route '/{current_team}/seguimientos/{followUp}/no-realizado'
*/
const missedForm = (args: { current_team: string | number | { slug: string | number }, followUp: string | number | { id: string | number } } | [current_team: string | number | { slug: string | number }, followUp: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: missed.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Dashboard\FollowUpController::missed
* @see app/Http/Controllers/Dashboard/FollowUpController.php:59
* @route '/{current_team}/seguimientos/{followUp}/no-realizado'
*/
missedForm.post = (args: { current_team: string | number | { slug: string | number }, followUp: string | number | { id: string | number } } | [current_team: string | number | { slug: string | number }, followUp: string | number | { id: string | number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: missed.url(args, options),
    method: 'post',
})

missed.form = missedForm

/**
* @see \App\Http\Controllers\Dashboard\FollowUpController::schedule
* @see app/Http/Controllers/Dashboard/FollowUpController.php:68
* @route '/{current_team}/seguimientos'
*/
export const schedule = (args: { current_team: string | number } | [current_team: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: schedule.url(args, options),
    method: 'post',
})

schedule.definition = {
    methods: ["post"],
    url: '/{current_team}/seguimientos',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Dashboard\FollowUpController::schedule
* @see app/Http/Controllers/Dashboard/FollowUpController.php:68
* @route '/{current_team}/seguimientos'
*/
schedule.url = (args: { current_team: string | number } | [current_team: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { current_team: args }
    }

    if (Array.isArray(args)) {
        args = {
            current_team: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        current_team: args.current_team,
    }

    return schedule.definition.url
            .replace('{current_team}', parsedArgs.current_team.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Dashboard\FollowUpController::schedule
* @see app/Http/Controllers/Dashboard/FollowUpController.php:68
* @route '/{current_team}/seguimientos'
*/
schedule.post = (args: { current_team: string | number } | [current_team: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: schedule.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Dashboard\FollowUpController::schedule
* @see app/Http/Controllers/Dashboard/FollowUpController.php:68
* @route '/{current_team}/seguimientos'
*/
const scheduleForm = (args: { current_team: string | number } | [current_team: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: schedule.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Dashboard\FollowUpController::schedule
* @see app/Http/Controllers/Dashboard/FollowUpController.php:68
* @route '/{current_team}/seguimientos'
*/
scheduleForm.post = (args: { current_team: string | number } | [current_team: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: schedule.url(args, options),
    method: 'post',
})

schedule.form = scheduleForm

const followUps = {
    index: Object.assign(index, index),
    show: Object.assign(show, show),
    complete: Object.assign(complete, complete),
    missed: Object.assign(missed, missed),
    schedule: Object.assign(schedule, schedule),
}

export default followUps