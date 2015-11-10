
Top Level

common = {
    @timestamp = timestamp
    message_code = None
    type = message_type
}

log = {
    'context': self.context,
    'logger': record.name,
    'level': record.levelname.lower(),
    'message': {
        'text': message
    }
}


event = {
    'event_type': event_type,
    'context': message_context,
    'message': {
        'text': message,
        'arguments': args
    }
}

#############################################################3

Context

always_context = {
    'blueprint_id': None,
    'deployment_id': None,
    'execution_id': ctx.execution_id,
    'workflow_id': ctx.workflow_id,
}


The next 3 sections will never show together, always one of them will be generated:

1.
node_context = {
    'node_name': ctx.node_id,
    'node_id': ctx.id,
}


2.
operation:

always_operation_context = {
    'task_id': ctx.task_id,
    'task_name': ctx.task_name,
    'task_queue': ctx.task_queue,
    'task_target': ctx.task_target,
    'operation': ctx.operation.name,
    'plugin': ctx.plugin,
    task_current_retries: ...,
    task_total_retries: ...
}

if ctx.type == NODE_INSTANCE:
    context['node_id'] = ctx.instance.id
    context['node_name'] = ctx.node.name
elif ctx.type == RELATIONSHIP_INSTANCE:
    context['source_id'] = ctx.source.instance.id
    context['source_name'] = ctx.source.node.name
    context['target_id'] = ctx.target.instance.id
    context['target_name'] = ctx.target.node.name


3.
Only for riemann based events:
riemann_context = {
    group: ...,
    policy: ...,
    trigger: ...,
    trigger-parameters: ...
}


# Note
keep in mind that in addtion to the above context field, it is exposed by public API and the user
may add additional fields to context. consider having some way of showing them.
