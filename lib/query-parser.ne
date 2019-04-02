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
  | LITERAL {% id %}

LITERAL ->
    NULL {% id %}
  | TRUE {% id %}
  | FALSE {% id %}
  | SYMBOL {% id %}

SYMBOL -> [a-zA-Z]:+ {% (d, loc, reject) => {
  const token = join(d)
  return ["null", "true", "false"].includes(token) ? reject : token
} %}

NUMBER -> "-":? ("0" | [1-9] [0-9]:* ) ("." [0-9]:+ ):? ( [eE] [+-]:? [0-9]:+):? {% d => {
  return Number.parseFloat(
    join(d)
  )
} %}

STRING ->
    SINGLE_QUOTE_STRING {% id %}
  | DOUBLE_QUOTE_STRING {% id %}

SINGLE_QUOTE_STRING -> "'"  SINGLE_QUOTE_CHAR:* "'"  {% d => join(d[1]) %}

DOUBLE_QUOTE_STRING -> "\""  DOUBLE_QUOTE_CHAR:* "\""  {% d => join(d[1]) %}

SINGLE_QUOTE_CHAR ->
    ESCAPED_CHAR {% id %}
  | [^'\\] {% id %}
  | "\\'" {% () => "'" %}

DOUBLE_QUOTE_CHAR ->
    ESCAPED_CHAR {% id %}
  | [^"\\] {% id %}
  | "\\\"" {% () => '"' %}

ESCAPED_CHAR ->
    "\\\\" {% () => '\\' %}
  | "\\/" {% () => '/' %}
  | "\\n" {% () => '\n' %}
  | "\\b" {% () => '\b' %}
  | "\\f" {% () => '\f' %}
  | "\\r" {% () => '\r' %}
  | "\\t" {% () => '\t' %}
  | "\\u" HEX HEX HEX HEX {% d => {
    const point = Number.parseInt(join(d.slice(1)), 16)
    if (point === 92) return '\\'
    return String.fromCodePoint(point)
  } %}

HEX -> [0-9a-fA-F] {% id %}

NULL -> "null" {% () => null %}

TRUE -> "true" {% () => true %}

FALSE -> "false" {% () => false %}

_ -> WSCHAR:* {% d => d[0] ? ' ' : null %}

WSCHAR -> [ \t\n\v\f] {% join %}
