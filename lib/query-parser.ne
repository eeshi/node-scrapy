@{%
  const flatten = list => list.reduce((a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), [])
  const prune = d => flatten(d).filter(x => x !== null)
  const join = d => prune(d).join('')
%}

MAIN -> IDENTIFIER _ FILTER_LIST:? {% d => ({ getter: d[0], filters: d[2] || [] }) %}

FILTER_LIST ->
    FILTER
  | FILTER_LIST _ FILTER {% d => flatten([d[0], d[2]]) %}

FILTER -> "|" _ IDENTIFIER FILTER_ARG:* {% d => ({
  name: d[2],
  args: d[3]
}) %}

FILTER_ARG -> ":" VALUE {% d => d[1] %}

IDENTIFIER -> ID_START [a-zA-Z0-9_$]:* {% join %}

ID_START -> [a-zA-Z$_] {% id %}

VALUE ->
    NUMBER {% id %}
  | STRING {% id %}
  | SYMBOL {% id %}

SYMBOL -> [a-zA-Z]:+ {% join %}

NUMBER -> "-":? ("0" | [1-9] [0-9]:* ) ("." [0-9]:+ ):? ( [eE] [+-]:? [0-9]:+):? {% d => {
  return Number.parseFloat(
    join(d)
  )
} %}

STRING ->
    SINGLE_QUOTE_STRING {% id %}
  | DOUBLE_QUOTE_STRING {% id %}

SINGLE_QUOTE_STRING -> "'" SINGLE_QUOTE_CHAR:* "'" {% d => join(d[1]) %}

DOUBLE_QUOTE_STRING -> "\"" DOUBLE_QUOTE_CHAR:* "\"" {% d => join(d[1]) %}

SINGLE_QUOTE_CHAR ->
    [^'] {% id %}
  | "\\'" {% () => "'" %}

DOUBLE_QUOTE_CHAR ->
    [^"] {% id %}
  | "\\\"" {% () => '"' %}

_ -> WSCHAR:* {% d => d[0] ? ' ' : null %}

WSCHAR -> [ \t\n\v\f] {% join %}
