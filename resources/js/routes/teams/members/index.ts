import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see routes/web.php:134
* @route '/{current_team}/miembros'
*/
export const index = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/{current_team}/miembros',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:134
* @route '/{current_team}/miembros'
*/
index.url = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { current_team: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'slug' in args) {
        args = { current_team: args.slug }
    }

    if (Array.isArray(args)) {
        args = {
            current_team: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        current_team: typeof args.current_team === 'object'
        ? args.current_team.slug
        : args.current_team,
    }

    return index.definition.url
            .replace('{current_team}', parsedArgs.current_team.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see routes/web.php:134
* @route '/{current_team}/miembros'
*/
index.get = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(args, options),
    method: 'get',
})

/**
* @see routes/web.php:134
* @route '/{current_team}/miembros'
*/
index.head = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(args, options),
    method: 'head',
})

/**
* @see routes/web.php:134
* @route '/{current_team}/miembros'
*/
const indexForm = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see routes/web.php:134
* @route '/{current_team}/miembros'
*/
indexForm.get = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(args, options),
    method: 'get',
})

/**
* @see routes/web.php:134
* @route '/{current_team}/miembros'
*/
indexForm.head = (args: { current_team: string | { slug: string } } | [current_team: string | { slug: string } ] | string | { slug: string }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
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
* @see \App\Http\Controllers\Teams\TeamMemberController::update
* @see app/Http/Controllers/Teams/TeamMemberController.php:19
* @route '/settings/teams/{team}/members/{user}'
*/
export const update = (args: { team: string | { slug: string }, user: number | { id: number } } | [team: string | { slug: string }, user: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

update.definition = {
    methods: ["patch"],
    url: '/settings/teams/{team}/members/{user}',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\Teams\TeamMemberController::update
* @see app/Http/Controllers/Teams/TeamMemberController.php:19
* @route '/settings/teams/{team}/members/{user}'
*/
update.url = (args: { team: string | { slug: string }, user: number | { id: number } } | [team: string | { slug: string }, user: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            team: args[0],
            user: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        team: typeof args.team === 'object'
        ? args.team.slug
        : args.team,
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return update.definition.url
            .replace('{team}', parsedArgs.team.toString())
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Teams\TeamMemberController::update
* @see app/Http/Controllers/Teams/TeamMemberController.php:19
* @route '/settings/teams/{team}/members/{user}'
*/
update.patch = (args: { team: string | { slug: string }, user: number | { id: number } } | [team: string | { slug: string }, user: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: update.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\Teams\TeamMemberController::update
* @see app/Http/Controllers/Teams/TeamMemberController.php:19
* @route '/settings/teams/{team}/members/{user}'
*/
const updateForm = (args: { team: string | { slug: string }, user: number | { id: number } } | [team: string | { slug: string }, user: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teams\TeamMemberController::update
* @see app/Http/Controllers/Teams/TeamMemberController.php:19
* @route '/settings/teams/{team}/members/{user}'
*/
updateForm.patch = (args: { team: string | { slug: string }, user: number | { id: number } } | [team: string | { slug: string }, user: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: update.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PATCH',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

update.form = updateForm

/**
* @see \App\Http\Controllers\Teams\TeamMemberController::destroy
* @see app/Http/Controllers/Teams/TeamMemberController.php:38
* @route '/settings/teams/{team}/members/{user}'
*/
export const destroy = (args: { team: string | { slug: string }, user: number | { id: number } } | [team: string | { slug: string }, user: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

destroy.definition = {
    methods: ["delete"],
    url: '/settings/teams/{team}/members/{user}',
} satisfies RouteDefinition<["delete"]>

/**
* @see \App\Http\Controllers\Teams\TeamMemberController::destroy
* @see app/Http/Controllers/Teams/TeamMemberController.php:38
* @route '/settings/teams/{team}/members/{user}'
*/
destroy.url = (args: { team: string | { slug: string }, user: number | { id: number } } | [team: string | { slug: string }, user: number | { id: number } ], options?: RouteQueryOptions) => {
    if (Array.isArray(args)) {
        args = {
            team: args[0],
            user: args[1],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        team: typeof args.team === 'object'
        ? args.team.slug
        : args.team,
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return destroy.definition.url
            .replace('{team}', parsedArgs.team.toString())
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Teams\TeamMemberController::destroy
* @see app/Http/Controllers/Teams/TeamMemberController.php:38
* @route '/settings/teams/{team}/members/{user}'
*/
destroy.delete = (args: { team: string | { slug: string }, user: number | { id: number } } | [team: string | { slug: string }, user: number | { id: number } ], options?: RouteQueryOptions): RouteDefinition<'delete'> => ({
    url: destroy.url(args, options),
    method: 'delete',
})

/**
* @see \App\Http\Controllers\Teams\TeamMemberController::destroy
* @see app/Http/Controllers/Teams/TeamMemberController.php:38
* @route '/settings/teams/{team}/members/{user}'
*/
const destroyForm = (args: { team: string | { slug: string }, user: number | { id: number } } | [team: string | { slug: string }, user: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Teams\TeamMemberController::destroy
* @see app/Http/Controllers/Teams/TeamMemberController.php:38
* @route '/settings/teams/{team}/members/{user}'
*/
destroyForm.delete = (args: { team: string | { slug: string }, user: number | { id: number } } | [team: string | { slug: string }, user: number | { id: number } ], options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: destroy.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'DELETE',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

destroy.form = destroyForm

const members = {
    index: Object.assign(index, index),
    update: Object.assign(update, update),
    destroy: Object.assign(destroy, destroy),
}

export default members